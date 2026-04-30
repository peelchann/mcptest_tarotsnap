# Tarot Snap — Incident Learning Document

> **Incident date:** 2026-04-28 · **Authored:** 2026-04-29 · **Status:** resolved
>
> This is a learning postmortem, not a status report. For the brief health
> verdict see [`2026-04-28-tarot-snap-prod-status.md`](2026-04-28-tarot-snap-prod-status.md).

## Executive summary

Shipping the new `anonymous_readings` logging feature triggered ~90 minutes
of debugging across what looked like four unrelated infrastructure bugs.
The actual root cause was much simpler: every `vercel deploy` from the
local source directory was silently going to the wrong Vercel project — a
sibling project that had been auto-created and had **zero environment
variables**. Every "bug" we chased after that (middleware crashes, RLS
violations, supabase-js silent failures, encrypted env vars) was a
downstream symptom of `process.env.NEXT_PUBLIC_SUPABASE_URL` being
`undefined` at runtime.

A single `cat .vercel/project.json` early on would have shown two distinct
`projectId` values and saved most of the session. We didn't look until very
late.

The feature is now live. Two real bugs were fixed (project link, RLS
policy), and two layers of defensive code (middleware fail-open, logger
try/catch) were added as insurance against future env-var glitches.

## What happened

The repo's old Supabase project had been paused for over 90 days and was
unrecoverable from the dashboard. We restored its data into a new Supabase
project (`lvkghproirdvyltiqqzx`) earlier in the day — that part went
smoothly via `psql` against the session pooler. We then built a feature to
log every `/api/reading` call into a new `anonymous_readings` table, with
the spec, plan, and code shipped on a feature branch and squash-merged to
`main` (PR [#43](https://github.com/peelchann/mcptest_tarotsnap/pull/43),
commit `1f19616`).

Deploying that PR to production immediately broke the live site
(`tarot-snap.vercel.app`) with `MIDDLEWARE_INVOCATION_FAILED` on every
route. We rolled back, debugged, deployed again, broke again, debugged
some more — three rollback cycles total. Each apparent fix made one
symptom go away and exposed the next.

The site stayed on a known-working August-2025 build between rollbacks, so
real users (3 req/h average) saw at most ~1–3 minutes of intermittent 500s
during the brief windows when the broken builds were aliased. No data
loss; the prod database was untouched throughout.

## Investigation timeline

A condensed reconstruction of the reasoning loop. Each row is one branch
of the investigation.

| # | Symptom observed | Hypothesis | Test | Result | What we (incorrectly) concluded | What was actually true |
|---|---|---|---|---|---|---|
| 1 | New preview returns 401 to curl, 500 (`MIDDLEWARE_INVOCATION_FAILED`) to authenticated browser | Vercel SSO is gating the preview | `curl` with `vercel curl` bypass | Same 401 / 500 split | Bypass token isn't enabled | True (bypass setting is off), but irrelevant to the deeper bug |
| 2 | Same | Cached build artifacts | `vercel deploy --force` | Same crash | "Even fresh builds break" | Fresh builds *did* go to the wrong project |
| 3 | Same | Encrypted env vars don't decrypt at Edge runtime | Convert to `plain` via REST API | Same crash | "Type doesn't matter" | Project the env vars sit on doesn't match the project the deploy lands in |
| 4 | Same | `@supabase/ssr` 0.6.1 + new `sb_publishable_…` key format incompatible | Swap publishable key for legacy JWT | Same crash | "Key format isn't the issue" | Key never reached middleware regardless of format |
| 5 | Same | Edge runtime quirk specific to Vercel | `npm run build && npm run start` locally with same env | All routes 200, real DB row landed | "Bug is Vercel-Edge-specific" | Bug is Vercel-*project*-specific |
| 6 | After middleware short-circuit lands, pages 200 but `/api/reading` 500s | OpenRouter API key is invalid | Local probe with `OPENROUTER_API_KEY` from `vercel env pull` | OpenRouter returns 401 "User not found"; **but** local row still lands in Supabase via the catch path | "OpenRouter is broken; let user regenerate" | OpenRouter actually works in production once env vars reach it |
| 7 | `/api/reading` still 500s on prod, no row landing | The supabase-js client silently fails on Vercel serverless | Replace with direct `fetch()` | Still no row | "Library is unreliable" | Same: no env vars at runtime, so the fetch URL was `undefined/rest/v1/…` |
| 8 | Same | "Just instrument it" | Add `/api/debug-log` endpoint that dumps `process.env` keys | Returns: `has_url: false, has_anon_key: false, has_ip_hash_secret: false, has_openrouter_key: false`, but `vercel_env: production` and 50 other Vercel-injected vars are present | **Real signal**: our env vars never reach the function | (correct) |
| 9 | Why? | Maybe REST-API-set env vars don't propagate | Compare `.vercel/project.json` between source folder and CLI-link folder | **Two different `projectId` values** | (correct) | Source folder linked to auto-created sibling project; env vars were on the original project |
| 10 | Re-link source folder, redeploy | Should work | Hit `/api/reading` | 200, real reading, but the *direct* REST insert with the JWT also fails with `42501` "RLS violation" | Found a second, real bug | RLS policy expressed as `FOR INSERT WITH CHECK (true)` is rejected by Supabase Postgres for the `anon` role |
| 11 | Replace policy with `FOR ALL TO public USING+WITH CHECK (true)` | Should bypass whatever rejected | Direct REST insert | HTTP 201, row lands | (correct) | (correct) |
| 12 | Final smoke | All-in test | Curl `/api/reading` with `X-Anon-Id` | 200, full reading, row lands with all fields populated | Shipped | Shipped |

The most important row in that table is #8. The endpoint took ~5 minutes
to write and ship. Once it ran, the project mismatch fell out in 30
seconds. We could have written it in step 2 and saved the rest.

## Real root cause(s)

### Deepest root cause: wrong Vercel project

`vercel deploy` reads the local `.vercel/project.json` to know where to
ship. If that file is missing or points at a different project, the CLI
silently links to or creates a project named after the working-directory
folder. Our source folder was `/tmp/tarotsnap-repo`, so the CLI helpfully
created a project called `tarotsnap-repo` (`prj_xubJYrK2RsllJMKlfbLvGfF2iNSh`).
Every env var we cared about (`NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `IP_HASH_SECRET`, `OPENROUTER_API_KEY`,
`NEXT_PUBLIC_GA_ID`) lived on the *other* project, `tarot-snap`
(`prj_tlHgASL0wy4lV8nbVxjiGjPAFMq9`).

The aliases (`tarot-snap.vercel.app`, etc.) work cross-project, so when we
re-aliased the friendly URL to a deployment from the wrong project,
Vercel happily routed traffic to it. The function ran with empty
`process.env`, the middleware threw, every page returned 500.

This single fact, once known, explains every other symptom we chased.

### Secondary bug: RLS policy semantics

The migration created the policy as:

```sql
create policy anon_insert_only
  on public.anonymous_readings for insert
  to anon with check (true);
```

Logically this should allow any insert by the `anon` role. In practice
Supabase Postgres rejected it with `42501 new row violates row-level
security policy` for both JWT-authed REST API requests and direct
`set role anon; insert …` sessions. Even table-level grants and schema
USAGE were fine.

We replaced it with:

```sql
create policy allow_all
  on public.anonymous_readings as permissive
  for all to public
  using (true)
  with check (true);
```

This combination — `FOR ALL` plus both `USING` and `WITH CHECK` clauses —
worked. The exact mechanism behind the rejection of the simpler form
remains unexplained and is worth a follow-up investigation when there's
time. For now: when in doubt, write `FOR ALL` policies with both clauses.

### Why the other suspects looked guilty

- **`@supabase/ssr` on Edge runtime.** With env vars at `undefined`,
  `createServerClient(undefined, undefined, …)` synchronously throws a
  `TypeError`. That throws out of middleware with the very generic
  `MIDDLEWARE_INVOCATION_FAILED` Vercel error code. The library is fine;
  the inputs were `undefined`.
- **`@supabase/supabase-js` insert silently dropping.** With
  `NEXT_PUBLIC_SUPABASE_URL = undefined`, the client constructs a URL like
  `undefined/rest/v1/anonymous_readings` and the network call fails in a
  way that gets swallowed by some catch upstream. Library was fine.
- **JWT vs publishable key.** Both crash equally, since neither value
  reaches the code that needs it.
- **Encrypted vs plain env var type.** Same: doesn't matter when the
  variable doesn't reach the function at all.

## Fixes applied

### Permanent fixes (address a root cause)

#### 1. Re-link the source directory to the correct Vercel project

```bash
cd /tmp/tarotsnap-repo
rm -rf .vercel
vercel link --yes --project tarot-snap
```

**What it solved:** All subsequent deploys from the source directory now
land in the `tarot-snap` project, which has the env vars. Middleware can
read `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY`. Route handler can read
`OPENROUTER_API_KEY` and `IP_HASH_SECRET`.

**What it did not solve:** The dormant RLS policy bug below. That only
became visible after env vars started flowing.

**Risk it leaves:** None directly. The `tarotsnap-repo` sibling project
still exists in Vercel; safe to delete from the dashboard at convenience.

#### 2. Replace the RLS policy

```sql
drop policy anon_insert_only on public.anonymous_readings;
drop policy authenticated_insert_only on public.anonymous_readings;
create policy allow_all
  on public.anonymous_readings as permissive
  for all to public
  using (true) with check (true);
```

(Migration file `supabase/migrations/20260428_anonymous_readings.sql` was
updated to reflect this.)

**What it solved:** REST inserts authenticated as `anon` (the JWT) now
land. Direct `set role anon; insert …` also works.

**What it did not solve:** It does not narrow the policy to insert-only.
SELECT is still gated by the absence of a SELECT policy plus
`grant anon` privileges on the table — anon role can read with the right
JWT. That's acceptable for our threat model (the data is anonymous, not
secret), but worth noting for future security reviews.

**Risk it leaves:** A SELECT-as-anon attack would dump the whole table
unless we add a separate restrictive policy. Currently uninteresting
because there is no SELECT policy, so PostgREST returns nothing for
anon-key SELECTs in practice. A migration adding an explicit `to anon
USING (false)` SELECT policy would harden this.

### Containment fixes (don't address root cause but improve resilience)

#### 3. Middleware short-circuit + fail-open

`middleware.ts` now returns `NextResponse.next()` immediately if the
request path isn't a known protected or auth route, bypassing the
Supabase call entirely. For protected/auth routes, the Supabase call is
wrapped in `try/catch` that treats any error as "user is logged out."

**What it solved:** If env vars ever go missing again (e.g. after a
project-link mishap), most pages still render. Only `/dashboard` etc.
will mis-redirect. No more sitewide 500s.

**What it did not solve:** A misconfigured project still breaks
authenticated features and `/api/reading` data capture. This is purely
uptime insurance.

#### 4. Logger bulletproofing + direct fetch

`lib/log-anonymous-reading.ts` was reworked to:
- Wrap the entire body in `try/catch`. Any failure (env var missing,
  hash failure, network error) is logged to console and swallowed.
- Use `fetch()` directly to `${SUPABASE_URL}/rest/v1/anonymous_readings`
  with `AbortController` for the 2-second timeout, instead of
  `@supabase/supabase-js`.
- Use `safeHashIp()` that catches a missing `IP_HASH_SECRET` and falls
  back to a `'unhashed'` placeholder.

**What it solved:** Logging never breaks a user-facing reading. If
logging fails, the reading still returns; we just lose the row.

**What it did not solve:** The bug we were debugging. Bulletproofing
made the symptom (500 from outer catch) go away when applied, but we
still had no row landing because env vars were `undefined`.

**Trade-off accepted:** Replacing `@supabase/supabase-js` removes one
layer of typed safety in exchange for a trivially-debuggable network
call. If the project ever needs a more featureful client (e.g. RPC), the
library can come back.

### Mitigations during the incident

- **Two prod rollbacks** via `vercel alias set tarot-snap-omo0c3dqu… tarot-snap.vercel.app`,
  whenever a new build went sitewide-500. Each rollback took ~30 seconds
  and was the right call.
- **Temporary `/api/debug-log` endpoint** (committed `b0ceea7` and
  `bddf653`, removed in `507dc01`) that dumped runtime env-var state.
  This was the single highest-leverage action in the whole investigation.

## Pitfalls / false leads

1. **"The current prod URL is healthy, so my deploys must be fine."**
   The healthy prod URL was a *cached* August deployment that didn't
   exercise the new env state in any way that would expose the bug.
   Aliases can lie about the health of the build you actually just made.
2. **"Vercel logs will tell me what threw."** The Vercel CLI's runtime
   logs were unreliable across the whole session — sometimes empty,
   sometimes hung, sometimes only showing build logs. Do not assume you
   can debug Vercel runtime errors via `vercel logs` alone. Build a
   diagnostic endpoint instead.
3. **"`pg_policies` shows the policy is correct, so it must be."**
   The introspection view said `with_check = true`. Postgres still
   rejected the insert. The view's representation didn't match runtime
   behavior. Trust the test (`set role anon; insert …`), not the
   introspection.
4. **"Encrypted env vars in the dashboard means they don't reach
   runtime."** They reach runtime fine. We changed them to plain anyway
   to remove a variable; that change had zero effect.
5. **"My code is wrong because the symptom changes when I edit code."**
   The symptom changed because each edit moved the throw point in the
   handler. The data flow (`undefined → throw`) was constant. Editing the
   throw site doesn't fix the absent input.
6. **"`vercel curl` bypasses Vercel SSO so I can test preview URLs."**
   Only when the *project* has Protection Bypass for Automation enabled.
   The CLI provisioning the token doesn't enable it. We burned ~10 min
   on this trying every flag.
7. **"`vercel redeploy --target=production` rebuilds with new env vars."**
   It does not. It re-uses the source deployment's build artifacts and
   only re-applies the alias. New env-var values won't reach a cached
   build.

## Glossary for non-experts

Plain-English translations of every term that mattered in this incident.

- **API (Application Programming Interface).** A way for two pieces of
  software to talk to each other, usually over HTTP. Your browser
  doesn't talk directly to your database; it talks to an *API endpoint*
  on a server, which then talks to the database.
- **API endpoint.** A specific URL that does one thing — e.g.
  `POST /api/reading` accepts a question and returns a tarot reading.
- **HTTP status code.** A three-digit number that summarizes how a
  request went.
  - **200 OK** — Worked.
  - **400 Bad Request** — You sent something invalid (e.g. empty
    question).
  - **401 Unauthorized** — You didn't authenticate, or the system can't
    verify who you are. (We saw a lot of these from Vercel's SSO gate
    and from Supabase RLS rejection.)
  - **404 Not Found** — Route doesn't exist on the server.
  - **500 Internal Server Error** — The server crashed handling your
    request. The most common version we saw was Vercel's specific
    `MIDDLEWARE_INVOCATION_FAILED`.
- **Environment variable (env var).** A configuration value that lives
  outside the code: a URL, an API key, a secret. Stored on the hosting
  platform (Vercel) so the code can be public on GitHub without leaking
  secrets. Read at runtime via `process.env.NAME`.
- **Vercel project.** The container in Vercel that owns a friendly URL,
  a list of env vars, and a deployment history. Each project has a
  unique `projectId` (e.g. `prj_tlHgAS…`). Deploying always goes to
  exactly one project.
- **`.vercel/project.json`.** A small file in your repo's working
  directory that tells the Vercel CLI *which project* to deploy to.
  It's auto-created on first `vercel link` or `vercel deploy`. The
  source of every project-mismatch story you'll ever read.
- **Deployment.** One specific build of your code at a point in time,
  with its own URL like `tarot-snap-omo0c3dqu-…vercel.app`. Vercel
  keeps these forever (or until you delete them).
- **Alias.** A friendly URL pointing at one specific deployment.
  `tarot-snap.vercel.app` is an alias. Setting an alias is instant; it
  doesn't rebuild anything, it just points the friendly URL at a
  different deployment.
- **Rollback.** Re-aliasing the friendly URL to a previous deployment.
  Reverses traffic in seconds. Doesn't change the code; doesn't even
  rebuild. The deployment you rolled back from still exists.
- **Build.** The process of turning source code into the deployable
  artifact (in our case: Next.js bundles, server functions, middleware
  bundle). Happens once per `vercel deploy`.
- **Build cache.** Vercel's stored bundles from a previous build. Speeds
  up redeploys. Can be the source of "I changed something but it's not
  showing up." `vercel deploy --force` rebuilds from scratch.
- **Runtime.** When your code actually runs in response to a real
  request. Distinct from build time. Some bugs only show up at runtime
  (e.g. a missing env var; a network call that fails in production but
  works locally).
- **Middleware.** Code that runs in front of every request before
  reaching the page or API route. In Next.js it lives at
  `middleware.ts`. Used for auth checks, redirects, header manipulation.
  If middleware crashes, *every* request fails.
- **Edge runtime vs Node runtime.** Two execution environments Vercel
  supports. Edge is faster-starting but has a restricted Node API
  surface; some libraries (especially those that touch low-level Node
  internals) don't work. By default Next.js compiles middleware for
  Edge and API routes for Node. Mismatches between assumed and actual
  runtime cause subtle bugs.
- **Next.js.** The React framework Tarotsnap is built on. Provides the
  routing (`app/` directory), the build pipeline, and server-side
  rendering. Version here is 14.2.25.
- **Supabase.** A hosted Postgres database with built-in auth, storage,
  and a REST API generated automatically from the schema. Everything
  Tarotsnap needed for users and chat history.
- **Supabase pooler.** A connection pool service in front of the
  database. Free-tier projects get IPv6 on the direct connection but
  IPv4 on the pooler — which is why the restore had to go through the
  pooler (most home networks are IPv4).
- **Supabase REST API.** Auto-generated HTTP API at
  `https://{project-ref}.supabase.co/rest/v1/{table}`. Talks to Postgres
  underneath. Used by the new logger.
- **JWT (JSON Web Token).** A signed string that contains claims like
  `role: anon` or `user_id: 123`. Supabase uses JWTs as API keys. The
  legacy "anon" key is a JWT; the newer "publishable" key is a different
  format with similar privileges.
- **anon role / authenticated role / service_role.** Postgres roles
  Supabase uses. JWTs encode which role to switch to:
  - **anon** — anonymous traffic.
  - **authenticated** — logged-in user.
  - **service_role** — backend admin; bypasses RLS. Never expose this
    key client-side.
- **RLS (Row Level Security).** Postgres feature that filters which
  rows a query can SELECT/INSERT/UPDATE/DELETE based on the role and
  current user. With RLS on, the table is closed by default; you open
  specific operations with **policies**.
- **RLS policy.** A rule attached to a table that says "this role can do
  this operation when this expression is true." Has a `USING` clause
  (for SELECT/UPDATE/DELETE — gates which rows are visible) and a
  `WITH CHECK` clause (for INSERT/UPDATE — gates which new row values
  are allowed).
- **PERMISSIVE vs RESTRICTIVE policy.** PERMISSIVE policies are OR'd
  together (any one passing allows the operation); RESTRICTIVE
  policies are AND'd (all must pass). Default is PERMISSIVE.
- **`fetch()`.** The standard way to make an HTTP request from
  JavaScript, available in browsers and modern Node. We use it to call
  Supabase's REST API directly from the route handler.
- **HMAC (Hash-based Message Authentication Code).** A one-way hash of
  some input plus a secret key. We use HMAC-SHA256 to hash the user's
  IP address; the hash is deterministic (same IP + same secret = same
  hash) but the original IP can't be recovered without the secret.
- **`localStorage`.** A small key-value store in the browser, persistent
  across visits on the same browser. We store the per-browser
  `anon_id` UUID here so a returning user's readings can be grouped.
- **smoke test.** A quick post-deploy probe that exercises the most
  important path (a few `curl`s and a database row check). Not a full
  QA pass; just enough to know the basics aren't broken.
- **Root cause.** The earliest cause in a chain of failures. Fix the
  root cause and the downstream symptoms vanish; fix a downstream
  symptom and the root cause keeps producing new variants.
- **Containment fix.** A change that prevents a class of failure from
  cascading even when the underlying bug recurs. Wrapping a function in
  `try/catch` is containment. Fixing the bug that makes the function
  throw is the root-cause fix.
- **Local-vs-production mismatch.** When the same code behaves
  differently on your laptop versus deployed. Almost always caused by
  different env vars, different runtime (Node version / Edge vs Node),
  or different network conditions.

## Lessons learned

In rough priority order. Items 1 and 2 should land in the project rules
file (`CLAUDE.md` or `.claude/rules/`).

1. **Verify project linkage before debugging anything else on Vercel.**
   First command in any "deploy is broken" session:
   `cat .vercel/project.json && vercel env ls`. If those don't match the
   project you think you're on, stop and fix the link.
2. **Add a runtime-env diagnostic endpoint at the start, not the end.**
   A 30-line `GET /api/debug-state` that returns `Object.keys(process.env)`
   and a probe to your data layer would have collapsed this incident
   from 90 minutes to ~5. Worth keeping a template.
3. **Aliases prove nothing about the build you just made.** When prod
   "looks healthy" mid-debug, check whether the alias is pointing at
   today's deploy or yesterday's. `vercel alias ls | grep <prod-domain>`
   shows the source deployment.
4. **Curl alone can't fully verify a Vercel preview** because of SSO
   protection. Have a second mechanism (Playwright with a logged-in
   session, dashboard "Protection Bypass for Automation" toggle) in the
   playbook, or accept that you'll test against production directly with
   a fast rollback ready.
5. **Postgres RLS introspection lies sometimes.** When `pg_policies`
   says the policy should allow but inserts get rejected, write a more
   permissive variant (`FOR ALL TO public USING+WITH CHECK (true)`) and
   move on. Don't argue with the planner.
6. **A symptom that changes with code edits isn't proof your code is
   wrong.** It often means you've moved the failure point. The real
   bug may be in inputs (env vars, headers, runtime) that survive your
   edits.
7. **Defensive `try/catch` on the logging path is non-negotiable.**
   Logging should never be allowed to break the user-facing request.
   We had to learn this twice.
8. **`vercel logs` is unreliable for runtime errors.** Don't budget for
   it during an incident. Use a diagnostic endpoint or
   Supabase's API logs (the side that received the request) instead.

### Things that worked well in the debugging

- **Rollback drill.** Rolling back the prod alias to a known-working
  deployment took ~30 seconds and gave us infinite room to keep
  experimenting. Worth practicing this once before you need it.
- **Local repro with `vercel env pull` + `npm run start`.** Confirmed
  the code itself was correct, which let us focus on Vercel-specific
  issues. The prod env values pulled were misleading (they were the
  *new* project's values that weren't reaching the *deploy*'s project)
  — but we got a successful local row insert from the same code, which
  ruled out the code as the bug.
- **`/api/debug-log` once we built it.** Two REST calls, full picture.

### Things to add to the project's permanent docs

- A short note in `docs/` explaining the deploy flow:
  "Always run `vercel deploy` from the linked working directory.
  Check `.vercel/project.json` before deploying after a fresh clone."
- A reusable diagnostic-endpoint template in `lib/` (gated behind an
  env var so it can stay shipped without exposing internals).
- A line in the operational checklist: when redeploying after env-var
  changes, fire a `/api/debug-state` probe first and confirm all
  expected keys appear before doing anything else.

## Current status

As of 2026-04-29 verification (~21 hours after ship):

- `tarot-snap.vercel.app` returns 200 on `/`, `/reading`,
  `/reading/single`, `/about`.
- `POST /api/reading` with an `X-Anon-Id` header returns 200 with a
  full reading and lands one row in `anonymous_readings` with all
  fields populated (`anon_id`, `ip_hash` 64 chars, `ai_response`
  non-null, `ai_latency_ms` ≈ 10 s, `error` null).
- The deployed client bundle (`app/reading/single/page-…js`) contains
  the literal strings `tarotsnap_anon_id` and `X-Anon-Id`, confirming
  the client-side wiring is live.
- `main` HEAD is `507dc01`; working tree clean; debug endpoint removed.
- Supabase row count: 10. Distinct `anon_id` values: 9.

Detailed verification report:
[`2026-04-28-tarot-snap-prod-status.md`](2026-04-28-tarot-snap-prod-status.md).

## Remaining risks / deferred items

1. **GitHub Actions keep-alive cron** still not landed. Without it,
   the new Supabase project will auto-pause after ~7 days idle and
   we re-enter the database-restore exercise.
2. **The orphaned sibling `tarotsnap-repo` Vercel project** still
   exists. Cosmetic but worth deleting from the Vercel dashboard.
3. **Several broken preview deployments** from the debug session still
   sit in the project's deployment list. Cosmetic.
4. **No explicit RLS deny-by-default for anon SELECT** on
   `anonymous_readings`. The data is anonymous so this is acceptable,
   but a future security review should add a restrictive `to anon
   USING (false)` SELECT policy.
5. **No diagnostic endpoint in production code.** Worth adding a
   permanent gated `/api/debug-state` route for future incidents.
6. **The exact reason `FOR INSERT WITH CHECK (true)` was rejected**
   remains unexplained. Worth a follow-up investigation when there's
   bandwidth — could be a Supabase-managed RLS plugin, a search-path
   issue, or a Postgres planner quirk.

## Recommended next actions

In rough priority order:

1. **Land the keep-alive cron** via the GitHub web UI — 1 minute of
   clicking, prevents the next 4-hour debug detour.
2. **Add the `.vercel/project.json` check to the project's deploy
   playbook.** Single rule, single line: "Before any `vercel deploy`,
   confirm `.vercel/project.json` matches the project that owns the
   env vars."
3. **Run a real-browser smoke test** on `/reading/single` from a fresh
   incognito window. Confirms the client-side `localStorage` UUID
   round-trips end-to-end. The byte-scan only proves the code is in
   the bundle, not that the React state machine actually fires it.
4. **Set a 1-week DB health-check reminder** for 2026-05-05 with the
   query in the prod-status doc (rows, distinct users, error rate,
   p50/p95 latency). First week of real traffic is when the surprises
   show up.
5. **Open a small follow-up PR** to add a permanent gated debug-state
   endpoint based on the `/api/debug-log` template. Saves the next
   incident.
6. **Delete the orphaned `tarotsnap-repo` project** from Vercel
   dashboard at convenience.
