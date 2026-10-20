---
title: "Review Workbench & Multi-Workspace Management"
description: "Manage multiple local repositories and pull request reviews from a single interactive launchpad with folder autocompletion, worktree isolation, and aggregate resource metrics."
category: "guides"
order: 1
---

# Review Workbench & Multi-Workspace Management

Running `px0` with no arguments launches the **Review Workbench**: a unified browser dashboard for opening any local directory or remote pull request, jumping back to recently opened projects, and managing concurrent review sessions from a single port.

---

## Launching the Workbench

To start the workbench, run `px0` from your terminal without passing a directory or URL:

```bash
px0
```

px0 binds to `127.0.0.1:7777` (or the next available port) and opens the workbench interface in your default browser.

To open your current working directory directly without entering the workbench (the legacy behavior of bare `px0`), pass a dot explicitly:

```bash
px0 .
```

---

## Opening Projects and Pull Requests

The workbench provides multiple fast ways to open projects:

### 1. Unified Input Box & Folder Autocompletion

Type a path or paste a pull request URL into the input field at the top of the page:

- **Path support**: Accepts absolute paths (`/home/user/code/app`), paths relative to the terminal directory where px0 was started (`./backend`), or home-relative paths (`~/workspace/repo`).
- **Interactive completion**: As you type, px0 suggests matching directories in real time, displaying a `git` badge on directories containing a Git repository.
- **Keyboard navigation**:
  - Press **Tab** (or click a suggestion) to complete the highlighted folder and list its subdirectories.
  - Use **Up** and **Down** arrow keys to select from suggestions.
  - Press **Enter** to open the selected directory immediately.
  - Press **Escape** to dismiss the suggestion popup.
- **Dotfiles**: Type a leading dot (`.`) to reveal hidden directories in completion suggestions.

### 2. Filesystem Browse Panel

The right-side **Browse** panel lets you explore your filesystem visually:

- Click any folder row to descend into it.
- Click **Open this folder** to launch a workspace for the active directory.
- Click **Open** on any subfolder row to launch it directly.
- Toggle the **hidden** checkbox to reveal or hide dot-directories.

### 3. Quick CWD Access

Click **Open &lt;cwd&gt;** to jump straight into the directory from which the workbench was launched.

### 4. Pull Request URLs

Paste a pull request URL from GitHub, GitLab, Gitea, or Bitbucket directly into the input box:

```text
https://github.com/owner/repo/pull/123
https://gitlab.com/group/project/-/merge_requests/45
https://codeberg.org/owner/repo/pulls/7
https://bitbucket.org/workspace/repo/pull-requests/9
```

px0 automatically prepares an isolated worktree and opens the review session.

---

## Managing Recent & Pinned Workspaces

The **Recent** list displays every local directory and pull request opened on the machine, sorted by most recent access:

- **One-click reopening**: Click any workspace row to open it.
- **Multi-tab navigation**: Cmd-click (macOS) or Ctrl-click (Linux / Windows) any row to open the workspace in a new browser tab.
- **Stable URLs**: Each workspace is assigned a deterministic, stable address (`/w/<id>/`) derived from a SHA-256 hash of its path or PR identity. Bookmarked URLs and browser reloads reopen cleanly.
- **Returning to Workbench**: Inside any running workspace, click the grid icon (**▦**) in the file explorer header to return to the workbench dashboard.

### Row Controls

Hover over any workspace row in the Recent list to reveal quick actions:

| Action | Control | Description |
| :--- | :--- | :--- |
| **Pin / Unpin** | Star icon (☆ / ★) | Pin favorite workspaces to the top of the list. Pinned workspaces are never evicted. |
| **Stop** | Stop button (■) | Terminate the background workspace process and free its RAM immediately. Opening the row again restarts it. |
| **Remove** | Close button (✕) | Stop the workspace process and delete it from the Recent list. |

A live status indicator dot shows whether each workspace is currently **running** (green), **starting** (amber), or **failed** (red, hover for error details). The workbench preserves up to 50 unpinned recent items.

---

## Keyboard Shortcuts & Controls

| Shortcut / Control | Context | Action |
| :--- | :--- | :--- |
| `/` | Workbench Page | Focus the path / PR URL input box |
| `Tab` | Path Input | Complete into the highlighted folder suggestion |
| `↑` / `↓` | Path Suggestions | Navigate up / down through folder suggestions |
| `Enter` | Path Input / Suggestion | Open the entered folder, PR URL, or highlighted suggestion |
| `Esc` | Path Suggestions / Theme | Dismiss folder suggestions or restore previous theme |
| `Cmd/Ctrl + Click` | Recent Workspaces | Open workspace in a new browser tab |
| `☆` / `★` | Workspace Row | Pin workspace to the top of the list, or unpin |
| `■` | Workspace Row | Stop running workspace child process and free RAM |
| `✕` | Workspace Row | Stop workspace and remove from list |
| `▦` | Workspace Header | Return to the Review Workbench from any open workspace |
| `Palette button` / `Arrow keys` | Status Bar | Preview and select workbench color theme |

---

## Never Leave the Workbench: Complete GitHub Control & Agentic Rebase

The Review Workbench is built to serve as your complete code review and Git cockpit: you never have to leave the workbench or cycle between external terminals and IDEs:

- **Complete GitHub & Forge Control**: Review scoped merge-base diffs, draft inline comments with `Alt+R`, batch-apply AI suggestions, submit approvals or change requests, and execute merges (Squash, Merge Commit, Rebase) straight from the interface.
- **Agentic Rebase & Conflict Resolution**: When pull requests or local branches fall behind or encounter conflicts, trigger **Rebase with AI** directly next to the status pill. Your local coding harness replays commits, resolves conflict markers, and stages clean resolutions. Rewritten branches can be pushed safely using `--force-with-lease`.
- **Zero-Friction Switching**: Jump between multiple active reviews in browser tabs, monitor real-time resource usage across all child instances, and click **▦** in any workspace header to instantly return to the central workbench launchpad.

---

## Worktree-Based Pull Request Reviews

When opening a pull request from the workbench, px0 never clones full repositories repeatedly. Instead, it creates an isolated `git worktree` tied to a local clone:

1. **Automatic Clone Discovery**:
   - Checks previously used clones recorded in `workbench.json`.
   - Checks recent workspace folders and the workbench launch directory.
   - Performs a rapid, bounded scan (max 1.5 seconds, 3 levels deep) of common development directories (`~/workspace`, `~/code`, `~/projects`, `~/src`, `~/dev`, `~/repos`, `~/go/src/github.com`).
   - A clone matches if any configured remote (`origin`, `upstream`, or custom fork) points to the pull request repository.

2. **Managed Clones**:
   If no existing clone is found on your machine, px0 prompts you:
   - **Use your clone**: Specify an existing path via autocomplete or the file browser.
   - **Let px0 clone it**: px0 creates a minimal, blobless partial clone (`--filter=blob:none`) without a working-tree checkout inside `~/.px0/repos/<owner>/<repo>`. This clone is shared across all future PR reviews for that repository.

3. **Safe Isolation & Persistent Drafts**:
   - The PR worktree is created in an isolated directory. Your primary working tree and current branches are never modified.
   - Unsubmitted inline review drafts are persisted in session storage keyed to the PR identifier (`$XDG_STATE_HOME/px0/pr-sessions/`). Drafts survive closing the browser, stopping the workspace, or recreating the temporary worktree.
   - When a workspace is stopped or deleted, px0 cleanly removes its temporary worktree and associated Git references.

---

## Status Bar & Aggregated Metrics

The workbench footer mirrors px0's status bar and provides global visibility across all running review processes:

- **Process Count**: Displays the total count of active child workspaces currently running in the background.
- **Aggregated CPU · RAM · LSP Chip**: Shows the combined resource consumption of the workbench server plus all active child processes. Click the chip to open an interactive dropdown displaying the exact breakdown per process.
- **Theme Switcher**: Click the theme palette icon in the footer (or press the theme shortcut) to preview and switch syntax themes. The selected theme is applied globally across both the workbench and every workspace.

---

## Resource Lifecycle & Process Management

px0 is designed for minimal resource consumption:

- **Isolated Child Processes**: Each workspace runs as an independent child process listening on `127.0.0.1` with its own ephemeral port, isolated index, and language server instances.
- **Automatic Idle Reaping**: A workspace that has had no active browser tabs or event streams for 30 minutes is automatically stopped (`reapIdle`), releasing memory and language servers. Reopening the tab or clicking its row immediately relaunches it.
- **Single Instance Locking**: Running `px0` again in a terminal while a workbench is already running detects the active process via `workbench.lock` and focuses the existing browser tab instead of spawning duplicate servers.
- **Clean Teardown**: Pressing `Ctrl+C` on the workbench cleanly stops all child workspaces, drains active event streams, shuts down language servers, and removes temporary PR worktrees.

---

## Security Considerations

The workbench can list and open any directory readable by the user running the `px0` binary:

- **Default Loopback Binding**: By default, px0 binds strictly to `127.0.0.1`, restricting access entirely to the local machine.
- **Wide Network Binding (`-host 0.0.0.0`)**: If you explicitly pass `-host 0.0.0.0` to expose px0 across a local network or container bridge, anyone who can reach the address can browse and edit files on your machine. px0 emits a prominent terminal security warning when non-loopback hosts are specified.
- **DNS Rebinding Protection**: All API endpoints enforce strict Host and Origin validation (`localPost` and `trustedGet`) to guard against cross-site request forgery and DNS rebinding attacks.

---

## Workbench State Location

Workbench state is kept completely outside your repositories:

- **Recent & Pinned Store**: Saved in `$XDG_STATE_HOME/px0/workbench.json` (falling back to `~/.px0/workbench.json`).
- **Managed Clones**: Stored in `$XDG_STATE_HOME/px0/repos/`.
- **PR Review Drafts**: Stored in `$XDG_STATE_HOME/px0/pr-sessions/`.
- **Instance Lock**: Recorded in `workbench.lock` alongside `workbench.json`.
