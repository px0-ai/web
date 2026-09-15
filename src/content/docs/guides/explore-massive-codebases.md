---
title: "Exploring Massive Codebases with Zero Latency"
description: "How to index, search, and navigate 100k+ file repositories like the Linux kernel in milliseconds."
category: "guides"
order: 3
---

# Exploring Massive Codebases with Zero Latency

Opening huge open-source repositories in traditional IDEs often triggers several minutes of indexing, high CPU fan speeds, and gigabytes of memory consumption.

px0 is engineered specifically for fast, read-only inspection of massive codebases.

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
- Memory usage settles at ~55 MB of RAM (compared to ~1.4 GB in Electron-based editors).

## Step 3: Fast Navigation Shortcuts

Once px0 opens in your browser (`http://127.0.0.1:7777`):

1. **Fuzzy File Picker**: Press `Ctrl+P` (or `Cmd+P`), type `sched/core.c`, and press Enter. The file opens instantly.
2. **Document Outline & Symbols**: Press `Ctrl+Shift+O` (or `Cmd+Shift+O`) to jump across symbols in the active file.
3. **Workspace Full-Text Search**: Press `Ctrl+Shift+F` (or `Cmd+Shift+F`) to search across the entire codebase with ripgrep-grade speed.
4. **Git Diffs**: Press `Ctrl+D` to toggle split or inline diff views against `HEAD`.

Scrolling through hundreds of thousands of lines maintains smooth 60 FPS performance thanks to px0 windowed virtual DOM row rendering.
