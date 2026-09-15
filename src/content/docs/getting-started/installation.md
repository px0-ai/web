---
title: "Installation & Setup"
description: "Install px0 with a single command, configure user-space permissions, and resolve legacy sudo upgrades."
category: "getting-started"
order: 1
---

# Installation & Setup

px0 is a single self-contained binary with zero external dependencies. It starts in under a millisecond and consumes approximately 20 MB of RAM.

## Quick Install (macOS, Linux, BSD)

To install px0 as your regular user, run:

```bash
curl -fsSL https://px0.ai/install.sh | sh
```

The installer detects your operating system and architecture, downloads the verified binary, installs it into user space (`~/.local/bin` or standard PATH directory without requiring root), and ensures your shell PATH is configured.

## Avoiding `sudo` Requirements (User-Space Migration)

If you previously installed px0 with `sudo` into a system directory (`/usr/bin` or `/usr/local/bin`), updates or subsequent installer runs may prompt for a `sudo` password.

As long as a root-owned binary exists in `/usr/bin`, `$PATH` precedence will target that binary and require administrator credentials.

### Clean One-Liner Fix (Recommended)

Run the following one-liner to remove the old root-owned binary and switch permanently to clean, unprivileged user space:

```bash
sudo rm -f "$(which px0)" && curl -fsSL https://px0.ai/install.sh | sh
```

*(This is the last time you will ever need `sudo` for px0).*

What this does:
1. Locates and deletes the legacy root-owned binary using `$(which px0)` so it no longer shadows user directories.
2. Installs px0 cleanly into user space (`~/.local/bin/px0`) and configures `~/.bashrc` or `~/.zshrc`.
3. Ensures all future runs and updates via `px0 -update` execute with zero root privileges or `sudo` prompts.

### Step-by-Step Breakdown

If you prefer to run each step manually:

1. **Remove the active legacy binary**:
   ```bash
   sudo rm -f "$(which px0)"
   ```

2. **Re-install cleanly as a regular user (no sudo)**:
   ```bash
   curl -fsSL https://px0.ai/install.sh | sh
   ```

3. **Reload shell configuration**:
   ```bash
   source ~/.bashrc   # or: source ~/.zshrc
   ```

4. **Verify location and version**:
   ```bash
   which px0          # should output: ~/.local/bin/px0
   px0 -version
   ```

## Launching px0

Launch px0 by passing any directory path directly:

```bash
px0 /path/to/project
```

Or pass `.` (or omit the argument) to open the current working directory:

```bash
px0 .
```

px0 will immediately index the repository in the background, launch the local HTTP server, and open your default browser to `http://127.0.0.1:7777`.

## Common CLI Options

- `-port 7777`: Specify a custom listening port (pass `0` for an ephemeral free port).
- `-host 127.0.0.1`: Bind address (`0.0.0.0` exposes px0 across local networks or remote hosts).
- `-update`: Check for and install the latest available release in user-space.

For the complete list of runtime parameters and flags, see the [CLI Flags Reference](/docs/reference/cli-flags).

## Uninstallation

To remove px0, see the [Uninstalling px0 guide](/docs/guides/uninstalling-px0).
