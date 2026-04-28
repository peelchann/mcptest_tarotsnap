// lib/log-anonymous-reading.ts
import { createClient } from '@supabase/supabase-js';
import { createHmac, randomUUID } from 'crypto';

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error('IP_HASH_SECRET not configured');
  return createHmac('sha256', secret).update(ip).digest('hex');
}

export interface LogInput {
  anonId: string | null;
  ip: string;
  userAgent: string | null;
  referrer: string | null;
  locale: string | null;
  questionText: string;
  spreadType: string;
  cardsDrawn: string[];
  aiResponse: string | null;
  aiModel: string;
  aiLatencyMs: number;
  aiTokenUsage: object | null;
  error: string | null;
}

const TIMEOUT_MS = 2000;

function safeHashIp(ip: string): string {
  // Never throw out of the logging path — if the secret is missing or
  // hashing fails for any reason, fall back to a deterministic placeholder.
  try {
    return hashIp(ip);
  } catch (err) {
    console.error('[anonymous_readings] hashIp failed:', err);
    return 'unhashed';
  }
}

// Uses fetch directly (instead of @supabase/supabase-js client) for two
// reasons:
//   1. supabase-js silently fails on Vercel's serverless runtime in some
//      cases — likely because of how the bundled fetch polyfill interacts
//      with Vercel's edge proxy. Direct fetch() works.
//   2. fewer dependencies on the hot path mean smaller cold-start time.
async function insertViaRest(payload: Record<string, unknown>): Promise<{ ok: boolean; status: number; body: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return { ok: false, status: 0, body: 'missing supabase env vars' };
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${url}/rest/v1/anonymous_readings`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body: body.slice(0, 500) };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      body: err instanceof Error ? err.message : String(err),
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function logAnonymousReading(input: LogInput): Promise<void> {
  // Logging must never break the user-facing request. Wrap the entire body
  // so that any synchronous or async failure is swallowed with a console.error.
  try {
    const result = await insertViaRest({
      anon_id: input.anonId || randomUUID(),
      ip_hash: safeHashIp(input.ip),
      user_agent: input.userAgent,
      referrer: input.referrer,
      locale: input.locale,
      question_text: input.questionText,
      spread_type: input.spreadType,
      cards_drawn: input.cardsDrawn,
      ai_response: input.aiResponse,
      ai_model: input.aiModel,
      ai_latency_ms: input.aiLatencyMs,
      ai_token_usage: input.aiTokenUsage,
      error: input.error,
    });
    if (!result.ok) {
      console.error(`[anonymous_readings] insert failed status=${result.status} body=${result.body}`);
    }
  } catch (err) {
    console.error('[anonymous_readings] logAnonymousReading threw:', err);
  }
}
