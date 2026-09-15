---
title: "Fixing 'sudo' Prompts on Install or Update"
description: "How to avoid unwanted sudo requirements and migrate to clean, user-space ~/.local/bin/px0."
category: "guides"
order: 4
---

# Fixing "sudo" Prompts on Install or Update

When running the install script or executing `px0 -update`, you may see a prompt requesting `sudo` permissions or system administrator credentials:

```text
[sudo] password for user:
```

Or when running self-updates on a legacy installation:

```text
permission denied writing to /usr/bin/px0
```

Many developers prefer not granting `sudo` permissions to install scripts, or operate in restricted environments where root access is not available.

## Why the Script Prompts for `sudo`

This typically happens if `px0` was previously installed into a root-owned system directory such as `/usr/bin` or `/usr/local/bin`.

1. **System Directory Ownership**: Files in `/usr/bin` require root permissions to overwrite or update.
2. **`$PATH` Shadowing**: In Linux and macOS, `/usr/bin` typically takes precedence over user directories like `~/.local/bin`. As long as a root-owned `px0` binary exists in your `$PATH`, running the installer or invoking `px0` will continue targeting the root-owned binary, triggering a `sudo` password prompt.

## The Clean Solution: User-Space Installation

The modern installer can run 100% in user space (`~/.local/bin/px0`). In user space:
- No root access or `sudo` passwords are ever needed.
- `px0 -update` downloads and verifies new releases seamlessly without permission prompts.
- Binaries are isolated strictly to your own user profile.

### Recommended One-Liner

To remove the old root-owned binary and switch permanently to clean user-space mode, run:

```bash
sudo rm -f "$(which px0)" && curl -fsSL https://px0.ai/install.sh | sh
```

*(This is the last time you will ever need `sudo` for px0).*

### What Happens Behind the Scenes

1. `sudo rm -f "$(which px0)"` deletes the active root-owned binary wherever it is located in your system `$PATH`.
2. The `install.sh` script executes as your standard unprivileged user, automatically selecting `~/.local/bin/px0`.
3. If `~/.local/bin` is not yet present in your `$PATH`, the script configures your `~/.bashrc` or `~/.zshrc`.
4. All future invocations and updates via `px0 -update` operate completely in user space with zero `sudo` prompts.

### Verification

Reload your shell and confirm the active binary path:

```bash
source ~/.bashrc   # or: source ~/.zshrc
which px0
```

The output should point to your home directory:

```text
/home/<user>/.local/bin/px0
```

You can now run `px0 -update` anytime with zero administrative privileges.
