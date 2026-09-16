---
title: "Inspecting & Reviewing Git Diffs"
description: "Review live uncommitted changes, filter modified files, and compare side-by-side or unified diffs against HEAD."
category: "guides"
order: 7
---

# Inspecting & Reviewing Git Diffs

px0 includes built-in git integration designed to provide real-time visibility into working tree modifications. Because px0 never writes to disk, it serves as a secure, non-interfering review station while AI coding agents edit code in your terminal.

## Live File Status Badges

The file explorer automatically flags repository changes with color-coded status badges:

| Badge | Status | Description |
| :--- | :--- | :--- |
| `M` (Yellow) | Modified | Existing tracked file modified in the working tree. |
| `A` (Green) | Added | New file staged or tracked in git. |
| `D` (Red) | Deleted | File removed from the working tree. |
| `U` (Cyan) | Untracked | New uncommitted file present in the directory. |
| `R` (Purple) | Renamed | File renamed or moved. |

### Ancestor Dirty Propagation
When a deeply nested file is modified (for example `src/api/v2/auth/handler.go`), parent folder nodes (`src`, `api`, `v2`, `auth`) automatically display dirty dot indicators. This lets you spot modified files even when folder trees are collapsed.

## Filtering Changed Files

To filter out thousands of untouched files and focus strictly on agent edits:

1. Click the **Changed Files Button (`*`)** at the top of the file sidebar (next to the workspace title).
2. The tree collapses untouched folders, displaying only modified, added, and untracked files.
3. Click the button again to return to the full project tree.

## Toggling Diff View (`Ctrl+D` or `Cmd+D`)

Open any modified file and press:

```text
Ctrl+D    (or Cmd+D on macOS)
```

This toggles the active file between standard code view and the interactive Diff Viewer against `HEAD`.

![px0 Git Diff Split View](/images/docs/git-diff-ui.jpg)

### Split vs Unified Diffs
- **Split View (Side-by-Side)**: Displays original `HEAD` content on the left and modified working tree content on the right, highlighting replaced lines side-by-side.
- **Unified View (Inline)**: Displays changes sequentially with green additions (`+`) and red deletions (`-`).
- Use the toggle switch in the editor toolbar to switch between Split and Unified diff modes. px0 remembers your preference across files.

## Gutter Diff Markers in Normal View

Even when not in full diff mode, the code editor viewport indicates modifications directly in the line number gutter:
- **Green border**: Newly inserted line.
- **Blue border**: Modified line.
- **Red triangle**: Deleted line marker between lines.

## Manual Reindexing (`↻`)

When an external coding agent finishes writing files, click the **Re-index button (`↻`)** at the top of the file explorer or press your browser's reload button. px0 rescans the working tree and updates all git diff indicators in a few milliseconds.
