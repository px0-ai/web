---
title: "Direct File Editing & Item Creation"
description: "How to edit files directly in the browser, create new files and folders, safeguard unsaved changes, and auto-refresh Git and LSP."
category: "guides"
order: 5
---

# Direct File Editing & Item Creation

While px0 is engineered primarily for instant reading, searching, and reviewing code alongside autonomous AI harnesses, quick in-place modifications and workspace item creation are often needed without switching back to a terminal editor.

Starting in version 0.1.17, px0 provides zero-latency, in-browser direct file editing and file/folder creation with full keyboard shortcuts, dirty state tracking, and automatic Git and language server synchronization.

---

## Editing a File

You can enter edit mode on any open text document using any of the following methods:

- **Keyboard Shortcut**: Press `Cmd+E` (macOS) or `Ctrl+E` (Linux/Windows).
- **Tab Header Action**: Click the **Edit** button in the tab bar header.
- **Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)**: Run `File: Edit Current File`.

The virtualized code view is replaced by a plain text editor with its own synchronized line-number gutter.

### Saving Changes

- Press `Cmd+S` (macOS) or `Ctrl+S` (Linux/Windows), or click the **Save** button in the tab header.
- On success, the Save button highlights in solid green with a check mark to provide clear visual feedback.
- Saving immediately dispatches `/api/file/save`, writes content to disk, invalidates syntax-highlight caches, refreshes open LSP documents, updates the search index, and refreshes the Git status stream.

### Leaving Edit Mode

- Press `Esc`, press `Cmd/Ctrl+E` again, or click the **Done** button in the tab header.
- If you have unsaved edits, px0 prompts you for confirmation before discarding changes.
- **Scroll & View Alignment**: On Markdown, CSV, or TSV documents, entering edit mode from Preview starts the editor at the exact section you were reading. Leaving edit mode returns directly to your previous view (Preview or Source) with scroll position aligned to the line you were editing.

### Editor Behavior & Hotkeys

| Key | Action | Behavior |
| :--- | :--- | :--- |
| `Tab` | Indent | Inserts four spaces. When multiple lines are selected, indents every selected line. |
| `Shift+Tab` | Outdent | Decreases indentation across selected lines. |
| `Enter` | New line | Automatically preserves the indentation depth of the preceding line. |
| `Cmd+S` / `Ctrl+S` | Save | Flushes edits to disk and clears dirty state. |
| `Cmd+F` / `Ctrl+F` | Find in editor | Opens the in-editor find bar directly over the active text buffer. |
| `Enter` / `Shift+Enter` (in find) | Next / Prev hit | Navigates to the next or previous matching occurrence and centers it. |
| `Cmd+G` / `Ctrl+G` | Jump to line | Jumps caret directly to the specified line number. |
| `Esc` | Leave edit mode / Close find | Closes find bar if open, or leaves edit mode (prompts if unsaved changes exist). |

### In-Editor Find & Caret Navigation (`Cmd/Ctrl+F`)

Starting in version 0.1.20, direct edit mode includes a focused in-editor find bar:

- **Direct Buffer Searching**: Search operates instantly over the active textarea buffer without relying on full-text indexing or backend round-trips.
- **Match Count Indicator**: Displays live hit statistics (e.g. `3 / 14`) as you type.
- **Seamless Hit Stepping**: Press `Enter` or click the down arrow to step to the next match; press `Shift+Enter` or click the up arrow to step backwards.
- **Viewport Centering**: Each matching hit is highlighted, selected, and centered within the viewport.
- **Scrollbar Markers**: Matches are plotted along the scrollbar track for instant spatial awareness.

- **Native Undo History**: Edits use the browser's native input commands, preserving full `Cmd+Z` / `Ctrl+Z` undo and redo stacks.
- **Dynamic Word Wrap**: Follows the active `editor.wordWrap` setting (`Alt+Z`). When wrap mode is active, gutter line numbers dynamically align to wrapped line heights using an off-screen layout mirror.
- **Size Safety Limits**: To prevent browser tab stalls, files exceeding 10,000 lines or 1 MB prompt for user confirmation before opening in the direct editor.
- **Restricted Targets**: In-browser editing is disabled for binary assets, images, deleted files, and tabs pinned to a specific commit.

---

## State Retention & Data-Loss Protection

px0 protects in-progress edits across daily review workflows:

1. **Unsaved Tab Indicators**: Tabs with uncommitted text edits display an amber dirty dot marker next to the file name.
2. **Tab Close & Exit Guards**: Closing a dirty tab or navigating away from the browser window triggers a confirmation prompt before changes are discarded.
3. **Tab Switching Retention**: Switching between different tabs while editing preserves the unsaved text buffer and scroll offset for each file independently.
4. **Clean Diff Transitions**: Requesting a Git diff (`Cmd/Ctrl+D`) on a file currently being edited cleanly suspends edit mode and renders the diff against `HEAD`. Your unsaved working text is retained for when you resume editing.

---

## Creating Files and Directories

You can create new files and folders anywhere in your project workspace:

- **Sidebar Header**: Click the **New File** or **New Folder** icon button in the explorer sidebar header.
- **Tree Context Menu**: Right-click any folder or directory row in the explorer tree and select **New File...** or **New Folder...**.
- **Command Palette**: Run `File: New File...` or `File: New Folder...`.

### Creation Dialog & Path Traversal Guards

1. Enter a path relative to the workspace root (or relative to the folder right-clicked in the tree).
2. Missing intermediate parent directories are created automatically.
3. Attempting to create an item that already exists returns a safe conflict status (`409 Conflict`) without overwriting existing data.
4. All path arguments resolve through internal path traversal validators (`safePath`), rejecting attempts to write outside the workspace boundary.
5. When a new file is created, it opens immediately in an active editor tab ready for editing.

---

## Automatic Git and Subsystem Synchronization

Saving a modified file or creating a workspace item immediately synchronizes px0's internal subsystems:

- **Reactive Git Stream**: Pushes working-tree modifications to the sidebar tree, status bar, and commit panel without waiting for periodic polling ticks.
- **Search Index**: Triggers a background incremental index update so fuzzy file searches (`Ctrl+P`) and regex grep (`Ctrl+Shift+F`) locate new items instantly.
- **LSP Documents**: Re-syncs document buffers with active language servers (`gopls`, `clangd`, `rust-analyzer`), updating diagnostics and symbol outlines.
- **Chroma Cache**: Evicts outdated syntax-highlight chunk caches so subsequent reads display updated token trees.

---

## Remote Access Security

Because `/api/file/save` and `/api/fs/new` write directly to the host filesystem, remote workspaces should be managed with standard network precautions:

- When launching px0 with `-host 0.0.0.0` or exposing ports on remote servers, ensure access is restricted to trusted local networks, VPN tunnels (e.g., Tailscale, WireGuard), or authenticated reverse proxies.
- For read-only inspection environments where writing should be impossible, you can mount workspace filesystems as read-only.
