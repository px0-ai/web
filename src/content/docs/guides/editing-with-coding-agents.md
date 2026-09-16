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

### Harness Details & Headless Configuration

Each harness preset is preconfigured to bypass interactive confirmation prompts so edits apply non-interactively:

#### 1. Claude Code (`claude`)
- **Binary**: `claude`
- **Headless Flag**: `--permission-mode acceptEdits` ensures Claude applies file edits directly without waiting for manual terminal confirmation.
- **Model Flag**: `--model <model>`
- **Default Model**: `haiku` for near-instant edits. Switch to `sonnet` or `opus` in the dropdown for complex architectural refactoring.

#### 2. Gemini CLI (`gemini`)
- **Binary**: `gemini`
- **Headless Flag**: `--approval-mode auto_edit` instructs the Gemini runner to write patches straight to disk.
- **Model Flag**: `-m <model>`
- **Default Model**: `gemini-2.5-flash-lite` for ultra-low latency. Switch to `gemini-2.5-flash` or `gemini-2.5-pro` when broader reasoning context is required.

#### 3. Cursor Agent (`cursor-agent`)
- **Binary**: `cursor-agent`
- **Headless Flag**: `--force` applies suggested edits without prompting.
- **Model Flag**: `--model <model>`
- **Default Model**: `gemini-3.6-flash-minimal`. Supports a wide variety of models including Gemini Flash variants, GPT-5.4 nano/mini, and Claude Sonnet/Opus models.

#### 4. Antigravity (`agy`)
- **Binary**: `agy`
- **Headless Flags**: `--dangerously-skip-permissions --mode accept-edits` permits fully autonomous execution within the project root.
- **Model Flag**: `--model <model>`
- **Default Model**: `gemini-3.6-flash-low`. Supports tiered Gemini 3.x models across low, medium, and high compute budgets.

#### 5. OpenCode (`opencode`)
- **Binary**: `opencode`
- **Headless Command**: `opencode run -m <model> {prompt}`
- **Model Flag**: `-m <model>`
- **Default Model**: `opencode/big-pickle`. Supports multi-provider models across OpenCode, GitHub Copilot, and Google Gemini.
- **Model Discovery**: px0 runs `opencode models` in the background to dynamically discover all configured endpoints.

#### 6. OpenAI Codex (`codex`)
- **Binary**: `codex`
- **Headless Flag**: `codex exec --ask-for-approval never -m <model> {prompt}` ensures autonomous execution without terminal interaction.
- **Model Flag**: `-m <model>`
- **Default Model**: `gpt-5-codex`. Supports the full suite of Codex reasoning and mini models.

#### 7. Aider (`aider`)
- **Binary**: `aider`
- **Headless Flags**: `--yes-always --no-auto-commits` lets Aider modify files cleanly without creating git commits behind px0's back.
- **Model Flag**: `--model <model>`
- **Default Model**: `claude-3-7-sonnet`. Supports Claude, OpenAI, Gemini, DeepSeek, and local Ollama models.

#### 8. Goose (`goose`)
- **Binary**: `goose`
- **Headless Flags**: `goose run --no-session -t {prompt}` executes ephemeral single-shot tasks without session overhead.
- **Model Flag**: `--model <model>`
- **Default Model**: `gpt-4o`. Supports OpenAI, Anthropic, and Google Gemini models.

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
- Or right-click the selection and choose **Edit with Agent**
- Or click **Edit** in the footer selection bar

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

## Concurrency & Overlap Protection

px0 supports concurrent agent dispatch with strict safety guards:
- **Disjoint Edits**: You can dispatch multiple edits simultaneously across different files or non-overlapping line ranges in the same file.
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
