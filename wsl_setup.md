# Setting up WSL with ZSH and Fixing Powerlevel10k Issues

## Install WSL2 (if needed)

1. **Enable WSL in PowerShell (as Administrator):**
   ```powershell
   wsl --install
   ```

2. **Install Ubuntu (recommended):**
   ```powershell
   wsl --install -d Ubuntu
   ```

3. **Restart your computer** when prompted.

## Setup ZSH and Powerlevel10k in WSL

1. **Enter WSL:**
   ```bash
   wsl
   ```

2. **Install zsh:**
   ```bash
   sudo apt update
   sudo apt install zsh
   ```

3. **Install Oh My Zsh:**
   ```bash
   sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
   ```

4. **Install Powerlevel10k:**
   ```bash
   git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k
   echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
   ```

5. **Add the Cursor/VSCode fix to .zshrc:**
   ```bash
   # Add this to the TOP of your ~/.zshrc file
   echo 'if [[ "$TERM_PROGRAM" == "vscode" ]]; then
     POWERLEVEL9K_INSTANT_PROMPT=off
   fi' | cat - ~/.zshrc > temp && mv temp ~/.zshrc
   ```

6. **Reload your shell:**
   ```bash
   source ~/.zshrc
   ```

## Configure Cursor to use WSL

1. Open Cursor settings
2. Search for "terminal integrated shell"
3. Set the terminal shell to: `wsl.exe`

This will ensure Cursor uses your WSL environment with the properly configured zsh and the terminal lag fix. 