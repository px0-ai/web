---
title: "Editing with Coding Agents"
description: "How to dispatch selection-anchored edits to Claude Code, Gemini CLI, Cursor Agent, Antigravity, OpenCode, Codex, Aider, or Goose directly inside px0."
category: "guides"
order: 4
---

# Editing with Coding Agents

px0 is designed from the ground up for high-density reading, navigation, and review. When code needs to change, px0 does not ask you to type character-by-character into a heavy editor. Instead, you delegate changes to your AI coding agent of choice directly from the browser interface, and px0 automatically reloads what moved.

In px0 v0.1.10, inline edits and batch edits are fully integrated with the **Threads** system: edit comment boxes live in the right inspector's Threads pane, and every applied edit is preserved as a multi-turn thread with live tool step streaming and follow-up capabilities.

## Supported Coding Harnesses

px0 discovers installed coding harnesses on your `PATH` and standard binary directories (`~/.local/bin`, `/usr/local/bin`, npm global prefix). Eight popular coding harnesses are supported out of the box, each configured with optimal headless flags, automated approvals, and native session continuity where supported:

| Harness | Identifier | Continuity Mode | Headless Command Executed |
| :--- | :--- | :--- | :--- |
| **Claude Code** | `claude` | Native session | `claude --permission-mode acceptEdits --model <model> -p {prompt}` |
| **Google Antigravity** | `agy` | Native session | `agy --dangerously-skip-permissions --mode accept-edits --model <model> -p {prompt}` |
| **Gemini CLI** | `gemini` | Native session | `gemini --approval-mode auto_edit -m <model> -p {prompt}` |
| **Cursor Agent** | `cursor-agent` | Native session | `cursor-agent --force --model <model> -p {prompt}` |
| **OpenCode** | `opencode` | Prompt replay | `opencode run -m <model> {prompt}` |
| **OpenAI Codex** | `codex` | Prompt replay | `codex exec --ask-for-approval never -m <model> {prompt}` |
| **Aider** | `aider` | Prompt replay | `aider --yes-always --no-auto-commits --model <model> --message {prompt}` |
| **Goose** | `goose` | Prompt replay | `goose run --no-session --model <model> -t {prompt}` |

---

### Custom Command Templates

If your team uses an internal agent runner, shell wrapper, or custom orchestrator, pass a command template containing the `{prompt}` token to the `-agent` flag:

```bash
px0 -agent 'my-agent-cli --auto-apply --prompt {prompt}' /path/to/project
```

px0 substitutes `{prompt}` with the synthesized instructions and context, executes the command, streams output to the terminal and web inspector, and auto-reloads touched files when finished.

---

### Dynamic Model Discovery & Settings Persistence

- **Dynamic Model Discovery**: When an installed harness supports querying available models (such as `opencode models`), px0 dynamically discovers and populates the model dropdown in the composer, falling back to preset lists if offline.
- **User Settings**: Selecting a harness or model in the web composer saves your choice to user configuration (`~/.px0/settings.json` or `$XDG_CONFIG_HOME/px0/settings.json`). Your preferences stay global to your machine and are never committed to git repositories.
- **CLI Flag Pinning**: You can pin a specific harness at startup:
  ```bash
  px0 -agent claude /path/to/project
  ```
  Or choose any supported harness: `claude`, `agy`, `gemini`, `cursor-agent`, `opencode`, `codex`, `aider`, or `goose`.
- **Disabling Agent Dispatch**: To turn off agent endpoints entirely on shared machines:
  ```bash
  px0 -no-agent /path/to/project
  ```

---

## Step-by-Step Edit Workflow

### 1. Select the Target Code
Highlight the code you want to modify using your mouse or keyboard navigation (`Shift+Arrows` for characters/lines, `Shift+Ctrl+Arrows` for word boundaries).

You can select code in either:
- The standard **Source Viewport**
- The interactive **Git Diff View** (split or unified diff against `HEAD` or merge-base)

### 2. Open the Composer
With code selected, open the edit box:
- Press `Alt+E` (or `Option+E` on macOS)
- Right-click the selection and choose **Edit Inline**
- Click **Edit Inline** in the footer selection bar
- Or click the **thread icon** that appears beside any line number on hover and choose **Edit Inline**

The comment box opens immediately at the top of the **Threads** pane in the right sidebar (sliding open automatically if the sidebar was collapsed).

### 3. Choose Harness & Model
The top row of the comment box displays the selected harness, active model dropdown, and citation range (for example `@internal/fuzzy.go:64-72`).

If multiple harnesses are installed on your system, you can switch between them using the harness dropdown.

### 4. Write a Comment or Apply Immediately
Type your instruction (e.g. `"simplify the score penalty calculation"` or `"handle nil error check"`). You have two choices:
- **Add comment (`Enter`)**: Queues the comment so you can stage multiple edits into a batch across files.
- **Apply now (`Ctrl+Enter` / `Cmd+Enter`)**: Dispatches this single edit immediately.

### 5. Live Streaming in the Threads Pane
When dispatched, px0 sends the file path, line range, selected code snippet, and prompt to the harness:
- The edit is tracked in the Threads pane, where live tool steps (such as `Read fuzzy.go` and `Edit fuzzy.go`) and agent replies stream in real time over Server-Sent Events (`/api/threads/stream`).
- Output lines also stream live to the terminal running px0 with a `[<harness>]` prefix.
- If you need to stop an in-flight run, click **Cancel** or **Stop** in the Threads pane to abort the process immediately.

### 6. Automatic Document Reload & Preserved Diff State
When the harness finishes:
- px0 executes working-tree diff checks (`changedSince`) measuring file sizes, timestamps, and git status to discover modified files.
- Touched syntax highlighting caches are cleared, open language server documents are refreshed, and open editor tabs reload automatically.
- If you were viewing a git diff, your diff mode and scroll position are preserved.

### 7. Saved as a Thread for Follow-Up
Every applied edit is preserved as a thread in the Threads list, labeled `inline` or `batch`. You can reopen it at any time to inspect the agent's explanation, view changed file chips, or send a follow-up instruction (e.g. *"also add a test case for this"*).

---

## Batch Inline Editing

When reviewing code, refactoring a module, or coordinating multi-step changes, submitting one prompt at a time creates friction. px0 supports **Batch Inline Editing**, allowing you to stage multiple selection comments across lines or files, review them together, and apply all changes in a single coordinated run.

### Creating Multiple Comments
1. Highlight any code range and press `Alt+E` (or click the line thread icon and choose **Edit Inline**).
2. Type your instruction and press `Enter` (**Add comment**). The box folds into a compact row showing your text. Click it anytime to expand and edit.
3. Navigate elsewhere in the file or open another file, select a second target range, and press `Alt+E` to add another comment.
4. Gutter indicators display anchor badges and highlight the lines. Clicking the reference badge (e.g. `@src/agent.js:12-25`) in any comment box instantly jumps your viewport back to the target code.

### The Batch Control Bar
As soon as comments are staged, the **Batch Control Bar** appears at the top of the Threads pane:
- **Comment Counter**: Tracks staged comments (e.g. `2 comments`).
- **Unified Model Selector**: Change the target coding harness and model for the entire batch simultaneously.
- **Apply all (N) (`Ctrl+Shift+Enter` / `Cmd+Shift+Enter`)**: Dispatches all staged comments together as a single orchestrated batch.
- **Clear All**: Dismisses all staged comment boxes.

### Coordinated Prompt Synthesis
When you trigger **Apply All**, px0 aggregates all comments into a single orchestrated batch prompt dispatched to your selected coding harness:

````markdown
Batch Edit Request: Carry out all of the following instructions across the workspace.

### Edit 1: @src/agent.js lines 14-28
```js
// code snippet 1
```
**Instruction**: Refactor session lookup to use Map.get

### Edit 2: @src/status.js lines 45-52
```js
// code snippet 2
```
**Instruction**: Format elapsed batch time as minutes:seconds

Edit the file(s) in place to carry out all of the above instructions. Change only what they ask for, coordinate changes cleanly, and do not explain the changes afterwards.
````

The harness receives all instructions in context, allowing it to coordinate cross-file type signatures, imports, and variables in one cohesive pass.

---

## Live IDE Git Status Synchronization

When an agent completes an edit (or when files change on disk), px0 updates your environment live without full page reloads:
- **Modified Tab Indicators**: Tabs containing uncommitted modifications display an orange file name and an indicator dot (`.git-modified`).
- **Preserved Tree State**: Reindexing preserves all open tabs, active scroll offsets, and expanded directory folders in the file explorer tree.
- **Diff Gutters**: Live diff gutters immediately highlight added, changed, and deleted lines against `HEAD`.
- **Manual Workspace Refresh (`Mod+Shift+R`)**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on macOS) at any time to force an immediate workspace reindex and Git status synchronization.

---

## Concurrency & Overlap Protection

px0 supports concurrent agent dispatch with strict safety guards:
- **Disjoint Edits**: You can dispatch multiple edits simultaneously across different files or non-overlapping line ranges in the same file.
- **Overlap Lock**: If an edit overlaps with line ranges already being modified by an in-flight job, px0 rejects the second dispatch with an HTTP 409 conflict to prevent corrupted merges.
- **Independent Threads**: Open-ended conversations started from the Threads tab run independently with no line-overlap locks.

---

## Error Reporting & Worktree Snapshots

If an agent run fails (such as an API quota exhaustion, authentication failure, or malformed syntax):
- The thread turn in the Threads pane displays the exact error output and failed step.
- You can inspect the error, adjust your instruction, and retry immediately.
- px0 takes pre- and post-run worktree snapshots, enabling instant undo to restore the files modified by the harness to their prior state.

---

## Security Posture on Remote Networks

When running px0 on remote servers or cloud VMs (`px0 -host 0.0.0.0`):
- **Origin Guard (`localPost`)**: Agent dispatch endpoints verify that the `Origin` matches the `Host` header and that the address is an IP address or localhost.
- **Hostname Protection**: If accessed through a reverse proxy or public tunnel domain, agent editing is refused to protect against DNS rebinding attacks.
- Anyone with network access to px0 opened by IP address can execute agent edits as your user account. Bind `-host 0.0.0.0` only on private networks (such as Tailscale, WireGuard, or private VPCs).
- To disable agent dispatch entirely on a shared server, start px0 with the `-no-agent` flag:
  ```bash
  px0 -no-agent -host 0.0.0.0 /path/to/project
  ```
