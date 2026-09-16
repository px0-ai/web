---
title: "Quickstart & First Session"
description: "Take a tour of the px0 interface, learn the five primary regions, and master instant code navigation."
category: "getting-started"
order: 2
---

# Quickstart & First Session

px0 turns your browser into a zero-latency inspection console for any codebase on your machine. This guide walks you through launching your first session and navigating the interface.

## Launching Your First Workspace

Open any directory or repository by passing its path to `px0`:

```bash
# Open current working directory
px0 .

# Or open any repository path
px0 ~/projects/backend
```

px0 instantly scans the directory tree in a few milliseconds, launches an embedded HTTP server on port 7777, and opens your default browser to `http://127.0.0.1:7777`.

## Interface Anatomy

The px0 interface is designed for high-density reading and zero visual clutter. It consists of five primary regions:

![px0 Interface Overview](/images/docs/quickstart-ui.jpg)

### 1. Left Activity Rail
The narrow leftmost bar lets you toggle sidebar panels:
- **Files (Explorer)**: View folder hierarchy and changed files.
- **Workspace Search**: Full-text regex search across the repository.
- **Symbol Outline**: Instant symbol hierarchy for the active file.
- **Themes**: Cycle or select from 14 built-in syntax themes.
- **Shortcuts (`?`)**: Show the interactive keyboard shortcut sheet.

### 2. Collapsible Sidebar
- **Project Root**: Displays the root folder name.
- **Changed Files Filter (`*`)**: Filters the tree to show only files with git changes (`M`, `A`, `D`, `U`).
- **Reindex Button (`↻`)**: Re-scans the project tree and updates git diff badges in under 50 ms.
- **Status Bar Footer**: Shows the current px0 version and theme selector.

### 3. Tab & Breadcrumbs Bar
- Displays active tabs with language icons.
- Click any path segment in the breadcrumbs bar to reveal that directory in the file explorer.
- Re-open closed tabs quickly with `Alt+Shift+T`.

### 4. Virtualized Code Viewport
- **Windowed Rendering**: Opening a 500,000-line file costs the same memory as a 10-line file. Only the visible ~60 rows are mounted in the browser DOM.
- **Read-Only Caret**: Click anywhere to place the caret or select code snippets. Because px0 is strictly read-only, keystrokes will never overwrite your code or collide with active AI agents.
- **Hover Inspection**: Move your mouse over any identifier to inspect its type signature and documentation.

### 5. Status Bar
Located at the bottom of the window, the status bar displays:
- Language mode (e.g. Go, Rust, TypeScript, Python)
- Line count and file size
- Cursor position (line and column)
- Language Server (LSP) status indicator
- Millisecond index timing and idle memory reclamation state

## Core Navigation Workflows

### 1. Jump to Any File (`Ctrl+P` or `Cmd+P`)
Press `Ctrl+P` (or `Cmd+P` on macOS) to open the fuzzy file finder. Type any part of a file path (for example `srv/http` or `pkg/index`) and press `Enter` to open it immediately.

### 2. Full Workspace Search (`Ctrl+Shift+F` or `Cmd+Shift+F`)
Press `Ctrl+Shift+F` to open the full-text search panel. Searches execute in parallel across all CPU cores, bypassing `.gitignore` files automatically.

### 3. Jump to Symbol in File (`Ctrl+Shift+O` or `Cmd+Shift+O`)
Quickly jump to functions, methods, structs, or classes within the current file. Symbols are extracted via LSP when available, or instant regex parsing as fallback.

### 4. Inspect Git Diffs (`Ctrl+D` or `Cmd+D`)
Press `Ctrl+D` on any modified file to view side-by-side or unified diffs against `HEAD`. Uncommitted agent changes are highlighted with green and red gutter markers.

## Stopping px0

When you are done reviewing code, switch to your terminal and press `Ctrl+C`. The server cleanly stops child language server processes and terminates without leaving temporary cache files or lockfiles on your system.
