---
title: "GitHub Pull Request Review & Collaboration"
description: "Review GitHub pull requests directly in your browser with merge-base diffs, inline line comments, AI batch application, and in-session commit and push back to PR branches."
category: "guides"
order: 8
---

# GitHub Pull Request Review & Collaboration

px0 checks out a pull request's complete source tree and presents it like any local workspace: full codebase navigation, symbol outline, LSP code intelligence, and full-text regex search. Reviewers get a diff scoped to the pull request's merge-base, real-time coding agent synchronization, inline line comment drafting, AI batch application, and the full Git panel: stage, commit, push fixes back to the PR's own branch, and pull in new commits pushed while you were reviewing.

---

## Opening a Pull Request

Pull request review is triggered by passing the full pull request URL directly to the CLI:

```bash
px0 https://github.com/owner/repo/pull/123
```

px0 automatically prepares an isolated worktree or clone, computes the merge-base diff against the target branch, and opens a lightweight, zero-latency code viewer in your default browser.

> [!NOTE]
> Bare PR numbers (such as `px0 123`) and the legacy `px0 pr` subcommand have been deprecated in favor of explicit URL routing (`px0 <url>`). Running `px0 pr` displays a reminder to pass the URL directly.

### Preparation Progress Spinner

Because fetching metadata and checking out remote references takes a few moments, px0 displays an animated CLI spinner:

```text
⠋ Fetching PR #123 metadata from github...
⠙ Fetching PR #123 head and preparing worktree...
⠸ Computing merge base with main...
✔ PR #123 checked out (Refactor auth token resolution)
```

### Merged PR Handling

If the pull request is already merged:
- px0 detects its merged status from the API and opens it immediately without blocking or prompting.
- Both the CLI checkout summary and the browser review header display a prominent purple **Merged** pill badge.

### Multi-Session Process Isolation

Each pull request review runs as its own isolated process on an ephemeral port. Running `px0 https://github.com/owner/repo/pull/456` while another PR review or local workspace is open will never interfere with existing sessions.

From inside any running px0 browser session, you can also launch another pull request review via the Command Palette:
1. Press `Cmd+K` or `Ctrl+K`.
2. Select **Git: Open Pull Request...**
3. Paste the pull request URL. px0 launches a fresh review process in a new browser tab.

---

## Scoped Merge-Base Diffing & Isolated Reviewer Edits

Unlike standard working tree diffs that compare against `HEAD`, PR reviews calculate diffs against the commit where the PR branch diverged from the base branch (the merge-base):

- The **Changes** toggle in the sidebar defaults to all files touched by the pull request.
- Press **`Cmd+D`** or **`Ctrl+D`** on any file to open side-by-side or unified diffs.
- The diff is computed against the merge-base between the PR head and its target branch, exactly mirroring the diff shown on GitHub.
- Full codebase files remain fully browsable. You can jump to callers, inspect definitions, and search usages across untouched files without having to switch git branches locally.

### Isolated Reviewer Diffs

When reviewing a PR, you may test local changes or delegate fixes to an AI coding harness (`Alt+E`). px0 isolates your working-tree edits from the pull request author's commits:

- **Collapsible Diff Sections**: The diff viewer separates frozen PR changes (`PR Changes (Frozen)`) from your working edits (`Your Changes`), each with its own collapse toggle.
- **"YOU" Tree Badge**: Files modified locally by the reviewer receive a bright **YOU** badge in the sidebar tree, and directory branches display dirty dots so your changes stand out.
- **Selective Staging Controls**: Staging checkboxes in the PR tree are hidden by default for original PR files and appear only for files you modify, preventing accidental restaging of original PR code.
- **Protected Comment Anchoring**: Local reviewer diff sections are marked non-reviewable, ensuring inline comment drafts always anchor cleanly to upstream lines rather than local scratch edits.

---

## Inline Comments & Review Workflows

Reviewing code requires clear communication and quick feedback loops. px0 provides two convenient mechanisms to draft inline comments:

### 1. Line Hover Thread Icon

Hover over any line number in the source editor or diff viewer:
- A thread icon appears in the gutter.
- Clicking it opens a context menu with options for that line:
  - **Add Review Comment**: Opens the GitHub review comment composer for that line.
  - **Edit Inline**: Prompts your local AI coding harness to edit those lines directly.
  - **Start Thread**: Opens a persistent conversation with your agent anchored to that line.

### 2. Selection Action (`Alt+R` / `Option+R`)

Select any range of lines across the code viewport or diff viewer:
- The footer selection bar displays a dedicated **Comment** button with shortcut `Alt+R` (or `Option+R` on macOS).
- Pressing `Alt+R` opens the comment composer pre-targeted to your selected line range.
- Enter your comment and press `Cmd+Enter` or `Ctrl+Enter` to save the draft.
- Gutter markers (`💬`) and the top PR comments panel update immediately.

### In-Memory Draft Comment Model

Draft review comments are held in memory on the Go server:
- They never touch disk or alter git working-tree state.
- Drafts remain active across tab switches and diff toggles.
- If you close px0 before submitting or applying, drafts are discarded cleanly.

---

## Batch Apply with Local AI Agents

When reviewing pull requests, you often identify trivial fixes, missing docstrings, error handling tweaks, or variable renames. Instead of writing them manually or waiting for the author to cycle back:

1. Draft your comments across the affected files using `Alt+R` or the gutter pencil icon.
2. In the PR review header bar, click **Batch Apply**.
3. px0 dispatches all drafted comments to your configured AI coding agent (Claude Code, Gemini CLI, Cursor Agent, Antigravity, Aider).
4. The harness reads your comments as instructions and applies the edits directly to the worktree.
5. px0's real-time file watcher catches the modifications, reloading the diff view and tab statuses live.

---

## Submitting Formal Reviews to GitHub

When you are ready to post feedback back to GitHub:

1. The PR review header bar displays the overall review composer and status badge.
2. Enter your top-level review summary in the review box.
3. Select your review action:
   - **Comment**: Submit feedback without an approval status (available to all reviewers).
   - **Approve**: Approve the pull request (requires repository push access).
   - **Request Changes**: Request changes before merging (requires repository push access).
4. Submitting posts a single consolidated review payload containing your summary and all drafted line comments.
5. In-memory drafts are cleared upon successful submission.

---

## Edit, Commit, and Push Back to the PR

A PR checkout in px0 is a real git worktree. You can make adjustments, stage them, and push them directly to the PR's head branch:

### Commit with AI or Manual Message

1. Make edits to the code (by hand or using your AI coding harness).
2. Click the stage tick next to changed files in the sidebar, or click **Stage All**.
3. In the sidebar Git panel, write a commit message, or click **Commit with AI** to let your coding harness generate a concise commit message based on the staged diff.
4. Click **Commit**.

### Push Back to the PR's Actual Branch

In a PR review session, clicking **Push** sends the checkout's `HEAD` directly to the pull request's actual head branch:
- Pushes directly to the pull request repository URL, even if the PR originated from an external fork.
- You do not need to configure git remotes or wrestle with detached `HEAD` pointers in a terminal.
- Pushes are fast-forward only: if the PR branch moved, the remote rejection is reported cleanly.

### Pulling Upstream PR Updates

If the author pushes new commits to the pull request while you are reviewing:
1. Click **Pull** in the sidebar Git panel.
2. px0 fetches the updated PR head.
3. If the checkout can fast-forward cleanly, px0 updates the worktree, recomputes the merge-base, and refreshes the PR bar, diff views, and comment threads in place.
4. If your checkout has diverged with local unpushed commits, px0 cleanly refuses the pull rather than creating messy merge conflicts.

> [!IMPORTANT]
> A PR checkout lives in a temporary directory for the duration of the px0 session. Any edits made there are discarded when the process exits unless you push them back to the PR's branch before closing.

---

## Authentication & Token Discovery

px0 discovers forge credentials automatically in the following order:

1. **`github.token`** in px0 Settings (`Cmd+,` or `Ctrl+,` -> GitHub, stored in `~/.px0/settings.json`).
2. **`GITHUB_TOKEN`** environment variable.
3. **`GH_TOKEN`** environment variable.
4. **`gh auth token`** via the GitHub CLI if installed and authenticated.

### Unauthenticated Read-Only Mode & Token Prompts

If no token is found on your workstation:
- Public pull requests check out and diff seamlessly.
- You can navigate the entire repository, draft review comments in memory, and run **Batch Apply** with local AI harnesses.
- Comment composition controls and reply boxes remain enabled: if you click to submit a review without credentials, px0 presents a helpful nudge prompting you to connect a token.
- The top PR comments panel is collapsed by default with an interactive header toggle, keeping your editor workspace clean until you want to review all comments.
- The review submission bar is separated cleanly from the general PR conversation composer.
- The CLI startup banner displays:
  ```text
  access: read-only (no github token: set GITHUB_TOKEN or gh auth login to submit reviews)
  ```

---

## Keyboard Shortcuts for PR Review

| Shortcut / Control | Context | Action |
| :--- | :--- | :--- |
| `Alt+R` / `Option+R` | Editor or diff selection | Open review comment composer |
| `Alt+T` / `Option+T` | Editor or diff selection | Start a thread with your agent anchored to selection |
| `Alt+E` / `Option+E` | Editor or diff selection | Open inline agent edit comment box |
| Line Hover (Thread Icon) | Line number in gutter | Choose between review comment, inline edit, or thread |
| `Cmd+D` / `Ctrl+D` | Active editor tab | Toggle side-by-side / unified diff against merge-base |
| `Cmd+K` / `Ctrl+K` | Universal Palette | **Git: Open Pull Request...** launches a new review tab |
| **`Batch Apply`** | PR header bar | Dispatch all drafted comments to local AI coding harness |
| **Submit Review** | PR header bar | Submit Approve / Request Changes / Comment to GitHub |
| **Stage Tick** | File tree row | Stage or unstage that individual file |
| **Commit with AI** | Sidebar Git panel | Generate message from staged diff and commit |
| **Push** | Sidebar Git panel | Push committed changes to the PR's head branch |
| **Pull** | Sidebar Git panel | Fast-forward checkout onto new commits pushed to the PR |
