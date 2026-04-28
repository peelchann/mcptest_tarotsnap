# Anonymous Reading Logging — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist every `/api/reading` request — success and failure, anonymous and authenticated — as one row in a new `public.anonymous_readings` table, so the founder can read real product usage via Supabase SQL.

**Architecture:** New SQL migration creates the table with write-only RLS. Client generates a stable per-browser `anon_id` (UUID in `localStorage`) and sends it via `X-Anon-Id` header on every reading fetch. Server route hashes the IP with HMAC, captures OpenRouter latency + model + token usage, and writes a row through a new logging helper after each reading. Logging is awaited but timeout-bounded to 2 s — it never blocks the user-facing response by more than that.

**Tech Stack:** Next.js 14 App Router, TypeScript, `@supabase/supabase-js`, `openai` SDK (pointed at OpenRouter), Jest + jest-environment-jsdom.

**Spec:** `docs/superpowers/specs/2026-04-28-anonymous-reading-logging-design.md` is the source of truth for behavior. This plan does not redocument it; it executes it.

---

## File Structure

### Files to create

| Path | Responsibility |
|---|---|
| `supabase/migrations/20260428_anonymous_readings.sql` | Table DDL + indexes + RLS policies. One file, applied once. |
| `lib/anon-id.ts` | Client-only. Manages the per-browser UUID stored in `localStorage`. |
| `lib/log-anonymous-reading.ts` | Server-only. Exports `hashIp()` and `logAnonymousReading()`. Owns its Supabase client and the IP-hash secret read. |
| `__tests__/lib/anon-id.test.ts` | Unit tests for `getAnonId()`. |
| `__tests__/lib/log-anonymous-reading.test.ts` | Unit tests for `hashIp()` + `logAnonymousReading()` (mocked Supabase). |

### Files to modify

| Path | Why |
|---|---|
| `lib/openrouter.ts` | `generateTarotReading()` and `generateFollowUpResponse()` need to expose `model` and `usage` so the route can log them. Existing return type wrapped in a metadata envelope; existing caller (`/api/reading/route.ts`) updated. |
| `app/api/reading/route.ts` | Capture latency, model, usage; call `logAnonymousReading()` on success **and** error paths. |
| `app/reading/single/page.tsx` | 2 fetch sites (`:115`, `:258`) — add `X-Anon-Id` header. |
| `app/reading/single/SingleCardReadingClient.tsx` | 2 fetch sites (`:128`, `:271`) — add `X-Anon-Id` header. |
| `.env.local.example` | Document new `IP_HASH_SECRET` env var. |

### Files NOT to touch

- `app/api/chat/*` — separate flow, already auth-gated, separate spec
- `lib/supabase.ts` / `lib/supabase-server.ts` — these wrap auth-aware clients; logging uses its own anon-key client created inside `lib/log-anonymous-reading.ts`
- Existing rate-limit logic in `route.ts` — unchanged

---

## Branch

All work happens on a single feature branch:

```bash
git checkout -b feat/anonymous-reading-logging
```

One commit per task. Final PR squashes optional.

---

## Task 1: Create the database migration file

**Files:**
- Create: `supabase/migrations/20260428_anonymous_readings.sql`

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/20260428_anonymous_readings.sql
-- Creates the anonymous_readings table for product-usage logging.
-- See docs/superpowers/specs/2026-04-28-anonymous-reading-logging-design.md.

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

- [ ] **Step 2: Apply the migration via Supabase SQL editor**

1. Open https://supabase.com/dashboard/project/lvkghproirdvyltiqqzx/sql/new
2. Paste the contents of `supabase/migrations/20260428_anonymous_readings.sql`
3. Click **Run**
4. Expected: "Success. No rows returned." in the result panel.

- [ ] **Step 3: Verify table exists and RLS is enabled**

Run in the SQL editor:

```sql
select tablename, rowsecurity,
       (select count(*) from pg_policies p
        where p.schemaname='public' and p.tablename=t.tablename) as policy_count
from pg_tables t
where schemaname = 'public' and tablename = 'anonymous_readings';
```

Expected: 1 row, `rowsecurity = true`, `policy_count = 2`.

- [ ] **Step 4: Commit the migration file**

```bash
git add supabase/migrations/20260428_anonymous_readings.sql
git commit -m "feat(db): add anonymous_readings table with write-only RLS

Single table for logging every /api/reading invocation. Anon and
authenticated roles can INSERT; SELECT is service_role only. See
docs/superpowers/specs/2026-04-28-anonymous-reading-logging-design.md."
```

---

## Task 2: Generate IP_HASH_SECRET and add to Vercel

**Files:** none in repo (env-only).

- [ ] **Step 1: Generate a 32-byte random hex string**

```bash
openssl rand -hex 32
```

Expected: a 64-character hex string. Save to 1Password under "Tarotsnap IP_HASH_SECRET".

- [ ] **Step 2: Add to Vercel env (all 3 environments)**

From a directory linked to the `tarot-snap` Vercel project (e.g. `/tmp/tarotsnap-vercel` from prior session):

```bash
SECRET="<paste-the-64-char-hex-here>"
for env in production preview development; do
  printf "%s" "$SECRET" | vercel env add IP_HASH_SECRET "$env"
done
```

Expected: each command prints "Added Environment Variable IP_HASH_SECRET to Project tarot-snap [time]".

- [ ] **Step 3: Verify**

```bash
vercel env ls | grep IP_HASH_SECRET
```

Expected: 3 lines, one per environment, all `Encrypted`.

---

## Task 3: Implement `lib/anon-id.ts` with TDD

**Files:**
- Create: `lib/anon-id.ts`
- Test: `__tests__/lib/anon-id.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/lib/anon-id.test.ts
import { getAnonId } from '@/lib/anon-id';

describe('getAnonId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates a UUID and persists it on first call', () => {
    const id = getAnonId();
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(localStorage.getItem('tarotsnap_anon_id')).toBe(id);
  });

  it('returns the same UUID on subsequent calls', () => {
    const first = getAnonId();
    const second = getAnonId();
    expect(second).toBe(first);
  });

  it('does not write localStorage on subsequent calls', () => {
    getAnonId();
    const setSpy = jest.spyOn(Storage.prototype, 'setItem');
    getAnonId();
    expect(setSpy).not.toHaveBeenCalled();
    setSpy.mockRestore();
  });

  it('returns empty string on the server (no window)', () => {
    const originalWindow = global.window;
    // @ts-expect-error: simulate SSR
    delete global.window;
    expect(getAnonId()).toBe('');
    global.window = originalWindow;
  });
});
```

Note: `moduleNameMapper` in `jest.config.js` only covers `@/components/*` and `@/app/*`. Add a mapping for `@/lib/*`:

```js
// jest.config.js — moduleNameMapper section
moduleNameMapper: {
  '^@/components/(.*)$': '<rootDir>/app/components/$1',
  '^@/app/(.*)$': '<rootDir>/app/$1',
  '^@/lib/(.*)$': '<rootDir>/lib/$1',  // ← add this line
}
```

- [ ] **Step 2: Run the test, expect it to fail with "Cannot find module"**

```bash
npm test -- __tests__/lib/anon-id.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/anon-id'`.

- [ ] **Step 3: Implement `lib/anon-id.ts`**

```typescript
// lib/anon-id.ts
// Stable per-browser identifier for anonymous reading logging.
// Stored in localStorage; survives across visits, resets on clear-site-data.

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

- [ ] **Step 4: Run the test, expect it to pass**

```bash
npm test -- __tests__/lib/anon-id.test.ts
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/anon-id.ts __tests__/lib/anon-id.test.ts jest.config.js
git commit -m "feat(client): add getAnonId() — per-browser UUID in localStorage

First call generates a UUID and writes localStorage; subsequent calls
return the same value without re-writing. SSR-safe: returns empty
string when window is undefined. Tests cover persistence, idempotence,
and SSR fallback."
```

---

## Task 4: Implement `hashIp()` in `lib/log-anonymous-reading.ts` with TDD

**Files:**
- Create: `lib/log-anonymous-reading.ts` (partial — `hashIp` only this task)
- Test: `__tests__/lib/log-anonymous-reading.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// __tests__/lib/log-anonymous-reading.test.ts
import { hashIp } from '@/lib/log-anonymous-reading';

describe('hashIp', () => {
  const originalEnv = process.env.IP_HASH_SECRET;

  afterEach(() => {
    process.env.IP_HASH_SECRET = originalEnv;
  });

  it('returns a 64-character hex string', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    const hash = hashIp('1.2.3.4');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces the same hash for the same input + secret', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    expect(hashIp('1.2.3.4')).toBe(hashIp('1.2.3.4'));
  });

  it('produces different hashes for different IPs', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    expect(hashIp('1.2.3.4')).not.toBe(hashIp('5.6.7.8'));
  });

  it('produces different hashes when the secret changes', () => {
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    const withA = hashIp('1.2.3.4');
    process.env.IP_HASH_SECRET = 'b'.repeat(64);
    const withB = hashIp('1.2.3.4');
    expect(withA).not.toBe(withB);
  });

  it('throws when IP_HASH_SECRET is missing', () => {
    delete process.env.IP_HASH_SECRET;
    expect(() => hashIp('1.2.3.4')).toThrow(/IP_HASH_SECRET/);
  });
});
```

- [ ] **Step 2: Run the test, expect it to fail with "Cannot find module"**

```bash
npm test -- __tests__/lib/log-anonymous-reading.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/log-anonymous-reading'`.

- [ ] **Step 3: Implement `hashIp` in `lib/log-anonymous-reading.ts`**

```typescript
// lib/log-anonymous-reading.ts
import { createHmac } from 'crypto';

export function hashIp(ip: string): string {
  const secret = process.env.IP_HASH_SECRET;
  if (!secret) throw new Error('IP_HASH_SECRET not configured');
  return createHmac('sha256', secret).update(ip).digest('hex');
}
```

(`logAnonymousReading` is added in Task 5.)

- [ ] **Step 4: Run the test, expect 5 passing tests**

```bash
npm test -- __tests__/lib/log-anonymous-reading.test.ts
```

Expected: PASS — 5 tests in 1 file.

- [ ] **Step 5: Commit**

```bash
git add lib/log-anonymous-reading.ts __tests__/lib/log-anonymous-reading.test.ts
git commit -m "feat(server): add hashIp() — HMAC-SHA256 of IP with secret salt

Server-side only. Throws if IP_HASH_SECRET env var is missing —
fail fast at first request rather than silently logging unsalted hashes.
Tests cover idempotence, distinctness, secret-rotation, and missing-env
failure."
```

---

## Task 5: Implement `logAnonymousReading()` in `lib/log-anonymous-reading.ts` with TDD

**Files:**
- Modify: `lib/log-anonymous-reading.ts` (add `logAnonymousReading`)
- Modify: `__tests__/lib/log-anonymous-reading.test.ts` (add test)

- [ ] **Step 1: Add the failing test**

Append to the existing test file:

```typescript
// __tests__/lib/log-anonymous-reading.test.ts (continued)
import { logAnonymousReading } from '@/lib/log-anonymous-reading';

const mockInsert = jest.fn();
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({ insert: mockInsert }),
  }),
}));

describe('logAnonymousReading', () => {
  beforeEach(() => {
    mockInsert.mockReset();
    process.env.IP_HASH_SECRET = 'a'.repeat(64);
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'pk_test';
  });

  const baseInput = {
    anonId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    ip: '1.2.3.4',
    userAgent: 'Mozilla/5.0 test',
    referrer: 'https://google.com',
    locale: 'en',
    questionText: 'will I find love',
    spreadType: 'single',
    cardsDrawn: ['The Lovers'],
    aiResponse: 'Yes you will',
    aiModel: 'meta-llama/llama-3.1-8b-instruct',
    aiLatencyMs: 1234,
    aiTokenUsage: { prompt_tokens: 10, completion_tokens: 5 },
    error: null,
  };

  it('inserts one row with all fields mapped correctly', async () => {
    mockInsert.mockResolvedValue({ error: null });
    await logAnonymousReading(baseInput);
    expect(mockInsert).toHaveBeenCalledTimes(1);
    const inserted = mockInsert.mock.calls[0][0];
    expect(inserted).toMatchObject({
      anon_id: baseInput.anonId,
      ip_hash: expect.stringMatching(/^[0-9a-f]{64}$/),
      user_agent: baseInput.userAgent,
      question_text: baseInput.questionText,
      cards_drawn: baseInput.cardsDrawn,
      ai_response: baseInput.aiResponse,
      ai_latency_ms: 1234,
    });
  });

  it('falls back to a generated UUID when anonId is empty', async () => {
    mockInsert.mockResolvedValue({ error: null });
    await logAnonymousReading({ ...baseInput, anonId: null });
    const inserted = mockInsert.mock.calls[0][0];
    expect(inserted.anon_id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it('does not throw when Supabase returns an error', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'rls violation' } });
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(logAnonymousReading(baseInput)).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[anonymous_readings]'),
      expect.anything()
    );
    consoleSpy.mockRestore();
  });

  it('times out after 2 seconds and logs without throwing', async () => {
    jest.useFakeTimers();
    mockInsert.mockImplementation(() => new Promise(() => {})); // never resolves
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const promise = logAnonymousReading(baseInput);
    jest.advanceTimersByTime(2001);
    await expect(promise).resolves.toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[anonymous_readings]'),
      expect.objectContaining({ message: expect.stringContaining('timed out') })
    );
    consoleSpy.mockRestore();
    jest.useRealTimers();
  });
});
```

- [ ] **Step 2: Run the test, expect FAIL**

```bash
npm test -- __tests__/lib/log-anonymous-reading.test.ts
```

Expected: FAIL — `logAnonymousReading is not a function`.

- [ ] **Step 3: Implement `logAnonymousReading` (and the supporting types)**

Replace the contents of `lib/log-anonymous-reading.ts` with:

```typescript
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

export async function logAnonymousReading(input: LogInput): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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

  const timeout = new Promise<{ error: Error }>((resolve) =>
    setTimeout(() => resolve({ error: new Error('logging timed out after 2s') }), TIMEOUT_MS)
  );

  const result = (await Promise.race([insertPromise, timeout])) as { error: unknown };
  if (result?.error) {
    console.error('[anonymous_readings] insert failed:', result.error);
  }
}
```

- [ ] **Step 4: Run the test, expect PASS**

```bash
npm test -- __tests__/lib/log-anonymous-reading.test.ts
```

Expected: PASS — 9 tests total (5 from Task 4 + 4 new).

- [ ] **Step 5: Commit**

```bash
git add lib/log-anonymous-reading.ts __tests__/lib/log-anonymous-reading.test.ts
git commit -m "feat(server): add logAnonymousReading() with 2s timeout

Inserts a row into public.anonymous_readings using the anon-key
Supabase client. Failures are caught and console.error'd so logging
never blocks the user-facing /api/reading response. Timeout via
Promise.race; tests cover happy path, missing anonId fallback,
RLS/error tolerance, and timeout."
```

---

## Task 6: Refactor `lib/openrouter.ts` to expose model + usage

**Files:**
- Modify: `lib/openrouter.ts:81-129` (`generateTarotReading`) and `:131-169` (`generateFollowUpResponse`)
- Modify: `app/api/reading/route.ts:98-104, 116` (the two callers)

The route can't capture `ai_model` and `ai_token_usage` today because those live inside `getOpenAIClient().chat.completions.create()` and never escape the helper. Fix: return a metadata envelope from each helper.

- [ ] **Step 1: Modify `generateTarotReading` return type**

In `lib/openrouter.ts`, replace the existing function (lines 81–129):

```typescript
export interface ReadingResult {
  reading: TarotReading;
  model: string;
  usage: object | null;
}

export async function generateTarotReading(question: string): Promise<ReadingResult> {
  try {
    const selectedCard = cards[Math.floor(Math.random() * cards.length)];
    const promptTemplate = generateInitialReadingPrompt(question, selectedCard.name, selectedCard.keywords);

    const completion = await getOpenAIClient().chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: promptTemplate.system },
        { role: "user", content: promptTemplate.user }
      ],
      max_tokens: 600,
      temperature: 0.9,
    });

    const response = completion.choices[0]?.message?.content || "";

    const sections = {
      interpretation: extractSection(response, 'INTERPRETATION'),
      guidance: extractSection(response, 'GUIDANCE'),
      energy: extractSection(response, 'ENERGY'),
      timeframe: extractSection(response, 'TIMEFRAME'),
    };

    const reading: TarotReading = {
      card: selectedCard.name,
      meaning: selectedCard.keywords.join(', '),
      interpretation: sections.interpretation || "The universe speaks through this card with a message tailored just for you.",
      guidance: sections.guidance || "Trust in the wisdom of the cards and follow your intuition.",
      energy: sections.energy || "A mystical energy surrounds you, full of potential and transformation.",
      timeframe: sections.timeframe || "Divine timing is at work in your situation.",
      imagePath: selectedCard.imagePath,
    };

    return {
      reading,
      model: completion.model,
      usage: completion.usage ? { ...completion.usage } : null,
    };
  } catch (error) {
    console.error('Error generating tarot reading:', error);
    throw new Error('Unable to channel the mystical energies at this time. Please try again.');
  }
}
```

- [ ] **Step 2: Modify `generateFollowUpResponse` return type**

Replace the existing function (lines 131–169):

```typescript
export interface FollowUpResult {
  response: string;
  model: string;
  usage: object | null;
}

export async function generateFollowUpResponse(
  originalQuestion: string,
  cardName: string,
  cardMeaning: string,
  previousInterpretation: string,
  followUpQuestion: string,
): Promise<FollowUpResult> {
  try {
    const promptTemplate = generateFollowUpPrompt({
      originalQuestion, cardName, cardMeaning, previousInterpretation, followUpQuestion,
    });

    const completion = await getOpenAIClient().chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct",
      messages: [
        { role: "system", content: promptTemplate.system },
        { role: "user", content: promptTemplate.user },
      ],
      max_tokens: 300,
      temperature: 0.85,
    });

    const response = completion.choices[0]?.message?.content
      || "The mystical energies encourage you to trust your inner wisdom as you navigate this question.";

    return {
      response,
      model: completion.model,
      usage: completion.usage ? { ...completion.usage } : null,
    };
  } catch (error) {
    console.error('Error generating follow-up response:', error);
    throw new Error('Unable to channel the mystical energies for your follow-up question.');
  }
}
```

- [ ] **Step 3: Update the two callers in `app/api/reading/route.ts`**

In `app/api/reading/route.ts`, lines 98–104 (follow-up branch):

```typescript
// BEFORE:
//   const followUpResponse = await generateFollowUpResponse(...);
//   return NextResponse.json({ ..., response: followUpResponse, ... });

// AFTER:
const followUpResult = await generateFollowUpResponse(
  originalQuestion, cardName, cardMeaning, previousInterpretation, question.trim(),
);

return NextResponse.json({
  success: true,
  response: followUpResult.response,
  timestamp: new Date().toISOString(),
  remainingFollowUps: rateLimitResult.remaining,
  type: 'followUp',
});
```

In `app/api/reading/route.ts`, line 116 (initial branch):

```typescript
// BEFORE:
//   const reading = await generateTarotReading(question.trim());
//   return NextResponse.json({ ..., reading, ... });

// AFTER:
const initialResult = await generateTarotReading(question.trim());

return NextResponse.json({
  success: true,
  reading: initialResult.reading,
  timestamp: new Date().toISOString(),
  remainingReadings: rateLimitResult.remaining,
  type: 'initial',
});
```

The client-facing JSON shape (`response: string`, `reading: TarotReading`) is preserved.

- [ ] **Step 4: Build to verify type changes don't break anything**

```bash
npm run build
```

Expected: `Compiled successfully` from Next.js. Pay attention to any type errors in this file or `lib/openrouter.ts`.

- [ ] **Step 5: Run existing tests**

```bash
npm test
```

Expected: all existing tests still pass (only `getRandomCards.test.ts` exists today, plus our new ones).

- [ ] **Step 6: Commit**

```bash
git add lib/openrouter.ts app/api/reading/route.ts
git commit -m "refactor(openrouter): return {model, usage} alongside reading text

generateTarotReading and generateFollowUpResponse now return a
metadata envelope so the route can log the model id and token usage
per request. Client-facing JSON shape from /api/reading is unchanged."
```

---

## Task 7: Wire `logAnonymousReading()` into `/api/reading/route.ts`

**Files:**
- Modify: `app/api/reading/route.ts`

The existing route's structure: validate → rate-limit → branch (initial vs follow-up) → return. We add `logAnonymousReading()` calls in both branches and in the catch block.

- [ ] **Step 1: Add the import**

At the top of `app/api/reading/route.ts`, after the existing `import` line:

```typescript
import { logAnonymousReading } from '@/lib/log-anonymous-reading';
```

- [ ] **Step 2: Capture `anonId`, `userAgent`, `referrer`, `locale` early**

Inside `POST(request)`, just after the `clientIp` block (around line 49), add:

```typescript
const anonId = request.headers.get('x-anon-id');
const userAgent = request.headers.get('user-agent');
const referrer = request.headers.get('referer');
// `locale` arrives in the body; pull from body after json() below
```

Modify the `body` line (currently line 51) and the destructuring of body fields. After parsing `body`, extract locale:

```typescript
const body = await request.json();
const locale = typeof body.locale === 'string' ? body.locale : null;
```

- [ ] **Step 3: Wrap the follow-up `generateFollowUpResponse` call with timing + logging**

Replace lines (now around 98–113) with:

```typescript
const start = Date.now();
let followUpResult;
try {
  followUpResult = await generateFollowUpResponse(
    originalQuestion, cardName, cardMeaning, previousInterpretation, question.trim(),
  );
} catch (err) {
  await logAnonymousReading({
    anonId, ip: clientIp, userAgent, referrer, locale,
    questionText: question.trim(),
    spreadType: 'followUp',
    cardsDrawn: cardName ? [cardName] : [],
    aiResponse: null,
    aiModel: 'meta-llama/llama-3.1-8b-instruct',
    aiLatencyMs: Date.now() - start,
    aiTokenUsage: null,
    error: err instanceof Error ? err.message : String(err),
  });
  throw err; // bubble up to the outer catch
}
const followUpLatency = Date.now() - start;

await logAnonymousReading({
  anonId, ip: clientIp, userAgent, referrer, locale,
  questionText: question.trim(),
  spreadType: 'followUp',
  cardsDrawn: [cardName],
  aiResponse: followUpResult.response,
  aiModel: followUpResult.model,
  aiLatencyMs: followUpLatency,
  aiTokenUsage: followUpResult.usage,
  error: null,
});

return NextResponse.json({
  success: true,
  response: followUpResult.response,
  timestamp: new Date().toISOString(),
  remainingFollowUps: rateLimitResult.remaining,
  type: 'followUp',
});
```

- [ ] **Step 4: Wrap the initial `generateTarotReading` call with timing + logging**

Replace lines (now around 116–124) with:

```typescript
const initialStart = Date.now();
let initialResult;
try {
  initialResult = await generateTarotReading(question.trim());
} catch (err) {
  await logAnonymousReading({
    anonId, ip: clientIp, userAgent, referrer, locale,
    questionText: question.trim(),
    spreadType: 'single',
    cardsDrawn: [],
    aiResponse: null,
    aiModel: 'meta-llama/llama-3.1-8b-instruct',
    aiLatencyMs: Date.now() - initialStart,
    aiTokenUsage: null,
    error: err instanceof Error ? err.message : String(err),
  });
  throw err;
}
const initialLatency = Date.now() - initialStart;

await logAnonymousReading({
  anonId, ip: clientIp, userAgent, referrer, locale,
  questionText: question.trim(),
  spreadType: 'single',
  cardsDrawn: [initialResult.reading.card],
  aiResponse: JSON.stringify(initialResult.reading),
  aiModel: initialResult.model,
  aiLatencyMs: initialLatency,
  aiTokenUsage: initialResult.usage,
  error: null,
});

return NextResponse.json({
  success: true,
  reading: initialResult.reading,
  timestamp: new Date().toISOString(),
  remainingReadings: rateLimitResult.remaining,
  type: 'initial',
});
```

Note: we serialize the full `reading` object (not just the AI response text) because the AI response is parsed into sections by `lib/openrouter.ts`. The serialized object preserves the parsed structure — useful for analytics. If you'd rather log only raw text, change to `aiResponse: initialResult.reading.interpretation || ''`.

- [ ] **Step 5: Build and run the test suite**

```bash
npm run build
npm test
```

Expected: build success; all tests pass.

- [ ] **Step 6: Commit**

```bash
git add app/api/reading/route.ts
git commit -m "feat(api): log every /api/reading invocation to anonymous_readings

Captures anon_id (X-Anon-Id header), ip_hash, user_agent, referrer,
locale, question, cards drawn, AI response, model, latency, and token
usage. Logging happens on both success and failure paths in both
branches (initial reading + follow-up). The 2s timeout in
logAnonymousReading guarantees this never delays the response."
```

---

## Task 8: Add `X-Anon-Id` header to all 4 client fetch sites

**Files:**
- Modify: `app/reading/single/page.tsx` (lines 115, 258)
- Modify: `app/reading/single/SingleCardReadingClient.tsx` (lines 128, 271)

- [ ] **Step 1: Add the import in `app/reading/single/page.tsx`**

Near the other imports at the top of the file:

```typescript
import { getAnonId } from '@/lib/anon-id';
```

- [ ] **Step 2: Modify the fetch call at `app/reading/single/page.tsx:115`**

Find the `fetch('/api/reading', { method: 'POST', headers: {...}, ... })` block. Add `'X-Anon-Id': getAnonId(),` to the headers object:

```typescript
// BEFORE:
headers: {
  'Content-Type': 'application/json',
},

// AFTER:
headers: {
  'Content-Type': 'application/json',
  'X-Anon-Id': getAnonId(),
},
```

- [ ] **Step 3: Modify the second fetch call at `app/reading/single/page.tsx:258`**

Same pattern as Step 2 — add the `'X-Anon-Id': getAnonId(),` line.

- [ ] **Step 4: Modify `app/reading/single/SingleCardReadingClient.tsx`**

Add the import at the top:

```typescript
import { getAnonId } from '@/lib/anon-id';
```

Apply the same header addition to both fetch sites (lines 128 and 271).

- [ ] **Step 5: Build to confirm no type / import errors**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 6: Verify with grep that all 4 sites now send the header**

```bash
grep -n "X-Anon-Id" app/reading/single/page.tsx app/reading/single/SingleCardReadingClient.tsx
```

Expected: 4 matches across the 2 files.

- [ ] **Step 7: Commit**

```bash
git add app/reading/single/page.tsx app/reading/single/SingleCardReadingClient.tsx
git commit -m "feat(client): send X-Anon-Id header on every /api/reading fetch

Four call sites (two in page.tsx, two in SingleCardReadingClient.tsx)
now attach the per-browser UUID from getAnonId(). Server-side logger
uses this to identify returning anonymous users."
```

---

## Task 9: Update `.env.local.example`

**Files:**
- Modify: `.env.local.example`

- [ ] **Step 1: Read the existing file** to see its format and add the new line at the end

```bash
cat .env.local.example
```

- [ ] **Step 2: Append the new var with a comment**

Add this block (preserve any existing content):

```bash
# Server-side secret for hashing client IPs in anonymous_readings table.
# Generate with: openssl rand -hex 32
# DO NOT commit a real value — set per-environment in Vercel.
IP_HASH_SECRET=
```

- [ ] **Step 3: Commit**

```bash
git add .env.local.example
git commit -m "docs(env): document IP_HASH_SECRET in .env.local.example"
```

---

## Task 10: Final test pass + push branch + open PR

**Files:** none.

- [ ] **Step 1: Run the full test suite one more time**

```bash
npm test
```

Expected: all tests pass (existing + 9 new across 2 files).

- [ ] **Step 2: Run a clean build**

```bash
npm run build
```

Expected: `Compiled successfully`. No type errors.

- [ ] **Step 3: Push the branch**

```bash
git push -u origin feat/anonymous-reading-logging
```

Expected: push succeeds (this branch contains no `.github/workflows/` files, so `repo` scope is sufficient).

- [ ] **Step 4: Open the PR**

```bash
gh pr create --title "feat: log every /api/reading call to anonymous_readings table" --body "$(cat <<'EOF'
## Summary
- New \`public.anonymous_readings\` table (write-only RLS for anon + authenticated; service_role reads).
- Every \`/api/reading\` invocation — initial reading and follow-up, success and error — writes one row.
- Client sends a stable per-browser UUID via \`X-Anon-Id\` header (localStorage-backed).
- Server hashes IP with HMAC-SHA256 + \`IP_HASH_SECRET\` (new Vercel env var, set in all 3 environments).
- Spec: \`docs/superpowers/specs/2026-04-28-anonymous-reading-logging-design.md\`
- Plan: \`docs/superpowers/plans/2026-04-28-anonymous-reading-logging.md\`

## Test plan
- [ ] Preview deployment loads
- [ ] Visit /reading on preview, do a single-card reading
- [ ] \`select count(*) from anonymous_readings\` shows the new row with non-null \`ip_hash\`, \`anon_id\`, \`question_text\`, \`ai_response\`
- [ ] Refresh same browser, do another reading → second row, same \`anon_id\`
- [ ] New incognito session → third row, different \`anon_id\`
- [ ] Trigger a deliberate failure (e.g. submit empty question) — confirm error rows are also logged
- [ ] No regression in user-visible reading flow latency (< 200 ms added)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

Expected: PR URL printed.

---

## Task 11: Verify on Vercel preview deployment

**Files:** none — this is observation work in browser + Supabase dashboard.

- [ ] **Step 1: Wait for the Vercel preview deployment**

```bash
gh pr view --json statusCheckRollup --jq '.statusCheckRollup[] | select(.name | contains("Vercel"))'
```

Expected: status `SUCCESS` and a `targetUrl` pointing at a `*.vercel.app` preview.

- [ ] **Step 2: Open the preview URL in a fresh incognito window**

Visit `<preview-url>/reading/single`. Submit a recognizable test question (e.g. "preview test 2026-04-28").

- [ ] **Step 3: Confirm the row landed in Supabase**

In Supabase SQL editor:

```sql
select created_at, anon_id, locale, question_text, cards_drawn, ai_model, ai_latency_ms
from public.anonymous_readings
where question_text like '%preview test%'
order by created_at desc
limit 5;
```

Expected: 1 row, `anon_id` set, `ip_hash` set (not null), `cards_drawn` is a JSON array with one card name, `ai_model` populated, `ai_latency_ms > 0`.

- [ ] **Step 4: Test repeat-user identity**

In the same incognito window, refresh and submit another reading. Re-run the SQL — expect 2 rows with the **same** `anon_id`.

- [ ] **Step 5: Test new-user identity**

Open a fresh incognito window. Submit a reading. Re-run the SQL — expect 3 rows total, with 2 distinct `anon_id` values.

- [ ] **Step 6: Test error logging**

Try submitting an empty question on the preview. Re-run:

```sql
select error, question_text, ai_response from public.anonymous_readings
where error is not null
order by created_at desc limit 5;
```

Note: the API rejects empty questions with a 400 *before* `generateTarotReading` runs, so this won't actually log an error row — the validation gate is upstream. To test failure logging, temporarily break OpenRouter (e.g. set `OPENROUTER_API_KEY` to an invalid value in a one-off preview env). Skip this if it's too disruptive — the unit tests cover the error-logging code path.

- [ ] **Step 7: Confirm reading-flow UX is unchanged**

Time the reading from submit to result-rendered. Compare to your subjective baseline. Anything > 200 ms slower than before is worth investigating before merging — open a comment on the PR if so.

---

## Task 12: Merge + post-deploy smoke on production

**Files:** none.

- [ ] **Step 1: Merge the PR**

```bash
gh pr merge --squash --delete-branch
```

Expected: PR closed, branch deleted, Vercel queues a production deployment.

- [ ] **Step 2: Wait for the production deployment**

```bash
vercel ls --prod | head -3
```

Watch until a new deployment appears (timestamp = "Just now") with status `Ready`.

- [ ] **Step 3: Smoke-test the production URL**

In a fresh incognito window, visit `https://tarot-snap.vercel.app/reading/single` and submit a test reading (e.g. "prod smoke 2026-04-28").

- [ ] **Step 4: Verify the row appears**

In Supabase SQL editor:

```sql
select created_at, anon_id, ip_hash, locale, question_text, ai_model, ai_latency_ms
from public.anonymous_readings
where question_text like '%prod smoke%'
order by created_at desc limit 5;
```

Expected: 1 row, all critical fields populated.

- [ ] **Step 5: First-week health check (one week post-merge)**

Reminder query — set a calendar reminder or `/schedule` it:

```sql
-- Total volume since deploy
select count(*) from public.anonymous_readings;

-- Distinct returning users
select count(distinct anon_id) from public.anonymous_readings;

-- Error rate
select count(*) filter (where error is not null) * 100.0 / count(*) as error_pct
from public.anonymous_readings;

-- Top latencies
select percentile_cont(0.5) within group (order by ai_latency_ms) as p50,
       percentile_cont(0.95) within group (order by ai_latency_ms) as p95
from public.anonymous_readings where error is null;
```

Healthy thresholds: error rate < 5%, p95 latency < 5000 ms (LLM-bound, network-dependent).

---

## Self-review checklist (pre-merge)

Before opening the PR, verify the plan covered every spec requirement:

- [x] **Schema:** Task 1 creates the table with the exact 15 fields, indexes, and RLS policies from the spec
- [x] **`anon_id` localStorage UUID:** Task 3
- [x] **`ip_hash` HMAC-SHA256 with `IP_HASH_SECRET`:** Task 4
- [x] **`logAnonymousReading()` with 2s timeout:** Task 5
- [x] **OpenRouter metadata exposure:** Task 6
- [x] **Wire logger into both branches + catch path of route:** Task 7
- [x] **`X-Anon-Id` header on all 4 client fetch sites:** Task 8
- [x] **`.env.local.example` documents `IP_HASH_SECRET`:** Task 9
- [x] **Tests:** unit tests in Tasks 3, 4, 5; integration verification in Task 11
- [x] **Rollout order matches spec:** migration → env var → code → smoke → merge → smoke
- [x] **Backward-compat behavior** (old client without header → server falls back to fresh UUID): handled in `logAnonymousReading` (Task 5, Step 3)

---

## Out of scope reminders (per spec)

The plan deliberately does NOT include:

- ❌ Admin dashboard UI
- ❌ Anon → user linking on signup
- ❌ Auto-purge / pg_cron retention job
- ❌ Logging follow-up chats from `/api/chat/*`
- ❌ IP geolocation
- ❌ Per-row size limits / abuse rate-limit (existing IP rate limit is unchanged)

If any of these become priorities, they get their own spec + plan.
