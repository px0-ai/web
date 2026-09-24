---
title: "Exploring Massive Codebases"
description: "How to index, search, and navigate 100k+ file repositories like the Linux kernel in milliseconds."
category: "guides"
order: 3
---

# Exploring Massive Codebases

Opening huge open-source repositories in traditional IDEs often triggers several minutes of indexing, high CPU fan speeds, and gigabytes of memory consumption.

px0 is engineered specifically for fast, zero-overhead inspection of massive codebases.

## Step 1: Target a Large Repository

You can point px0 to any large repository on your disk (such as Kubernetes, Chromium, or Linux):

```bash
git clone --depth 1 https://github.com/torvalds/linux.git /tmp/linux
```

## Step 2: Launch px0

Launch px0 passing the repository path directly:

```bash
px0 /tmp/linux
```

Notice the startup performance:
- File tree indexing completes in ~370 ms across 95,000+ files.
- Memory usage: the Go backend daemon requires strictly ~20-30 MB of host RSS (~55 MB peak when indexing/scanning all 95,000 Linux files).
- Combined footprint: with the browser tab (~80-150 MB) included, total system RAM is ~100-180 MB (compared to ~1.4 GB in Electron-based editors).
- Automatic scavenger: unused memory pages surrender back to the host kernel after 15 seconds of idle time.

## Step 3: Fast Navigation Shortcuts

Once px0 opens in your browser (`http://127.0.0.1:7777`):

1. **Fuzzy File Picker**: Press `Ctrl+P` (or `Cmd+P`), type `sched/core.c`, and press Enter. The file opens instantly.
2. **Document Outline & Symbols**: Press `Ctrl+Shift+O` (or `Cmd+Shift+O`) to jump across symbols in the active file.
3. **Workspace Full-Text Search**: Press `Ctrl+Shift+F` (or `Cmd+Shift+F`) to search across the entire codebase with ripgrep-grade speed.
4. **Git Diffs**: Press `Ctrl+D` to toggle split or inline diff views against `HEAD`.

Scrolling through hundreds of thousands of lines maintains smooth 60 FPS performance thanks to px0 windowed virtual DOM row rendering.

## Step 4: Explorer Batch Expand & Collapse Controls

When inspecting deep directory structures:
- **Expand All**: Click the expand icon in the file explorer header to open nested project folders in small, bounded batches (at most four directories at a time).
- **Ignore Protection**: Expand All skips ignored directories (such as `node_modules`, `dist`, or `build`), so massive generated trees are never bulk-loaded. You can still click to expand them individually on demand.
- **Immediate Cancellation**: Clicking Collapse All, clicking any folder, or switching to the Changes filter cancels running batch expansions immediately.
- **Session Persistence**: Your expanded folders and open tabs are saved via `/api/session` on the server and restored automatically when you reopen the workspace.
