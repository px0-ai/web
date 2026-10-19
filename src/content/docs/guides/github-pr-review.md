---
title: "Pull Request Review & Collaboration (GitHub, GitLab, Gitea, Bitbucket)"
description: "Review, edit, resolve conflicts, and merge pull requests across GitHub, GitLab, Gitea, and Bitbucket with merge-base diffs, inline comments, and AI batch application."
category: "guides"
order: 9
---

# Pull Request Review & Collaboration

px0 checks out a pull request's complete source tree and presents it like any local workspace: full codebase navigation, symbol outline, LSP code intelligence, and full-text regex search. Reviewers get a diff scoped to the pull request's merge-base, real-time coding agent synchronization, inline line comment drafting, AI batch application, in-app merge controls, conflict resolution with AI, and the full Git panel to stage, commit, push fixes back to the PR's own branch, or pull in new commits pushed while reviewing.

px0 supports four major git forges using the exact same interface: **GitHub**, **GitLab** (gitlab.com and self-hosted), **Gitea / Forgejo / Codeberg**, and **Bitbucket Cloud**.

For a quick 5-minute walkthrough, see [Getting Started with Pull Request Review](/docs/guides/pr-review-getting-started).

---

## Opening a Pull Request

Pull request review is triggered by passing the full pull request URL directly to the CLI:

```bash
# GitHub
px0 https://github.com/owner/repo/pull/123

# GitLab (gitlab.com or self-hosted instances)
px0 https://gitlab.com/group/project/-/merge_requests/45

# Gitea, Forgejo, or Codeberg
px0 https://codeberg.org/owner/repo/pulls/7

# Bitbucket Cloud
px0 https://bitbucket.org/workspace/repo/pull-requests/9
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
- The diff is computed against the merge-base between the PR head and its target branch, exactly mirroring the diff shown on GitHub or GitLab.
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
  - **Add Review Comment**: Opens the review comment composer for that line.
  - **Edit Inline**: Prompts your local AI coding harness to edit those lines directly.
  - **Start Thread**: Opens a persistent conversation with your agent anchored to that line.

### 2. Selection Action (`Alt+R` / `Option+R`)

Select any range of lines across the code viewport or diff viewer:
- The footer selection bar displays a dedicated **Comment** button with shortcut `Alt+R` (or `Option+R` on macOS).
- Pressing `Alt+R` opens the comment composer pre-targeted to your selected line range.
- Enter your comment and press `Cmd+Enter` or `Ctrl+Enter` to save the draft.
- Gutter markers (`💬`) and the top PR comments panel update immediately.

### Persistent Draft Comment Storage

Draft review comments are saved in persistent session files located at `$XDG_STATE_HOME/px0/pr-sessions/` (falling back to `~/.px0/pr-sessions/`):
- Keyed to a stable identifier derived from the forge and PR (`provider/owner/repo#number`), not the temporary checkout path.
- Drafts survive browser reloads, workspace stops, and worktree recreations.
- Drafts remain active across tab switches, file edits, and diff toggles until explicitly submitted or deleted.

---

## Batch Apply with Local AI Agents

When reviewing pull requests, you often identify trivial fixes, missing docstrings, error handling tweaks, or variable renames. Instead of writing them manually or waiting for the author to cycle back:

1. Draft your comments across the affected files using `Alt+R` or the gutter pencil icon.
2. In the PR review header bar, click **Batch Apply**.
3. px0 dispatches all drafted comments to your configured AI coding agent (Claude Code, Cursor Agent, Antigravity, or OpenCode).
4. The harness reads your comments as instructions and applies the edits directly to the worktree.
5. px0's real-time file watcher catches the modifications, reloading the diff view and tab statuses live.

---

## Submitting Formal Reviews to Remote Forges

When you are ready to post feedback back to the forge:

1. The PR review header bar displays the overall review composer and status badge.
2. Enter your top-level review summary in the review box.
3. Select your review action:
   - **Comment**: Submit feedback without an approval status (available to all reviewers).
   - **Approve**: Approve the pull request (requires repository push access).
   - **Request Changes**: Request changes before merging (requires repository push access).
4. Submitting posts your review summary and all drafted line comments according to forge API conventions.
5. In-session drafts are cleared upon successful submission.

---

## Bringing PRs Up to Date & Resolving Conflicts

When the upstream base branch moves ahead, the PR status pill in the review bar updates:
- **Behind main**: The PR is simply behind the base branch and can be updated cleanly.
- **Conflicts with main**: The base branch has diverged with overlapping edits.

Click **Update branch** or **Resolve conflicts**:
1. px0 fetches the latest base branch and prompts you in the Git panel to pick a strategy:
   - **Rebase with AI**: Replays PR commits on top of base for a linear history.
   - **Merge with AI**: Merges the base branch into the PR branch with a merge commit.
2. The chosen harness resolves conflicts, edits files, and stages the resolutions. The harness is instructed never to push.
3. Review the result in the diff viewer.
4. For rebases, px0 prompts you before force-pushing. px0 uses `git push --force-with-lease` so that if someone pushed to the PR branch while you were rebasing, the push is refused and remote work is never lost.

---

## Merging the Pull Request

When all checks pass and the pill reads **Ready to merge**, use the merge split button:

1. Click the dropdown caret to choose a merge strategy:
   - **Create a merge commit**: Creates a merge commit on the base branch.
   - **Squash and merge**: Combines all PR commits into a single commit on the base branch.
   - **Rebase and merge**: Fast-forwards commits linearly onto the base branch.
2. In the merge dialog, edit the commit title and message. Click **Rewrite with AI** to generate a clean, informative commit summary following your configured `git.commitMessageInstruction`.
3. Confirm the merge. px0 verifies that the PR head matches the exact commit you reviewed before executing the merge.

---

## Forge Differences

The table below summarizes behavioral differences across supported git forges:

| Capability | GitHub | GitLab | Gitea / Forgejo | Bitbucket Cloud |
| :--- | :--- | :--- | :--- | :--- |
| **Self-hosted instances** | No | Yes | Yes | No (Data Center unsupported) |
| **Review submission** | Consolidated review | Separate threads + approval | Consolidated review | Separate comments + approval |
| **Request Changes** | Native | Comment + withdrawn approval | Native | Native |
| **Threaded replies** | Yes | Yes | Same-line comments | Yes |
| **Conflicts known in advance** | Yes | Yes | Yes | Yes (from diffstat) |
| **Protection rules in advance** | Yes | Yes | No (reported on merge attempt) | No (reported on merge attempt) |
| **Merge pinned to reviewed commit** | Pinned by forge | Pinned by forge | Pinned by forge | Verified by px0 before merge |

### GitLab Nuances
- **Submissions**: GitLab has no single endpoint for batched reviews. Each draft comment creates a diff discussion thread, and the summary is posted as a note. **Approve** triggers GitLab's native approval pinned to the reviewed commit SHA.
- **Merge methods**: Follows project settings (merge commit, fast-forward rebase, or squash). When a rebase is required, the status pill reads *Behind main*.
- **UI wording**: Labeled "PR #N" in the px0 UI rather than GitLab's "!N" for consistency.

### Gitea / Forgejo Nuances
- **Submissions**: Posted as a single consolidated review payload matching GitHub's workflow.
- **Replies**: Gitea replies are created as comments on the corresponding line. Existing comments are rendered on the new side of the diff.
- **Merge checks**: Branch protection rules are validated during the merge attempt; if blocked, Gitea's error reason is displayed in the dialog.

### Bitbucket Cloud Nuances
- **Checkout**: Bitbucket does not publish head refs under `refs/pull/`, so px0 clones the source branch directly (including from forks).
- **Submissions**: Drafts post as individual inline comments with native threading.
- **Tokens**: API tokens require account email to verify push permissions. Standard workspace access tokens leave **Approve** and **Merge** hidden.

---

## Authentication & Forge Connect Dialog

px0 discovers credentials automatically from settings and environment variables:

- **GitHub**: `github.token` in Settings, `GITHUB_TOKEN`, `GH_TOKEN`, or `gh auth token`.
- **GitLab**: `gitlab.token` in Settings, `GITLAB_TOKEN`, or `glab auth` CLI credentials. For self-hosted instances, configure `gitlab.host`.
- **Gitea / Codeberg**: `gitea.token` in Settings, `GITEA_TOKEN`. Hostname configured via `gitea.host`.
- **Bitbucket**: `bitbucket.token` and `bitbucket.email` in Settings, or `BITBUCKET_TOKEN` / `BITBUCKET_EMAIL`.

### Connect Dialog

If you open a pull request without configured credentials, px0 operates in read-only mode and displays a **No &lt;forge&gt; token - click to connect** link in the PR bar. Clicking it opens the in-app Connect dialog:
- Guides you through generating the correct token type with precise scope instructions.
- Verifies token validity immediately on paste.
- Saves the token directly to `~/.px0/settings.json` without requiring a server restart.

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
| **No token - click to connect** | PR header bar | Open in-app token connection modal |
| **`Batch Apply`** | PR header bar | Dispatch all drafted comments to local AI coding harness |
| **Submit Review** | PR header bar | Submit Approve / Request Changes / Comment to forge |
| **Status Pill** | PR header bar | Display mergeability status; click to resolve or refresh |
| **Squash and merge ▾** | PR header bar | Select merge strategy and open merge dialog |
| `Cmd/Ctrl+Enter` | Merge dialog | Confirm and execute merge |
| `Esc` | Merge / Connect dialog | Dismiss modal dialog |
| **Resolve conflicts** | PR header bar | Trigger AI-assisted rebase or merge on divergence |
| **Force-push** | Sidebar Git panel | Push rebased commits using safe lease |
| **Pull** | Sidebar Git panel | Fast-forward checkout onto new commits pushed to the PR |
| **Push** | Sidebar Git panel | Push committed changes to the PR's head branch |
