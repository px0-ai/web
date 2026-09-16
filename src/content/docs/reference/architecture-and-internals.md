---
title: "Architecture & Systems Internals"
description: "Technical deep dive into px0's single-binary design, parallel indexing, fuzzy matching, and virtualized rendering."
category: "reference"
order: 4
---

# Architecture & Systems Internals

px0 achieves sub-millisecond startup, instantaneous file navigation, ~20 MB resident memory consumption, and safe coding harness dispatch through dedicated systems engineering principles. This document provides a technical walkthrough of its internal architecture.

## High-Level Subsystem Flow

```text
Browser Client (Vanilla JS + CSS)
  ├── DOM Virtualized Row Engine (~60 mounted DOM rows)
  ├── Classic Text & Diff Selection Manager
  ├── Bidirectional Scroll Markdown Viewer
  ├── Agent Composer & Model Discovery Modal
  └── Keyboard Palette & Command Router
            │
            ▼ HTTP / JSON (Pooled Gzip)
Go Server Runtime (Single Static Binary)
  ├── Parallel Index Engine (Bounded concurrency: NumCPU * 4)
  ├── Classification .gitignore Parser
  ├── Bounded Two-Pass Fuzzy Matcher
  ├── Parallel Grep Engine (Buffer reuse)
  ├── Windowed Syntax Lexer (1,000-line chunks + LRU cache)
  ├── Stdio JSON-RPC Language Server (LSP) Client
  ├── Coding Harness Dispatch Runner (agent.go, settings.go)
  └── Active Memory Scavenger (debug.FreeOSMemory after 15s)
```

## Core Architectural Tenets

### 1. Optimized for Reads & Delegated Agent Dispatch
px0 does not attempt to be a heavy code editor with character-by-character typing or save buttons. Code authoring is delegated to external AI coding tools (Claude Code, Gemini CLI, Cursor Agent, Antigravity, OpenCode, Codex, Aider, Goose) or dedicated terminal editors. px0 focuses entirely on the reader experience, automatically reloading whatever files the harness changed.

### 2. Single Static Binary Distribution
The entire web application (HTML, CSS tokens, JavaScript modules, fonts, icons) is embedded directly into the Go binary at compile time using `go:embed`. px0 requires:
- Zero external dependencies
- No Node.js runtime
- No CGO (100% pure Go)
- No local database engine

### 3. File Tree Indexing & Ignore Engine
When px0 boots, it traverses the target directory using bounded goroutines:
- **Concurrency**: Traversals run with worker pools bounded to `runtime.NumCPU() * 4`.
- **Ignore Classification**: Rather than spawning recursive git processes, px0 parses `.gitignore` rules in-memory using an optimized classification matcher. Ignored files remain visible in the file tree (dimmed) but are excluded from search and indexing indexes.
- **Symlink Cycle Immunity**: Traversal tracks inode visit sets to eliminate infinite loops from cyclic symbolic links.

### 4. Bounded Two-Pass Fuzzy Search
Finding files across 100,000+ paths occurs in milliseconds through a two-pass algorithm:
1. **Fast Bitmask Pass**: Quickly filters out candidate paths that do not contain the target characters in sequence ($O(N)$ linear byte scan).
2. **Scoring Pass**: Ranks remaining candidates using an exact dynamic programming matrix rewarding boundary matches (such as path separators and camelCase boundaries).

### 5. Windowed Syntax Highlighting
Traditional web editors tokenize entire 50,000-line files on load, freezing the UI. px0 solves this via windowed lexical chunking:
- Files are parsed and highlighted in **1,000-line chunks** on demand.
- Opening a 400,000-line file requires highlighting only the first viewport chunk.
- Chunks are cached in a byte-budgeted Least Recently Used (LRU) cache.

### 6. DOM Virtualization & Selection Engine
The client mounts only the rows currently visible inside the scroll viewport (approximately 60 DOM elements). As you scroll:
- Top and bottom spacers (`#sizer`) expand to give the scrollbar accurate document height.
- DOM nodes are recycled continuously, maintaining a steady 60 frames per second on any device.
- Classic text selections (mouse and Shift/Ctrl keyboard navigation) synchronize with the virtualized viewport and caret layer.

### 7. Active Memory Scavenging
Many CLI tools retain memory allocations indefinitely after an initial large operation. px0 registers an idle timer:
- After **15 seconds** of inactivity following an index or search pass, px0 triggers `debug.FreeOSMemory()`.
- Unused heap pages are returned directly to the host operating system kernel, dropping resident RSS back to ~20 MB.

### 8. Coding Harness Dispatch & Worktree Snapshotting
When you trigger an edit with `Alt+E` or right-click:
- **Prompt Synthesis**: The server synthesizes a prompt including the workspace root, relative file path, line range `@path:l1-l2`, selected snippet, and user prompt.
- **Overlap Lock**: Disjoint files and non-overlapping line ranges can run concurrently. Conflicting ranges that overlap with an in-flight job are rejected with an HTTP 409 status code.
- **Worktree Snapshotting**: Before launching the harness and after the process exits, px0 records working-tree snapshots (`changedSince`) measuring file sizes, modification timestamps, and git status to discover exactly which files changed.
- **Cache Eviction & Tab Reloading**: Touched files have their Chroma highlight caches cleared (`highlight.Evict`), open LSP documents closed (`lsp.CloseDoc`) to prevent stale buffers, and open tabs reloaded while preserving whether the tab was in source or diff view and retaining diff scroll position.
- **Security Guard (`localPost`)**: Agent dispatch endpoints are protected against cross-origin abuse and DNS rebinding attacks. Requests must originate from px0's own origin and the Host header must resolve to an IP address or localhost. Requests routed through external tunnel or reverse proxy hostnames are strictly refused.
