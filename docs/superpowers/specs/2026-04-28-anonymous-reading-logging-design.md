# Anonymous Reading Logging — Design Spec

> Status: **proposed** · Author: peelchann (with Claude) · Date: 2026-04-28

## Goal

Capture every tarot reading produced by `/api/reading` — whether the requester is logged in or not — as one row in a new `public.anonymous_readings` table. Lets the founder eyeball real product usage (questions asked, AI responses, latency, returning-user patterns) via the Supabase SQL editor without standing up an analytics platform.

## Why now

The product currently writes nothing to the DB on the main reading flow. With ~18 edge requests / 6 hours and no idea what people actually ask, the founder can't tell whether the AI answers are useful, which categories of question dominate, or whether anyone comes back. A logging table is the cheapest possible foundation for those questions.

## Scope

### In scope (v1)

- New table `public.anonymous_readings` with the 15 fields below.
- Stable per-browser identifier: `anon_id` UUID generated client-side, persisted in `localStorage`, sent on every `/api/reading` request via `X-Anon-Id` header.
- Server-side hashing of request IP using HMAC-SHA256 + secret salt (raw IP is never stored).
- `/api/reading/route.ts` writes one row after each OpenRouter call — successful **and** failed.
- RLS: `anon` and `authenticated` roles can `INSERT` only. No `SELECT` policy → only `service_role` (= the founder, via dashboard) can read.
- One new env var: `IP_HASH_SECRET` (32-byte random hex), set in Vercel for all three environments.

### Out of scope (deliberately deferred)

- ❌ Admin dashboard UI — Supabase SQL editor is enough for now.
- ❌ Anon → user linking when an anonymous user later signs up — runnable as ad-hoc SQL when needed.
- ❌ Auto-purge / retention — keep forever; revisit if traffic from EU users grows or storage approaches the free-tier 500 MB DB cap.
- ❌ Logging follow-up chat messages from `/api/chat/*` — those already write to `chat_messages` for authed users, leave alone.
- ❌ IP geolocation — `ip_hash` is one-way; if country becomes important, capture it at request time as a separate column.
- ❌ Display of reading history to the anonymous user themselves.
- ❌ Per-row size limits — defer until abuse appears.

## Schema

```sql
create table public.anonymous_readings (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  anon_id         uuid not null,
  ip_hash         text not null,
  user_agent      text,
  referrer        text,
  locale          text,
  question_text   text,
  spread_type     text,
  cards_drawn     jsonb,
  ai_response     text,
  ai_model        text,
  ai_latency_ms   integer,
  ai_token_usage  jsonb,
  error           text
);

create index anonymous_readings_anon_id_idx
  on public.anonymous_readings (anon_id, created_at desc);

create index anonymous_readings_created_at_idx
  on public.anonymous_readings (created_at desc);

alter table public.anonymous_readings enable row level security;

create policy anon_insert_only
  on public.anonymous_readings for insert
  to anon with check (true);

create policy authenticated_insert_only
  on public.anonymous_readings for insert
  to authenticated with check (true);
```

### Field semantics

| Field | Type | Source | Notes |
|---|---|---|---|
| `id` | uuid | server-generated | Surrogate primary key. |
| `created_at` | timestamptz | server-generated | UTC, server clock. |
| `anon_id` | uuid | client `localStorage` (header `X-Anon-Id`) | Stable per browser. Server falls back to fresh UUID if header missing. |
| `ip_hash` | text | server (HMAC-SHA256 of req IP + `IP_HASH_SECRET`) | One-way; same IP yields same hash for the lifetime of the secret. |
| `user_agent` | text | request header `User-Agent` | Raw — not parsed. |
| `referrer` | text | request header `Referer` | Where the user came from before hitting the reading page. |
| `locale` | text | request body | `'en'` or `'zh'` — i18n setting at time of reading. |
| `question_text` | text | request body | Verbatim user input. **Will contain PII** (names, relationships). |
| `spread_type` | text | request body | `'single'` / `'three-card'` / `'celtic-cross'`. |
| `cards_drawn` | jsonb | server (post-OpenRouter) | Array of card names, e.g. `["The Fool", "The Tower"]`. |
| `ai_response` | text | OpenRouter response | Full AI output. NULL if the call failed. |
| `ai_model` | text | OpenRouter response | Model id, e.g. `'google/gemini-2.0-flash-001'`. |
| `ai_latency_ms` | integer | server (wall clock around OpenRouter call) | For perf trends. |
| `ai_token_usage` | jsonb | OpenRouter response | `{prompt_tokens: 800, completion_tokens: 400, total_tokens: 1200}`. |
| `error` | text | server (catch block) | NULL on success; error message on failure. |

### RLS rationale

- **Write-only for anon and authenticated** so the publishable key (already public) cannot be used to enumerate or read other users' rows. An attacker can only add rows, which is rate-limited upstream by the existing 3-readings-per-day-per-IP guard.
- **No SELECT policy** for non-service roles → reads are admin-only by default. The founder reads via the Supabase dashboard, which authenticates as `service_role`.
- **Both roles can INSERT** because logged-in users still hit `/api/reading`, and we want their data captured here too — single source of truth for "every reading ever produced."

### Indexes

- `(anon_id, created_at desc)` — supports "show me all readings by this anon user, newest first" queries when investigating one user's journey.
- `(created_at desc)` — supports "last N readings overall" recency queries.

## Data flow

```
Browser                                      Vercel /api/reading                   Supabase
  │                                                  │                                │
  │  POST /api/reading                               │                                │
  │  X-Anon-Id: <uuid from localStorage>             │                                │
  │  body: {question, spreadType, locale}            │                                │
  ├─────────────────────────────────────────────────▶│                                │
  │                                                  │                                │
  │                                                  │  validate input                │
  │                                                  │  check IP rate limit           │
  │                                                  │                                │
  │                                                  │  start = Date.now()            │
  │                                                  │  call OpenRouter ─────────────▶ openrouter.ai
  │                                                  │  latency = Date.now() - start │
  │                                                  │ ◀──────────────────────────── ai response
  │                                                  │                                │
  │                                                  │  await logAnonymousReading(    │
  │                                                  │     anonId, ipHash, ...         │
  │                                                  │  )                              │
  │                                                  ├──────────INSERT───────────────▶│ anonymous_readings
  │                                                  │ ◀────────────ok──────────────── │
  │                                                  │                                │
  │ ◀── 200 {reading: ...} ──────────────────────────│                                │
```

### Client side

**New file: `lib/anon-id.ts`** (~15 lines)

```ts
const KEY = 'tarotsnap_anon_id';

export function getAnonId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
```

**Modified: the reading-submit handler** (likely in `app/reading/page.tsx` or a hook called from there). Add `X-Anon-Id` header to the existing `fetch('/api/reading', ...)` call.

### Server side

**New file: `lib/log-anonymous-reading.ts`** (~40 lines)

```ts
import { createClient } from '@supabase/supabase-js';
import { createHmac, randomUUID } from 'crypto';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

function hashIp(ip: string): string {
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

export async function logAnonymousReading(input: LogInput): Promise<void> {
  const insertPromise = supabase.from('anonymous_readings').insert({
    anon_id: input.anonId || randomUUID(),
    ip_hash: hashIp(input.ip),
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

  // 2-second timeout: logging must never delay the reading response.
  const timeout = new Promise<{ error: Error }>((resolve) =>
    setTimeout(() => resolve({ error: new Error('logging timed out') }), 2000)
  );

  const result = await Promise.race([insertPromise, timeout]);
  if (result.error) {
    console.error('[anonymous_readings] insert failed:', result.error);
  }
}
```

**Modifications to `app/api/reading/route.ts`:**

1. Read `X-Anon-Id` header at the top.
2. Wrap the OpenRouter call with `Date.now()` timing.
3. After OpenRouter returns (success path), call `logAnonymousReading({...})` with the captured fields.
4. In the catch block, also call `logAnonymousReading({ aiResponse: null, error: err.message, ... })` — failed readings are part of the dataset.
5. The existing IP-based rate-limit logic (`Map`-based) is unchanged.

## Error handling

| Failure | Behavior |
|---|---|
| OpenRouter call fails | Existing 5xx response to client. **NEW:** also log a row with `ai_response = null`, `error = err.message`, `ai_latency_ms = elapsed`. Failed readings are valuable signal. |
| Supabase INSERT fails (RLS / network / outage) | Caught inside `logAnonymousReading`, logged to Vercel Functions console. Reading response to user is unaffected. |
| Supabase INSERT slow (> 2 s) | `Promise.race` timeout aborts the wait. Reading returns; one log row lost; Vercel logs note the timeout. |
| `IP_HASH_SECRET` missing in env | First request throws server-side 500. Pre-merge env-var check (see Rollout step 1) prevents this from reaching prod. |
| `X-Anon-Id` header missing or malformed (old client / curl) | Server generates a fresh UUID inline. Row is still captured; that user looks like a one-off. Acceptable. |
| User clears localStorage between visits | Looks like a new anon user. Acceptable; this is a known limit of localStorage-based identity. |

**Hard rule:** logging never breaks reading. If anything goes wrong in the logging path, it gets caught, logged to console, and the user still gets their reading.

## Testing

### Pre-merge gate (CI — extends existing `test.yml`)

- Type check + lint (already running)
- Unit test for `hashIp()`:
  - Same input + same secret → same hash
  - Same input + different secret → different hash
  - Hash is 64 hex chars
- Unit test for `getAnonId()`:
  - First call generates a UUID and writes localStorage
  - Second call returns the same UUID without writing
  - Returns `''` when `window` is undefined (SSR safety)
- Mocked integration test on `/api/reading`:
  - Stubs OpenRouter, stubs Supabase client
  - Asserts `logAnonymousReading` called exactly once per request, with the OpenRouter response captured in the input
  - Asserts the route still returns the reading when the Supabase stub rejects

### Post-deploy smoke (manual, ~5 min)

1. Visit `tarot-snap.vercel.app/reading` in incognito → submit a reading with a recognizable test question.
2. Supabase SQL editor: `select count(*), max(created_at) from anonymous_readings;` — expect 1 row, current UTC time.
3. `select question_text, ai_response, ai_latency_ms from anonymous_readings order by created_at desc limit 1;` — content matches the screen.
4. Refresh the same incognito tab → submit another reading.
5. `select count(distinct anon_id) from anonymous_readings;` — expect 1 (same anon_id reused across the two readings in one browser session).
6. New incognito session → submit a reading. `select count(distinct anon_id)` should now be 2.

### Failure-mode smoke

In a preview deployment (not prod): set `NEXT_PUBLIC_SUPABASE_URL` to an invalid value, do a reading. Expect:

- Reading still returns to the browser
- Vercel function logs show `[anonymous_readings] insert failed: ...`
- Production reading flow remains unaffected

## Rollout

One PR, no feature flag. The existing reading flow is preserved; the new code path only adds writes.

**Order of operations:**

1. **Generate the secret:** `openssl rand -hex 32` → produces a 64-char hex string. Save in 1Password.
2. **Vercel env var:** add `IP_HASH_SECRET` to all three environments (Production, Preview, Development) via the Vercel dashboard or `vercel env add`.
3. **Migration:** apply `supabase/migrations/2026-04-28_anonymous_readings.sql` (new file) to the Supabase project. Either via the SQL editor or via Supabase CLI `supabase db push`.
4. **Code PR:** add `lib/anon-id.ts`, `lib/log-anonymous-reading.ts`, modify `app/api/reading/route.ts` and the reading-submit handler. Push branch, get a Vercel preview deployment.
5. **Verify on preview** using the smoke test above against the preview URL's anon_id space.
6. **Merge to `main`:** Vercel auto-deploys to prod.
7. **Verify on prod:** same smoke test against `tarot-snap.vercel.app`.
8. **First-week health check (one week post-merge):**
   - `select count(*) from anonymous_readings;` — expect rough match to Vercel `Function Invocations` metric for `/api/reading` over the same window.
   - `select count(*) from anonymous_readings where error is not null;` — should be a small fraction. Investigate if > 5%.
   - `select count(distinct anon_id) from anonymous_readings;` — gives the founder the first real "unique user" number.

**Backward compatibility:** during the brief window between Vercel's old and new builds being live, old client builds won't send `X-Anon-Id`. The server falls back to a fresh UUID per request — those readings look like one-time anon users. Acceptable.

**Rollback:** if anything breaks, revert the code PR. The table can stay (no harm done) or be dropped with `drop table public.anonymous_readings cascade;`.

## Files touched

| Path | Change |
|---|---|
| `supabase/migrations/2026-04-28_anonymous_readings.sql` | NEW — table DDL + RLS |
| `lib/anon-id.ts` | NEW — client-side UUID helper |
| `lib/log-anonymous-reading.ts` | NEW — server-side logging helper + IP hashing |
| `app/api/reading/route.ts` | MODIFIED — capture timing, call `logAnonymousReading` on success and failure paths |
| `app/reading/page.tsx` (or the hook it uses) | MODIFIED — send `X-Anon-Id` header on the fetch call |
| `__tests__/lib/anon-id.test.ts` | NEW — unit tests |
| `__tests__/lib/log-anonymous-reading.test.ts` | NEW — unit tests for IP hashing |
| `__tests__/api/reading-route.test.ts` | NEW or MODIFIED — integration test |
| `.env.local.example` | MODIFIED — document `IP_HASH_SECRET` |

## Open questions deferred to implementation

- Exact location of the client-side fetch call to `/api/reading` — to be confirmed during implementation by reading `app/reading/page.tsx` and following the call chain. The header addition is one line wherever it lives.
- OpenRouter response shape for `ai_token_usage` — confirm the exact `usage` field structure when wiring the capture. If absent on errors, store `null`.
- Vercel request IP source — `request.headers.get('x-forwarded-for')` is the standard, but if Tarotsnap sits behind any other proxy this might need adjustment. Validate during implementation.

## Future work (not part of this PR)

- **Anon → user linking on signup.** Add a Supabase auth hook that, on user creation, looks up the most recent `anon_id` from the same browser session (passed as a sign-up form field) and adds a `user_id` column to `anonymous_readings` for back-attribution. Useful once conversion is a focus.
- **Retention policy.** Once volume crosses ~10k rows or EU traffic grows, schedule a `pg_cron` job to either delete rows older than N months or null out `question_text` after 90 days while keeping the structural columns.
- **Admin dashboard.** A small `/admin` route (auth-gated to founder email) showing top-line counts, recent questions, and error rate. Currently the SQL editor handles this in 30 seconds.
- **Question categorization.** A weekly batch job that classifies `question_text` into themes (love, career, money, etc.) and stores in a derived column. Would require an LLM pass; defer until volume justifies.
