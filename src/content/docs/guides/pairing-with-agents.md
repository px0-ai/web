---
title: "Pairing with AI Coding Agents"
description: "How to set up an autonomous agent supervision loop using px0."
category: "guides"
order: 2
---

# Pairing with AI Coding Agents

When working with autonomous coding agents such as Claude Code, Codex CLI, or custom agent scripts, edits arrive rapidly across files and directories. Running a 1.5 GB Electron IDE to observe edits wastes system resources and risks accidental keystrokes colliding with the agent.

## The Agent Supervision Pattern

Keep your active terminal dedicated to the agent prompt while running px0 alongside it:

### Option A: Run in a Separate Terminal Tab or Split (Recommended)

Open a new terminal tab, tmux pane, or split window and launch px0 on your project:

```bash
px0 /path/to/project
```

Your browser will automatically open to `http://127.0.0.1:7777`. You can stop it at any time with `Ctrl+C`.

### Option B: Run in Background Mode

If you prefer working in a single terminal session, launch px0 in the background with `&`:

```bash
px0 -no-open /path/to/project &
```

This returns your shell prompt immediately while px0 serves the web UI in the background. Navigate to `http://127.0.0.1:7777` in your browser.

#### Stopping a Background px0 Instance

To bring px0 back into the foreground and terminate it:

1. View active background jobs:
   ```bash
   jobs
   # [1]+ Running    px0 -no-open /path/to/project &
   ```

2. Bring it to the foreground:
   ```bash
   fg %1
   ```

3. Press `Ctrl+C` to cleanly stop the server.

Alternatively, you can terminate it directly by process name without foregrounding:
```bash
killall px0
```

## Refreshing After Agent Edits

px0 does not run background filesystem watchers or auto-reload files while agents write to disk. This intentional design keeps resource usage close to zero and prevents editor thrashing during multi-file agent patches.

Once your AI coding agent finishes applying changes:

- Click the **Reindex / Reload button (`↻`)** at the top of the file tree in the px0 web interface, or press your browser refresh.
- px0 will re-scan the project tree in a few milliseconds, refresh git status badges (`M`, `A`, `D`), and update diff views against `HEAD`.

## Benefits of px0 for Agent Loops

- **Read-Only Invariant**: px0 does not write to disk. You cannot accidentally overwrite a file while the agent is generating a patch.
- **Zero Watcher Overhead**: Without recursive `inotify` or `fsevents` watching hundreds of thousands of files, your machine stays cool and quiet.
- **Instant Git Diffs**: Press `d` (or `Ctrl+D`) to toggle side-by-side or inline diffs across all modified files in real time.
- **Low CPU & Memory**: px0 uses ~20 MB of resident memory, leaving CPU cycles and RAM dedicated to your agent and compiler.
