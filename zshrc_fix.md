# Fix for Powerlevel10k Terminal Lagging in Cursor/VSCode

## Problem
When using Cursor or VSCode with Agent Mode, terminals using Powerlevel10k (p10k) theme can freeze or become laggy due to the instant prompt feature.

## Solution for ZSH users

Add this code to the **top** of your `~/.zshrc` file:

```bash
# Disable Powerlevel10k instant prompt in VSCode/Cursor environments
if [[ "$TERM_PROGRAM" == "vscode" ]]; then
  POWERLEVEL9K_INSTANT_PROMPT=off
fi
```

## How to apply the fix:

1. **Find your .zshrc file:**
   - Usually located at `~/.zshrc` (home directory)
   - On Windows with WSL: `/home/username/.zshrc`

2. **Edit the file:**
   - Add the code snippet at the very top of the file
   - Save the file

3. **Reload your shell:**
   ```bash
   source ~/.zshrc
   ```

## Why this works:
- VSCode and Cursor both set the environment variable `TERM_PROGRAM=vscode`
- This conditional check detects when running inside these editors
- It disables only the instant prompt feature that causes the freezing
- Regular terminal sessions outside these editors still get the full p10k experience

## Alternative: Complete p10k disable for these environments
If you want to completely disable p10k in VSCode/Cursor:

```bash
# Completely disable p10k in VSCode/Cursor
if [[ "$TERM_PROGRAM" != "vscode" ]]; then
  # Your p10k configuration goes here
  [[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
fi
``` 