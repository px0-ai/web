---
title: "Editing with Coding Agents"
description: "How to dispatch selection-anchored edits to Claude Code, Gemini CLI, Cursor Agent, Antigravity, OpenCode, Codex, Aider, or Goose directly inside px0."
category: "guides"
order: 3
---

# Editing with Coding Agents

px0 is designed from the ground up for high-density reading, navigation, and review. When code needs to change, px0 does not ask you to type character-by-character into a heavy editor. Instead, you delegate changes to your AI coding agent of choice directly from the browser interface, and px0 automatically reloads what moved.

## Supported Coding Harnesses

px0 discovers installed coding harnesses on your `PATH` and standard binary directories (`~/.local/bin`, `/usr/local/bin`, npm global prefix). Eight popular coding harnesses are supported out of the box, each configured with optimal headless flags and automatic approval modes:

| Harness | Identifier | Headless Command Executed |
| :--- | :--- | :--- |
| **Claude Code** | `claude` | `claude --permission-mode acceptEdits --model <model> -p {prompt}` |
| **Gemini CLI** | `gemini` | `gemini --approval-mode auto_edit -m <model> -p {prompt}` |
| **Cursor Agent** | `cursor-agent` | `cursor-agent --force --model <model> -p {prompt}` |
| **Antigravity** | `agy` | `agy --dangerously-skip-permissions --mode accept-edits --model <model> -p {prompt}` |
| **OpenCode** | `opencode` | `opencode run -m <model> {prompt}` |
| **OpenAI Codex** | `codex` | `codex exec --ask-for-approval never -m <model> {prompt}` |
| **Aider** | `aider` | `aider --yes-always --no-auto-commits --model <model> --message {prompt}` |
| **Goose** | `goose` | `goose run --no-session --model <model> -t {prompt}` |

---

### Custom Command Templates

If your team uses an internal agent runner, shell wrapper, or custom orchestrator, pass a command template containing the `{prompt}` token to the `-agent` flag:

```bash
px0 -agent 'my-agent-cli --auto-apply --prompt {prompt}' /path/to/project
```

px0 substitutes `{prompt}` with the synthesized instructions and context, executes the command, streams output to the terminal, and auto-reloads touched files when finished.

---

### Dynamic Model Discovery & Settings Persistence

- **Dynamic Model Discovery**: When an installed harness supports querying available models (such as `opencode models`), px0 dynamically discovers and populates the model dropdown in the composer, falling back to preset lists if offline.
- **User Settings**: Selecting a harness or model in the web composer saves your choice to user configuration (`~/.px0/settings.json` or `$XDG_CONFIG_HOME/px0/settings.json`). Your preferences stay global to your machine and are never committed to git repositories.
- **CLI Flag Pinning**: You can pin a specific harness at startup:
  ```bash
  px0 -agent claude /path/to/project
  ```
  Or choose any supported harness: `claude`, `gemini`, `cursor-agent`, `agy`, `opencode`, `codex`, `aider`, or `goose`.
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
- The interactive **Git Diff View** (split or unified diff against `HEAD`)

### 2. Open the Agent Composer (`Alt+E` or `Option+E`)
With code selected, open the compose box:
- Press `Alt+E` (or `Option+E` on macOS)
- Or right-click the selection and choose **Edit Inline**
- Or click **Edit Inline** in the footer selection bar

The active selection remains highlighted in the editor while you type.

### 3. Choose Harness & Model
The top metadata row of the composer displays the detected harness, active model dropdown, and citation range (for example `@internal/fuzzy.go:64-72`).

If multiple harnesses are installed on your system, you can switch between them using the harness switcher in the compose box.

### 4. Enter Instructions & Dispatch
Type your instruction (e.g. `"simplify the score penalty calculation"`) and press `Enter` (or click **Run**).

px0 synthesizes a structured prompt including:
- Repository root path
- Relative target file path
- Standardized `@path:l1-l2` reference
- Selected code excerpt
- Your specific prompt instruction

### 5. Live Terminal Streaming & Auto-Reload
While the harness runs:
- The composer displays a busy processing indicator.
- Output lines from stdout and stderr stream live to the terminal running px0, prefixed with `[<harness>]`.
- If you need to stop an in-flight run, press `Escape` or click **Cancel** in the compose box to abort the child process immediately (`/api/agent/cancel`).

When the harness finishes:
- px0 runs working-tree diff checks (`changedSince`) comparing file sizes, timestamps, and git status.
- Touched syntax highlighting caches are cleared, open language server documents are refreshed, and open editor tabs reload automatically.
- If you were viewing a git diff, your diff mode and scroll position are preserved.

---

## Batch Inline Editing

When reviewing a PR, refactoring a module, or coordinating multi-step changes, submitting one prompt at a time creates friction. px0 supports **Batch Inline Editing**, allowing you to stage multiple selection comments across lines or files, review them together, and apply all changes in a single coordinated run.

### Creating Multiple Comments
1. Highlight any code range and press `Alt+E` (or `Option+E` on macOS) to create an edit comment. Alternatively, if no code is highlighted, pressing `Alt+E` anchors a comment to your current cursor line.
2. Type your instruction in the composer.
3. Without submitting yet, navigate elsewhere in the file or open another file, select a second target range, and press `Alt+E`.
4. Gutter indicators immediately display a `✎` anchor glyph and highlight the lines. Clicking the reference badge (e.g. `@src/agent.js:12-25`) in any comment box instantly jumps your viewport back to the target code.

### Document-Order Stacking & The Batch Control Bar
- Comment boxes automatically arrange themselves from top to bottom in document order inside `#agentbox-list`.
- When two or more comments exist, the **Batch Control Bar** (`#agent-batch-bar`) automatically appears at the top of the composer stack.
- The bar provides unified controls:
  - **Comment Counter**: Tracks ready comments versus currently running edits (e.g. `3 comments`, `1 remaining (2 in batch)`).
  - **Unified Model Selector**: Change the target coding harness and model for the entire batch simultaneously.
  - **Apply All (`Mod+Enter` / `Ctrl+Enter` / `Cmd+Enter`)**: Dispatches all staged comments together.
  - **Clear All**: Dismisses all open comment boxes.
  - **Cancel**: Halts an in-flight batch job.

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
- **Concurrent Batch & Single Edits**: Non-overlapping batch edits and individual edits can run at the same time. The status bar coordinates progress notes smoothly (e.g. `Batch editing 3 items + 1 edit running... 6s`).
- **Overlap Lock**: If an edit overlaps with line ranges already being modified by an in-flight job, px0 rejects the second dispatch with an HTTP 409 conflict to prevent corrupted merges.

---

## Error Reporting & Worktree Snapshots

If an agent run fails (such as an API quota exhaustion, authentication failure, or malformed syntax):
- The compose box stays open and displays the exact `stderr` and `stdout` error output.
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
