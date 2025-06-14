# Plan: Anonymous User Memory for TarotSnap (ui-revamp branch)

## Objective
Enable TarotSnap to remember readings, card relationships, and themes for users who are not logged in, using a privacy-friendly anonymous ID. This will allow all users to benefit from the Memory Bank system, with a seamless upgrade path if they later create an account.

## Product Decision Checkpoint: Enforce Login vs. Anonymous Use (MVP)

**Analysis:**
- Enforcing login would provide richer data, easier user journey tracking, and a stronger foundation for premium features, but creates significant friction and drop-off risk at the top of the funnel.
- Allowing anonymous use maximizes user growth, learning, and feedback at MVP stage, but results in more fragmented data and less persistent memory.

**Recommendation:**
- For MVP, do NOT enforce login. Instead, allow instant, anonymous use with a privacy-friendly anonymous ID and memory system.
- Prompt users to create an account only after they have experienced value (e.g., after their first reading, to save memory, or to unlock premium features).
- This hybrid approach maximizes both growth and data quality, and is best practice for consumer MVPs in spiritual/AI/entertainment domains.

**Action:**
- Proceed with anonymous user memory implementation as planned.
- Add a strong, value-driven login prompt at key moments in the user journey.

---

## Steps

### 1. Analysis & Preparation
- [ ] Review current memory bank and reading storage logic for userId dependency
- [ ] Identify all places where userId is required for storing/retrieving memory
- [ ] Confirm analytics and getAnonymousUserId implementation

### 2. Backend/Service Refactor
- [ ] Refactor readingStorage and memory bank APIs to accept either a real userId (authenticated) or an anonymousId (from getAnonymousUserId)
- [ ] On every reading, if the user is not logged in, call getAnonymousUserId and use it as the userId for storing and retrieving readings, card relationships, and themes
- [ ] Update all memory retrieval (history, themes, preferences) to use the anonymousId for unauthenticated users
- [ ] Ensure all Supabase queries and RLS policies allow for anonymousId usage (if needed, create a separate table or relax RLS for anonymousId pattern)

### 3. UI/UX Updates
- [ ] Update UI to show reading history and memory features for anonymous users
- [ ] Add a prompt to log in for permanent cloud backup and cross-device sync
- [ ] Clearly indicate which memory is local/anonymous and which is cloud/persistent

### 4. Migration & Data Linking (Optional)
- [ ] Add a migration script or fallback to associate any future login with previous anonymous data if the user later creates an account

### 5. Testing
- [ ] Use Playwright to test that memory persists across browser sessions for anonymous users
- [ ] Test that memory is properly linked for authenticated users
- [ ] Test edge cases: clearing localStorage, switching devices, logging in after using as anonymous

### 6. Documentation & Progress Tracking
- [ ] Update progress.md with implementation details and status
- [ ] Update TODO.md with new tasks and checklists
- [ ] Document the anonymous memory system in /docs/memory-anonymous.md

---

## Dependencies
- Supabase RLS and schema compatibility
- getAnonymousUserId implementation
- UI components for memory display

## Risks
- Data privacy: ensure anonymousId is not guessable or linkable across users
- Data loss: warn users that anonymous memory is local to their device/browser
- Migration: ensure smooth upgrade path to authenticated memory

---

## Timeline
- Analysis & Prep: 0.5 day
- Backend/Service Refactor: 1 day
- UI/UX Updates: 1 day
- Testing & Docs: 1 day

---

## Owner
- Assigned: [Your Name]
- Branch: ui-revamp

---

## Status
- [ ] Not started
- [ ] In progress
- [ ] Complete

## Frontend & UI: Cross-Session Anonymous Memory

- [ ] Fetch memory (history, themes, cards) from the API using resolved userId (anonymous or authenticated) on page load and after each reading.
- [ ] Create UI components to display reading history, card relationships, and themes for all users.
- [ ] Add a persistent, value-driven login prompt for cloud backup and cross-device sync.
- [ ] Ensure all memory features are accessible and visually appealing for both anonymous and logged-in users.
- [ ] Add Playwright tests for cross-session persistence and login migration.

**Rationale:** Cross-session memory is a key differentiator and value driver for TarotSnap. Users expect to see their journey evolve, even before login. This closes the gap between backend capability and user experience.

## Supabase-Powered Cross-Session Memory System (Anonymous & Authenticated)

### Overview
- Use Supabase's anonymous sign-in (`supabase.auth.signInAnonymously()`) for all new users, creating a real user row in `auth.users`.
- Store all memory data (readings, card relationships, themes) with the current session's `user_id` (anonymous or authenticated).
- RLS policies ensure users only access their own data.
- Seamless migration: when a user signs up, migrate anonymous data to their new account.

### Backend/Database
- [ ] Ensure all memory tables use `user_id` referencing `auth.users`.
- [ ] RLS: Only allow access to rows where `user_id = auth.uid()`.
- [ ] API endpoints: Accept current session's `user_id` for all memory operations.

### Frontend/UX
- [ ] On app load, check for Supabase session; if none, trigger anonymous sign-in.
- [ ] Fetch memory (history, themes, cards) using current session's `user_id` on page load and after each reading.
- [ ] Display memory features for all users.
- [ ] Add persistent, value-driven login prompt for cloud backup and cross-device sync.
- [ ] After login/signup, migrate anonymous data to authenticated user.

### Testing & Validation
- [ ] Playwright E2E tests for anonymous and authenticated memory, migration, and RLS.
- [ ] Edge case: Anonymous memory is device/browser-specific; clearing cookies will lose data (explain in UI).

### Rationale
- Supabase anonymous auth provides secure, scalable, and frictionless memory for all users.
- No hacks—just robust, future-proof architecture ready for MVP and beyond.

## Chat-Centric Memory & Insights for Logged-In Users

### Rationale
- Authenticated users provide a stable user_id, enabling persistent, cross-device memory and analytics.
- Chat is the richest source of user understanding—capturing intent, emotional state, and journey over time.
- Focusing on logged-in users allows for true personalization, longitudinal analysis, and premium relationship features.

### Plan
- [ ] Require or strongly prompt login before chat begins or after first reading.
- [ ] Store all chat messages (user and AI) and metadata (reading ID, topics, emotional state) with user_id in Supabase.
- [ ] Fetch and display chat history for returning users to enable seamless session continuity.
- [ ] Analyze chat content for recurring themes, emotional trends, and user goals using AI.
- [ ] Use chat insights to drive personalized follow-ups, greetings, and recommendations.
- [ ] Implement privacy controls: allow users to view, export, or delete their chat history. 