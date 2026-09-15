---
title: "Uninstalling px0"
description: "How to cleanly remove px0 binary and shell configuration from your system."
category: "guides"
order: 5
---

# Uninstalling px0

px0 is distributed as a single static executable with no background daemons, system services, or hidden registry entries. Removing it is straightforward.

## Step 1: Remove the Executable

Because px0 is installed into user space (`~/.local/bin/px0`) or a system binary directory, remove the active binary by deleting the path returned by `which px0`:

```bash
rm -f "$(which px0)"
```

If you previously installed px0 with root permissions (e.g. into `/usr/bin` or `/usr/local/bin`), prepend `sudo`:

```bash
sudo rm -f "$(which px0)"
```

## Step 2: Clean Up Shell PATH (Optional)

If the installer added `~/.local/bin` to your shell profile, you will find this comment line in your shell config file (`~/.bashrc`, `~/.zshrc`, or `~/.config/fish/config.fish`):

```bash
# Added by px0 installer
export PATH="$HOME/.local/bin:$PATH"
```

If you do not use `~/.local/bin` for other CLI tools (such as Python user packages or local scripts), you can open your shell configuration file and delete those two lines.

Reload your shell to apply changes:

```bash
source ~/.bashrc   # or: source ~/.zshrc
```

## Verification

Confirm that `px0` is no longer in your system `$PATH`:

```bash
which px0
# Output: px0 not found
```
