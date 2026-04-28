// Temporary diagnostic endpoint. DELETE before public launch.
// Hits the anonymous_readings logger directly and returns the result inline
// so we can see runtime errors without grepping Vercel logs.
import { NextResponse } from 'next/server';
import { logAnonymousReading } from '@/lib/log-anonymous-reading';

export const dynamic = 'force-dynamic';

export async function GET() {
  const t0 = Date.now();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
  const keyHead = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').slice(0, 20);
  const ipHashHead = (process.env.IP_HASH_SECRET ?? '').slice(0, 8);

  const env = {
    has_url: !!url,
    url_host: url ? new URL(url).host : null,
    has_anon_key: !!keyHead,
    anon_key_head: keyHead,
    has_ip_hash_secret: !!ipHashHead,
    ip_hash_secret_head: ipHashHead,
    has_global_fetch: typeof globalThis.fetch === 'function',
    runtime_node_version: process.version,
  };

  // Try a direct fetch to Supabase to verify connectivity
  let directFetch: { status: number | null; body: string; ms: number; error: string | null } = {
    status: null, body: '', ms: 0, error: null,
  };
  if (url && keyHead) {
    const start = Date.now();
    try {
      const res = await fetch(`${url}/rest/v1/anonymous_readings?select=id&limit=1`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
        },
      });
      directFetch.status = res.status;
      directFetch.body = (await res.text()).slice(0, 300);
    } catch (err) {
      directFetch.error = err instanceof Error ? err.message : String(err);
    }
    directFetch.ms = Date.now() - start;
  }

  // Try a logAnonymousReading call
  let logResult: { ok: boolean; ms: number; error: string | null } = {
    ok: false, ms: 0, error: null,
  };
  try {
    const start = Date.now();
    await logAnonymousReading({
      anonId: '00000000-0000-0000-0000-000000000000',
      ip: '127.0.0.1',
      userAgent: 'debug-log-endpoint',
      referrer: null,
      locale: 'en',
      questionText: `[debug-log] probe ${new Date().toISOString()}`,
      spreadType: 'debug',
      cardsDrawn: [],
      aiResponse: null,
      aiModel: 'debug',
      aiLatencyMs: 1,
      aiTokenUsage: null,
      error: null,
    });
    logResult.ok = true;
    logResult.ms = Date.now() - start;
  } catch (err) {
    logResult.error = err instanceof Error ? err.message : String(err);
  }

  return NextResponse.json(
    { env, directFetch, logResult, total_ms: Date.now() - t0 },
    { status: 200 }
  );
}
