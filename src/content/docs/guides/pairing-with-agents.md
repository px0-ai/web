---
title: "Pairing with AI Coding Agents"
description: "How to set up an autonomous agent supervision loop using px0 alongside terminal or in-app coding harnesses."
category: "guides"
order: 2
---

# Pairing with AI Coding Agents

When working with autonomous coding agents such as Claude Code, Gemini CLI, Cursor Agent, Antigravity, OpenCode, Codex, Aider, or Goose, code modifications arrive rapidly across multiple files. Running a 1.5 GB Electron IDE to supervise edits wastes gigabytes of system memory and risks typing conflicts.

px0 pairs with AI coding agents in two distinct ways:

1. **Integrated In-App Agent Dispatch (`Alt+E`)**: Select code in px0, describe your change, and dispatch it directly to your installed harness with automatic reloading and live streaming.
2. **Terminal Supervision (Sidecar Mode)**: Run your agent in your terminal or tmux pane while px0 serves as a lightweight, read-first review station.

---

## Mode 1: Integrated In-App Agent Dispatch

px0 can directly invoke your installed coding harnesses without leaving the browser:

1. Open your workspace with `px0 .`
2. Highlight the code you want modified in either the code viewport or git diff view.
3. Press `Alt+E` (or `Option+E` on macOS), or right-click the selection.
4. Pick your desired harness and model from the dropdown.
5. Enter your instruction and press `Enter`.

px0 executes the harness, streams output live to the running terminal with a `[<harness>]` prefix, guards against overlapping file edits, and automatically reloads touched documents upon completion.

For a comprehensive walkthrough of the in-app agent workflow, consult the [Editing with Coding Agents guide](/docs/guides/editing-with-coding-agents).

---

## Mode 2: External Terminal Supervision (Sidecar Mode)

If you prefer driving complex, multi-step agent conversations directly inside your terminal, keep your active terminal pane dedicated to the agent prompt while running px0 alongside it.

### Option A: Run in a Separate Terminal Split or Tmux Pane (Recommended)

Open a new terminal tab or tmux pane and launch px0 on your project:

```bash
px0 /path/to/project
```

Your browser opens to `http://127.0.0.1:7777`. You can stop it at any time with `Ctrl+C`.

### Option B: Run in Headless Background Mode

If you prefer working in a single terminal session, launch px0 in the background with `&`:

```bash
px0 -no-open /path/to/project &
```

This returns your shell prompt immediately while px0 serves the web UI in the background at `http://127.0.0.1:7777`.

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

Alternatively, terminate it directly by process name:
```bash
killall px0
```

---

## Refreshing After External Agent Edits

When an external terminal agent finishes applying changes to disk:

- Click the **Reindex / Reload button (`↻`)** at the top of the file tree in the px0 web interface, or reload your browser.
- px0 rescans the project tree in a few milliseconds, refreshes git status badges (`M`, `A`, `D`), and updates diff views against `HEAD`.

*(Note: If you dispatched the edit through px0's in-app composer using `Alt+E`, reloading occurs automatically when the agent exits.)*

---

## Benefits of px0 for Agent Workflows

- **Optimized for Reads**: No heavy editor or accidental keystrokes overwriting agent work in progress.
- **Zero Watcher Overhead**: Without recursive `inotify` or `fsevents` watching hundreds of thousands of files, your machine stays cool and quiet.
- **Instant Git Diffs**: Press `Ctrl+D` (or `Cmd+D`) to toggle side-by-side or unified diffs across all modified files in real time.
- **Diff View Selection**: Select lines directly inside diff view to send targeted refinements back to your agent.
- **Low CPU & Memory**: px0 uses ~20 MB of resident memory and sub-1% CPU, reserving resources for your agent and compiler.
