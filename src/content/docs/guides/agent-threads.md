---
title: "Agent Threads & Multi-Turn Conversations"
description: "How to hold persistent multi-turn conversations with coding harnesses, stream live replies and tool steps, and manage batch edits in px0."
category: "guides"
order: 3
---

# Agent Threads & Multi-Turn Conversations

A thread is a persistent, multi-turn conversation with your coding harness about your code. Where an inline edit is a single instruction that runs once and exits, a thread keeps its full transcript across messages. You can ask what a module does, follow up on specific functions, inspect implications across related files, and instruct the agent to make edits across as many files as the conversation requires.

Threads live in the right sidebar under the **Threads** tab, alongside References, Symbols, Calls, and Search.

---

## Starting a Thread

You can start a thread in four different ways depending on your current focus:

| Entry Point | Action | How to Trigger |
| :--- | :--- | :--- |
| **Code Selection** | Anchor to selected lines | Select code and press `Alt+T` (`Option+T` on macOS), click **Thread** in the footer selection bar, or right-click and choose **Start Thread**. |
| **Line Gutter** | Anchor to a specific line | Click the thread icon that appears beside any line number and choose **Start Thread**. |
| **Current Line** | Anchor to cursor position | With nothing selected in the editor, press `Alt+T` (`Option+T` on macOS) to anchor a thread to the cursor line. |
| **Workspace-Wide** | General conversation | On the Threads tab, click **+ New**, or open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run **Threads: Start New Thread**. |

When anchored to code, the thread opens as a draft showing the reference `path:lines` beneath the title. Clicking this citation jumps your editor directly to that file and line range. 

Nothing is saved to disk until you dispatch your first message. The code anchor provides context to start the conversation, but does not constrain the harness: your agent can read and modify any file in the workspace.

---

## The Conversation Experience

Type your prompt in the compose box and press `Enter` to send (`Shift+Enter` for a newline). As the agent processes your request, px0 streams updates in real time over Server-Sent Events (SSE):

- **Tool Steps**: A collapsible list showing real-time agent actions, such as `Read calc.go` or `Edit server.go`. The list remains expanded while the turn is actively running and collapses once complete.
- **Live Reply**: The harness's written answer streams in with rich formatting, including Markdown headings, bullet lists, inline code, and syntax-highlighted code fences with one-click copy buttons.
- **Changed Files**: When a turn touches the repository, px0 displays interactive file chips for every modified file. Clicking a chip opens the file in a new editor tab. Open tabs automatically reload in place as soon as a turn completes.
- **Stopping a Turn**: If you need to halt an in-flight run, click **Stop**. The harness process group is canceled cleanly, and any modifications already written to disk are preserved.

Each message continues the same conversation context. Follow-ups like *"Can you add unit tests for that edge case?"* or *"Does this break the HTTP handler?"* have access to the full conversation history.

---

## Mid-Thread Model & Harness Switching

Beneath the transcript, the **Model** row displays the active coding harness and model selector. You can switch models or harnesses in the middle of an ongoing thread:

- If you switch to another harness with native session capabilities, px0 starts a fresh session and seeds it with the prior transcript.
- If you switch models within the same harness, the session continues seamlessly.

---

## Session Continuity & Harness Support

A thread turn runs as a dedicated child process. To preserve conversation history across turns, px0 uses two distinct continuity modes depending on the harness:

| Mode | Supported Harnesses | Continuity Mechanism |
| :--- | :--- | :--- |
| **Native Session** | `claude` (Claude Code), `cursor-agent`, `agy` (Antigravity), `gemini` (Gemini CLI) | px0 tracks or provides the session ID directly. For example, `claude` uses `--session-id` on turn 1 and `--resume` thereafter; `agy` captures `conversation_id` and resumes with `--conversation`; `gemini` resumes with `--resume <uuid>`. The harness maintains its own context, so subsequent turns send only the new message, saving network tokens. |
| **Transcript Replay** | `opencode`, `codex`, `aider`, `goose`, and custom harnesses | px0 serializes prior turns as structured `User:` and `Assistant:` blocks along with the list of touched files (capped at 16 KB of recent context) and prefixes it to the prompt. |

For harnesses supporting token-level streaming (`claude`, `agy`, `gemini`), px0 parses `stream-json` events in real time to stream text deltas and tool invocation labels directly to the browser.

---

## Inline Edits and Batch Edits as Threads

Inline code edits ([Editing with Coding Agents](/docs/guides/editing-with-coding-agents)) share the same sidebar pane:

1. **Comment Box Integration**: Triggering an inline edit with `Alt+E` opens a comment box at the top of the Threads pane.
2. **Comment Queuing**: Press `Enter` to **Add comment** to stage multiple edits across files, or press `Ctrl+Enter` (`Cmd+Enter` on macOS) to **Apply now**.
3. **Batch Execution**: When multiple comments are staged, click **Apply all (N)** (`Ctrl+Shift+Enter` / `Cmd+Shift+Enter`) in the Batch control bar to execute them together.
4. **Recorded as Threads**: Every applied edit or batch is automatically saved as a thread, labeled `inline` or `batch` in the thread list. You can open it later to inspect what changed or ask follow-up questions.

Unlike open-ended conversations, inline edit threads enforce overlap protection: dispatches modifying lines that an active inline edit is currently writing will be rejected with an HTTP 409 conflict to prevent corrupted merges.

---

## Thread List & Persistent Storage

The **Threads** tab provides an overview of all conversations in the workspace:

- **Sorting & Metrics**: Threads are sorted by most recent activity, showing the code anchor, total turn count, and timestamp.
- **Status Indicators**: A spinner indicates an active turn, while a warning icon marks turns that failed. A pulsing dot on the Threads tab alerts you when a background turn completes while you are viewing another tab.
- **File Filter**: Click **This file** to filter the list to threads started in the currently active document.
- **Transcript Persistence**: Threads are stored locally on the host machine at `~/.px0/threads/<workspace-hash>.json` (or `$XDG_CONFIG_HOME/px0/threads/`), never inside your git working tree. Files are written atomically with restricted `0600` permissions.
- **Restart Recovery**: Threads survive server restarts. If px0 is terminated while a turn is running, the turn is cleanly marked as interrupted upon reload.
