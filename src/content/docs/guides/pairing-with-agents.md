---
title: "Pairing with AI Coding Agents"
description: "How to set up an autonomous agent supervision loop using px0 alongside terminal or in-app coding harnesses."
category: "guides"
order: 2
---

# Pairing with AI Coding Agents

When working with autonomous coding agents such as Claude Code, Google Antigravity, Gemini CLI, Cursor Agent, OpenCode, Codex, Aider, or Goose, code modifications arrive rapidly across multiple files. Running a 1.5 GB Electron IDE to supervise edits wastes gigabytes of system memory and risks typing conflicts.

Built as the IDE for humans and AI, px0 pairs with autonomous coding agents in three distinct ways:

1. **Multi-Turn Agent Threads (`Alt+T`)**: Conduct persistent, multi-turn conversations anchored to code selections or workspace concepts. Inspect tool steps live and follow up across turns directly in the right sidebar Threads pane.
2. **Integrated In-App Agent Dispatch (`Alt+E`)**: Select code in px0, stage single or batch comments, and dispatch them directly to your installed harness with automatic reloading and live streaming.
3. **Terminal Supervision (Sidecar Mode)**: Run your agent in your terminal or tmux pane while px0 serves as a lightweight, read-first review station with sub-millisecond Git synchronization.

---

## Mode 1: Multi-Turn Agent Threads

Threads provide an interactive, conversational loop directly beside your code:

1. Open your workspace with `px0 .`
2. Select any code block and press `Alt+T` (`Option+T` on macOS), or click the thread icon beside any line number.
3. The **Threads** pane in the right inspector opens, anchored to your selection.
4. Enter your question or prompt (e.g. *"Explain how this error path is handled and draft a safer variant"*).
5. Watch live as the harness streams its reply and collapsible tool steps (`Read handler.go`, `Edit types.go`).
6. Follow up seamlessly with subsequent messages: native session harnesses (`claude`, `agy`, `gemini`, `cursor-agent`) resume their existing sessions without re-sending full history, saving API tokens.

For a full walkthrough of threads, see the [Agent Threads & Multi-Turn Conversations guide](/docs/guides/agent-threads).

---

## Mode 2: Integrated In-App Agent Dispatch

px0 can directly invoke your installed coding harnesses for focused edits:

1. Highlight the code you want modified in either the code viewport or git diff view.
2. Press `Alt+E` (or `Option+E` on macOS), or right-click the selection.
3. Pick your desired harness and model from the dropdown.
4. Enter your instruction and press `Enter` to stage a comment (for batching) or `Ctrl+Enter` (`Cmd+Enter` on macOS) to **Apply now**.
5. When the edit finishes, px0 automatically reloads touched documents and updates git status gutters.
6. The edit is preserved as an `inline` or `batch` thread in the Threads list for future reference and follow-up queries.

For a comprehensive walkthrough of the in-app agent workflow, consult the [Editing with Coding Agents guide](/docs/guides/editing-with-coding-agents).

---

## Mode 3: External Terminal Supervision (Sidecar Mode)

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

*(Note: If you dispatched the edit through px0's in-app composer using `Alt+E` or a Thread, reloading occurs automatically when the agent completes.)*

---

## Benefits of px0 for Agent Workflows

- **Optimized for Reads**: No heavy editor or accidental keystrokes overwriting agent work in progress.
- **Zero Watcher Overhead**: Without recursive `inotify` or `fsevents` watching hundreds of thousands of files, your machine stays cool and quiet.
- **Chroma Syntax-Highlighted Diffs**: Press `Ctrl+D` (or `Cmd+D`) to toggle side-by-side or unified diffs with full language syntax coloring across modified lines.
- **Diff View Selection**: Select lines directly inside diff view to send targeted refinements back to your agent or start a thread.
- **Low CPU & Memory**: px0 uses strictly ~20-30 MB of host resident memory (~100-180 MB total including the browser tab) and sub-1% CPU, reserving resources for your agent and compiler.
