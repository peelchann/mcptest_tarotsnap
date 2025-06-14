# TarotSnap Anonymous User Memory System

## Overview
TarotSnap now supports memory features (reading history, card relationships, themes) for users who are not logged in, using a privacy-friendly anonymous ID stored in localStorage. This allows all users to benefit from the Memory Bank system, even before creating an account.

## How It Works
- On first use, an anonymous ID (anon_<timestamp>_<random>) is generated and stored in localStorage.
- All memory features (reading storage, retrieval, card relationships, themes) use this ID as the userId for unauthenticated users.
- If the user later creates an account, their anonymous data can be migrated to their authenticated profile.

## Privacy & Security
- The anonymous ID is randomly generated and not guessable.
- All data is stored securely and only accessible from the same device/browser.
- Users are informed that anonymous memory is local and not backed up to the cloud unless they create an account.

## Upgrade Path
- When a user signs up or logs in, the app can offer to migrate their anonymous memory to their new account.
- This ensures a seamless experience and preserves user history.

## Limitations
- Anonymous memory is device/browser-specific. Clearing localStorage or switching devices will lose memory.
- For permanent, cross-device memory, users should create an account.

## FAQ
**Q: Is my anonymous memory private?**
A: Yes, it is only accessible from your device/browser and is not shared or linked to your identity.

**Q: What happens if I clear my browser data?**
A: Your anonymous memory will be lost. Create an account to back up your data.

**Q: Can I migrate my anonymous memory if I sign up later?**
A: Yes, the app will offer to link your previous anonymous data to your new account. 