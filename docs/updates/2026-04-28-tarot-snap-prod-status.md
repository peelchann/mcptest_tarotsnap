# Tarot Snap — Production Status

> **Verified:** 2026-04-29 · **Ship date:** 2026-04-28 · **Verdict:** ✅ Working

This is a post-deploy verification of the anonymous reading logging feature
shipped on 2026-04-28 (PR [#43](https://github.com/peelchann/mcptest_tarotsnap/pull/43),
squash-merged as commit `1f19616`). The verification was performed ~21 hours
after the ship, on the live `tarot-snap.vercel.app` deployment.

---

## Previous shipped status (baseline)

The 2026-04-28 session shipped a feature that writes one row to a new
`public.anonymous_readings` Supabase table for every `/api/reading` request,
authenticated or anonymous. Before this feature, `/api/reading` was stateless
— anonymous traffic produced no record of what users asked or what the AI
returned.

**Closing state of that session:**

- HEAD on `main`: `507dc01` (debug endpoint cleanup, on top of the squash-merge
  `1f19616` and three follow-up fixes).
- Production alias `tarot-snap.vercel.app` re-pointed to deployment
  `tarot-snap-2h8lzutqm` (built from the correct Vercel project).
- 9 rows in `anonymous_readings` from end-to-end smoke tests during the
  session.
- 32 unit + integration tests green.
- Spec at `docs/superpowers/specs/2026-04-28-anonymous-reading-logging-design.md`.
- Plan at `docs/superpowers/plans/2026-04-28-anonymous-reading-logging.md`.

## What was fixed previously

Four root causes were identified and resolved in the order they cascaded:

1. **Two Vercel projects were in play.** Deploys from `/tmp/tarotsnap-repo`
   were silently going to a different project (`tarotsnap-repo`,
   `prj_xubJYrK2RsllJMKlfbLvGfF2iNSh`) than the one that owned the env vars
   (`tarot-snap`, `prj_tlHgASL0wy4lV8nbVxjiGjPAFMq9`). All other symptoms
   downstream were caused by missing env vars at runtime. Fixed by re-linking
   the working directory to the correct project.
2. **Vercel Edge middleware crashed** with `MIDDLEWARE_INVOCATION_FAILED` on
   every route. Fixed in `middleware.ts` (commit `73096fe`) by short-circuiting
   non-protected paths before the Supabase call and wrapping the auth lookup
   in a fail-open `try/catch`.
3. **The original RLS policy `FOR INSERT ... WITH CHECK (true)` was rejected**
   by Supabase Postgres for both JWT-authed REST inserts and direct
   `set role anon` sessions. Replaced (commit `0a62a2a`) with
   `FOR ALL TO public USING (true) WITH CHECK (true)`.
4. **`@supabase/supabase-js`** silently dropped inserts in the Vercel
   serverless runtime. Replaced (commit `0a62a2a`) with a direct `fetch()` to
   `/rest/v1/anonymous_readings` using `AbortController` for the 2-second
   timeout.

The middleware change also added an outer `try/catch` to `logAnonymousReading`
itself (commit `f431762`) so that synchronous failures (e.g. `hashIp` throwing
because `IP_HASH_SECRET` is missing) can never propagate up and break the
user-facing response.

---

## Current production status check

Performed against `https://tarot-snap.vercel.app` on 2026-04-29.

### Routes

| Path | HTTP | Latency |
|---|---|---|
| `/` | 200 | 281 ms |
| `/reading` | 200 | 1233 ms |
| `/reading/single` | 200 | 1279 ms |
| `/about` | 200 | 1130 ms |

### `/api/reading` end-to-end

```
POST https://tarot-snap.vercel.app/api/reading
  X-Anon-Id: 638648df-1944-4f91-ac9a-a0c38c60f2c4
  Body: {"question":"prod status verify 2026-04-29","locale":"en"}
→ 200 in 13.4 s
→ {success:true, reading:{card:"The Fool",...}, type:"initial", remainingReadings:2}
```

Corresponding `anonymous_readings` row:

```
created_at:    2026-04-29 07:49:27.355819+00
anon_id:       638648df-1944-4f91-ac9a-a0c38c60f2c4   (X-Anon-Id propagated end-to-end)
locale:        en
spread_type:   single
cards_drawn:   ["The Fool"]
ai_model:      meta-llama/llama-3.1-8b-instruct
ai_latency_ms: 10462
ai_response:   1442 chars (success path; not null)
ip_hash:       64 chars (HMAC-SHA256, present)
error:         null
```

### Deployed client wiring

Byte-level scan of all 12 JS chunks served from `/reading/single`:

| Literal | Found in |
|---|---|
| `tarotsnap_anon_id` (localStorage key) | `app/reading/single/page-39dd434f192c5f50.js` |
| `X-Anon-Id` (request header) | same chunk |
| `getAnonId` (function name) | not found — terser-mangled, expected |
| `TarotSnap` (control) | 2 chunks |
| `/api/reading` (control) | 1 chunk |

Client-side anon-id generation and propagation is live in production.

### Repo state

- HEAD on `main`: `507dc01`, working tree clean.
- All shipped artifacts present: migration SQL, `lib/anon-id.ts`,
  `lib/log-anonymous-reading.ts`, refactored `middleware.ts`, modified
  `app/api/reading/route.ts`, spec, plan, tests.
- `app/api/debug-log/` directory: removed.

### Database state

- Total rows in `anonymous_readings`: **10**
- Distinct `anon_id` values: **9**
- Most recent row: 2026-04-29 07:49:27 UTC (today's verification)

---

## Is it currently working?

**Yes.** The feature behaves as specified:

- Every `/api/reading` request lands one row regardless of success or failure.
- The `X-Anon-Id` request header sent by the client is preserved into
  `anon_id` on the row, enabling returning-user analysis.
- The middleware no longer crashes; non-auth-protected paths short-circuit
  before the Supabase call.
- Client bundle, server route, and database policy are all consistent.

## What was verified successfully

- Homepage and reading-flow pages return 200.
- Real `/api/reading` POST produces a real reading and a real DB row.
- Client JS bundle on prod contains the X-Anon-Id wiring.
- Repo `main` matches the deployed code; debug endpoint cleaned up.
- Supabase RLS policy permits inserts via the anon JWT.
- IP HMAC is computed and persisted (64 hex chars).

## What remains unverified

- **Browser-driven flow.** This verification was curl-based. We did not click
  through the UI in a real browser to exercise the React state machine. Risk
  of a UI-side regression that's invisible to API-only tests is low (the
  bundle has the wiring) but not zero.
- **Returning-user pattern from a real browser.** Confirmed via two
  `X-Anon-Id`-equal POSTs in the prior session that two rows share an
  `anon_id`. Not re-verified today.
- **Failure-path logging on prod.** We have proof from the 2026-04-28 session
  that an OpenRouter failure produces a row with `ai_response = null` and a
  populated `error` column. Not re-verified today; OpenRouter is currently
  serving real readings, so the failure path isn't being exercised.
- **Other client routes that hit `/api/reading`.** Smoke tested
  `/reading/single`. The endpoint is also called from the parent `/reading`
  flow; not separately exercised.

## Known risks / deferred items

1. **GitHub Actions keep-alive cron** — never landed. Without it, the new
   Supabase project will auto-pause after ~7 days of zero traffic. The repo
   has `SUPABASE_URL` and `SUPABASE_ANON_KEY` set as repo secrets, but the
   workflow file at `.github/workflows/keepalive.yml` doesn't exist.
   Adding it requires the `gh` token to have the `workflow` scope (one-time:
   `gh auth refresh -s workflow`).
2. **Orphaned Vercel project.** The wrong-project deployments
   (`prj_xubJYrK2RsllJMKlfbLvGfF2iNSh` aka `tarotsnap-repo`) still exist in
   Vercel. Nothing aliases to them; safe to delete from the dashboard.
3. **Orphaned preview deployments.** Several `tarotsnap-repo-*` and
   `tarot-snap-*` deployments from the debug session sit in the project's
   deployment list. Cosmetic; deletable.
4. **OpenRouter key transient 401 seen locally.** During debugging, a local
   probe with the `vercel env pull`-downloaded `OPENROUTER_API_KEY` returned
   `User not found`. The deployed prod is currently serving real readings, so
   the key is valid in production. If intermittent 500s appear in
   `anonymous_readings.error`, regenerate the key on openrouter.ai and update
   the Vercel env.
5. **No retention policy on `anonymous_readings`.** Per spec, this is
   deliberately deferred — keep forever until volume or EU traffic forces
   the issue.
6. **No admin dashboard.** Per spec, deferred. Read via Supabase SQL editor
   for now.

## Recommended next actions

In rough priority order:

1. **Land the keep-alive cron.** Without it, the project auto-pauses in a
   week and we re-enter the database-restore exercise. Web UI path:
   `github.com/peelchann/mcptest_tarotsnap/new/main/.github/workflows`,
   filename `keepalive.yml`, contents per the prior session's recommendation
   (cron-driven `curl` of `/rest/v1/chat_sessions?select=id&limit=1` with
   the existing repo secrets).
2. **Run a browser smoke test** on `tarot-snap.vercel.app/reading/single`:
   submit one reading from a fresh incognito window, confirm a row appears
   with that browser's `localStorage` UUID as the `anon_id`, refresh and do
   a second reading, confirm the second row has the same `anon_id`. This
   closes the only meaningful verification gap.
3. **Set a calendar reminder for week-1 health check** (around 2026-05-05):
   ```sql
   select count(*) as rows,
          count(distinct anon_id) as users,
          count(*) filter (where error is not null) * 100.0 / count(*) as err_pct,
          percentile_cont(0.5) within group (order by ai_latency_ms) as p50_ms,
          percentile_cont(0.95) within group (order by ai_latency_ms) as p95_ms
   from public.anonymous_readings
   where error is null;
   ```
   Healthy thresholds: error rate < 5 %, p95 latency < 5000 ms.
4. **Clean up** orphaned Vercel project + preview deployments at convenience.
5. **Watch for stale-data symptoms** that would indicate the keep-alive
   cron is overdue: `/api/reading` 500s, Supabase dashboard banner,
   middleware fail-open warnings in Vercel function logs.
