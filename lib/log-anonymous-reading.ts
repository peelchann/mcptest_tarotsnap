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

export async function logAnonymousReading(input: LogInput): Promise<void> {
  // Logging must never break the user-facing request. Wrap the entire body
  // so that any synchronous or async failure (env var missing, supabase
  // client construction failing, hashing failing, network error) is
  // swallowed with a console.error.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const insertPromise = supabase.from('anonymous_readings').insert({
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

    const timeout = new Promise<{ error: Error }>((resolve) =>
      setTimeout(() => resolve({ error: new Error('logging timed out after 2s') }), TIMEOUT_MS)
    );

    const result = (await Promise.race([insertPromise, timeout])) as { error: unknown };
    if (result?.error) {
      console.error('[anonymous_readings] insert failed:', result.error);
    }
  } catch (err) {
    console.error('[anonymous_readings] logAnonymousReading threw:', err);
  }
}
