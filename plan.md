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