---
title: "Architecture & Systems Internals"
description: "Technical deep dive into px0's single-binary design, parallel indexing, fuzzy matching, virtualized rendering, and Git/GitHub review architecture."
category: "reference"
order: 4
---

# Architecture & Systems Internals

px0 achieves sub-millisecond startup, instantaneous file navigation, ~20 MB resident memory consumption, safe coding harness dispatch, and real-time Git/GitHub collaboration through dedicated systems engineering principles. This document provides a technical walkthrough of its internal architecture.

## High-Level Subsystem Flow

```text
Browser Client (Vanilla JS + CSS)
  ├── DOM Virtualized Row Engine (~60 mounted DOM rows)
  ├── Classic Text & Diff Selection Manager
  ├── Bidirectional Scroll Markdown Viewer
  ├── Agent Composer & Model Discovery Modal
  ├── Keyboard Palette & Command Router
  ├── PR Review Header Bar & Line Comment Composer (pr.js, linecomment.js)
  ├── Sidebar Git Panel & Per-File Stage Controls (gitpanel.js, tree.js)
  └── Reactive Git Stream Client (gitstream.js, SSE)
            │
            ▼ HTTP / JSON / SSE (Pooled Gzip)
Go Server Runtime (Single Static Binary)
  ├── Parallel Index Engine (Bounded concurrency: NumCPU * 4)
  ├── Classification .gitignore Parser
  ├── Bounded Two-Pass Fuzzy Matcher
  ├── Parallel Grep Engine (Buffer reuse)
  ├── Windowed Syntax Lexer (1,000-line chunks + LRU cache)
  ├── Stdio JSON-RPC Language Server (LSP) Client
  ├── Coding Harness Dispatch Runner (agent.go, settings.go)
  ├── Pure Shell-Out Git Controller (git.go, gitpanel endpoints)
  ├── Git Forge Provider Engine (provider.go, github.go, pr.go)
  ├── Reactive Git Watcher (git_watcher.go, SSE /api/stream)
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

### 3. File Tree Indexing, Ignore Engine & Batch Expansion
When px0 boots, it traverses the target directory using bounded goroutines:
- **Concurrency**: Traversals run with worker pools bounded to `runtime.NumCPU() * 4`.
- **Ignore Classification**: Rather than spawning recursive git processes, px0 parses `.gitignore` rules in-memory using an optimized classification matcher. Ignored files remain visible in the file tree (dimmed) but are excluded from search and indexing indexes.
- **Symlink Cycle Immunity**: Traversal tracks inode visit sets to eliminate infinite loops from cyclic symbolic links.
- **Bounded Batch Expansion**: The explorer sidebar header features Expand All and Collapse All controls. Expand All traverses directories in bounded batches (requesting at most four directories concurrently) and skips ignored folders (like `node_modules` or `target`) to avoid bulk-loading massive generated trees. Any user click, file reveal, or tree switch cleanly cancels pending batch expansions, and expanded paths are saved to the server session.

### 4. Reverse Proxy & Subpath Hosting (`-base-path`)
When hosted behind reverse proxies (Nginx, Traefik, Caddy) or multi-tenant review platforms, px0 supports custom URL prefixes via the `-base-path` CLI flag or `server.basePath` in settings (e.g. `/rev-123/`):
- All HTTP endpoints and static routes are prefixed (`/<base-path>/api/...`, `/<base-path>/static/...`).
- `handleIndex` dynamically injects `<base href="/<base-path>/">` into `web/index.html`, allowing the frontend to resolve relative assets and API endpoints without domain-level assumptions.
- Requests to `/<base-path>` without a trailing slash redirect to `/<base-path>/`, and root `/` redirects to the configured base path.

### 5. Bounded Two-Pass Fuzzy Search
Finding files across 100,000+ paths occurs in milliseconds through a two-pass algorithm:
1. **Fast Bitmask Pass**: Quickly filters out candidate paths that do not contain the target characters in sequence ($O(N)$ linear byte scan).
2. **Scoring Pass**: Ranks remaining candidates using an exact dynamic programming matrix rewarding boundary matches (such as path separators and camelCase boundaries). Original query casing is preserved to award exact uppercase match bonuses.

### 6. Windowed Syntax Highlighting
Traditional web editors tokenize entire 50,000-line files on load, freezing the UI. px0 solves this via windowed lexical chunking:
- Files are parsed and highlighted in **1,000-line chunks** on demand.
- Opening a 400,000-line file requires highlighting only the first viewport chunk.
- Chunks are cached in a byte-budgeted Least Recently Used (LRU) cache.

### 7. DOM Virtualization & Selection Engine
The client mounts only the rows currently visible inside the scroll viewport (approximately 60 DOM elements). As you scroll:
- Top and bottom spacers (`#sizer`) expand to give the scrollbar accurate document height.
- DOM nodes are recycled continuously, maintaining a steady 60 frames per second on any device.
- Classic text selections (mouse and Shift/Ctrl keyboard navigation) synchronize with the virtualized viewport and caret layer.
- Because only ~60 rows are active at any time, the browser tab's RAM stays bounded at ~80-150 MB, preventing memory creep on 500,000-line files.

### 8. Active Memory Scavenging & Client-Server Memory Split
Many CLI tools retain memory allocations indefinitely after an initial large operation. px0 pairs a low-footprint Go backend with an active idle scavenger:
- **Automatic Scavenger**: After **15 seconds** of inactivity following an index or search pass, px0 triggers `debug.FreeOSMemory()`. Unused heap pages are returned directly to the host operating system kernel, dropping resident RSS back to ~20-30 MB.
- **Host Server Footprint**: The Go backend daemon occupies strictly ~20-30 MB RSS, handling indexing, symbol discovery, regex search, and git operations.
- **Client Browser Tab**: The frontend web client runs in the user's existing browser, allocating ~80-150 MB for the DOM, V8 runtime, and GPU compositing.
- **Combined Impact**: Total local system footprint is ~100-180 MB (~85-90% lower than the ~1,400 MB footprint of desktop Electron IDEs).
- **Remote Devbox Benefit**: On remote cloud VMs, Kubernetes pods, and containers (`px0 -host 0.0.0.0`), the remote host pays strictly the ~20-30 MB server cost while UI rendering runs on the client machine.

### 9. Coding Harness Dispatch & Worktree Snapshotting
When you trigger an edit with `Alt+E` or right-click:
- **Prompt Synthesis**: The server synthesizes a prompt including the workspace root, relative file path, line range `@path:l1-l2`, selected snippet, and user prompt.
- **Overlap Lock**: Disjoint files and non-overlapping line ranges can run concurrently. Conflicting ranges that overlap with an in-flight job are rejected with an HTTP 409 status code.
- **Worktree Snapshotting**: Before launching the harness and after the process exits, px0 records working-tree snapshots (`changedSince`) measuring file sizes, modification timestamps, and git status to discover exactly which files changed.
- **Cache Eviction & Tab Reloading**: Touched files have their Chroma highlight caches cleared (`highlight.Evict`), open LSP documents closed (`lsp.CloseDoc`) to prevent stale buffers, and open tabs reloaded while preserving whether the tab was in source or diff view and retaining diff scroll position.
- **Security Guard (`localPost`)**: Agent dispatch endpoints are protected against cross-origin abuse and DNS rebinding attacks. Requests must originate from px0's own origin and the Host header must resolve to an IP address or localhost. Requests routed through external tunnel or reverse proxy hostnames are strictly refused.

### 9. Reactive Git Streaming & Adaptive Monitoring Engine
In modern coding workflows, AI agents edit code and developers execute terminal commands. px0 synchronizes file explorer badges, directory dirty dots, diff gutter markers, and full diff views in real time using a zero-overhead reactive engine (`git_watcher.go`, `web/src/gitstream.js`).

#### Pure Shell-Out Architecture
px0 avoids heavy third-party git libraries (such as `go-git` or CGO-based bindings) that parse raw packfiles into memory. Instead, px0 shells out directly to the host `git` binary using machine-readable porcelain formats (`git status --porcelain=v2 -z`). All status codes are stored as byte flags directly on `Node.Status` in volatile memory with zero disk footprint.

#### How Git Detects Changes Under the Hood
Git maintains a binary cache in `.git/index` containing metadata for every tracked file: `mtime`, `ctime`, file size, `inode`, `mode`, and the committed blob SHA. When checking status, Git issues lightweight `lstat()` system calls to compare filesystem metadata against the `.git/index` cache. If the metadata matches, Git guarantees the file is untouched without reading or hashing its contents.

Furthermore, any terminal Git operation (`git checkout`, `git reset`, `git add`, `git commit`, `git restore`, `git stash`) updates `.git/index` via an atomic rename (`rename(".git/index.lock", ".git/index")`), modifying the `mtime` and `ctime` of `.git/index` and updating `.git/HEAD` or `.git/packed-refs`.

#### Dual-Layer Hybrid Architecture
Rather than watching thousands of directory descriptors with `inotify` (which exhausts OS watch limits on repositories like the Linux kernel) or polling `git status` at a high fixed frequency (which drains CPU and battery), px0 employs a dual-layer strategy:

1. **Sub-Millisecond Metadata Fast Path**: A 1-second ticker checks `os.Stat` on `.git/index`, `.git/HEAD`, and `.git/packed-refs`. When any Git CLI command runs in the terminal, px0 detects the changed control file metadata within milliseconds and triggers an immediate status check without waiting for the next polling cycle.
2. **Adaptive Worktree Polling**: To detect external modifications made outside the Git CLI, px0 executes an adaptive worktree check. The polling interval dynamically self-tunes based on execution duration:
   $$\text{interval} = \max(2\,\text{s}, \min(15\,\text{s}, \text{execution\_time} \times 10))$$
   On small projects (~6 ms execution), updates occur every 2 seconds. On massive repositories (~1 s execution), polling relaxes to 10-15 seconds, keeping CPU usage bounded under 10% of a single core.

#### Visibility and Power Gating
When the browser tab is hidden (`document.visibilityState === 'hidden'`), the client disconnects the Server-Sent Events stream. The backend detects that active subscribers dropped to zero and completely suspends background worktree polling, eliminating idle CPU consumption. When the user refocuses the browser window, px0 immediately reconnects and queries `/api/git/refresh`.

#### In-Place DOM Tree Patching & Tab Reconciliation
When `UpdateGitStatus` runs:
1. It executes `git status` concurrently without re-walking directories on disk.
2. If the resulting status map is identical to `ix.gitStatusMap`, it exits with zero memory allocations or broadcasts. Status refreshes are throttled with a cooldown window and deduplication to prevent CPU waste during burst filesystem writes.
3. When changes occur, it updates `Node.Status` and `Node.Dirty` in place on the in-memory tree nodes and streams an SSE event payload (`event: git-status`) to connected clients.
4. The frontend (`gitstream.js`) invokes `patchTreeGitStatus(statuses, dirtyDirs)` to toggle CSS classes and badge nodes directly in the DOM without collapsing expanded tree branches or resetting scroll position.
5. Tab reloads apply an `onlyIfChanged` check, preventing background git status syncs from repainting untouched open tabs or causing editor flicker.
6. Diff tabs for files whose changes were checked out or reset in the CLI are closed automatically in reverse index order, keeping the active tab index stable.

### 11. Git Panel, AI Commit Generation & Pure Shell-Out Write Engine
While the status and diffing engine is purely read-only, the sidebar Git panel introduces explicit repository write actions. Adhering to px0's zero-dependency philosophy, every write operation shells out directly to the host `git` executable:

- **Explicit Invocations Only**: Staging, committing, pushing, and pulling never trigger on background timers or file events. Each executes exactly once in response to an explicit user interaction.
- **Collapsible Monospace Input & Standalone AI Generation**: The commit message textarea is hidden by default to keep the panel compact, expanding on toggle or when generating a message. Clicking **Generate** runs standalone AI generation so reviewers can inspect, edit, and verify the message before committing. If a commit fails, the generated message stays visible in the textarea to prevent data loss.
- **Refined AI Commit Prompt**: When generating commit messages via `agentManager.StartPrompt`, px0 passes the list of staged file paths (`gitStagedFiles`), diffstat summary (`gitStagedStat`), and the staged diff (`gitStagedDiff`). Staged diffs are capped at 32 KB and exclude lockfiles and generated assets to ensure quick and focused commit synthesis.
- **Staged-Path Tracking**: The server tracks staged status alongside working-tree status by executing `git diff --name-only --cached -z`. This state is mapped into `Index.gitStagedMap` and `Node.Staged`. When staging state changes, `UpdateGitStatus` detects the delta and broadcasts the updated `Staged` map and `Branch` name across the SSE stream (`/api/stream`).
- **Fast-Forward-Only Pull Enforcement**: The pull endpoint executes `git merge --ff-only FETCH_HEAD`. If a branch cannot be cleanly fast-forwarded (such as diverged history or uncommitted local changes), px0 returns sentinel `errNotFastForward` (HTTP 409) rather than creating conflict markers on disk.
- **Targeted Push Routing**: For local workspaces, px0 pushes to the tracked upstream or sets it on initial push. In PR review sessions, it routes pushes directly to the pull request's true head clone URL and branch ref.
- **Security Isolation**: All Git write endpoints (`/api/git/stage`, `/api/git/unstage`, `/api/git/commit`, `/api/git/push`, `/api/git/pull`, `/api/git/commit-message`) are strictly protected by `localPost` checks, rejecting requests originating from non-local or cross-site contexts.

### 12. Git Forge PR Review & Provider Architecture
px0 provides native pull request review capabilities through a decoupled provider abstraction and process-scoped checkout architecture:

#### The `GitProvider` Abstraction Layer
To support multiple forge systems without entangling core viewer logic, forge operations are defined by the `GitProvider` interface in `provider.go`:
```go
type GitProvider interface {
    Name() string
    MatchURL(rawURL string) bool
    ParseURL(rawURL string) (PRTarget, error)
    ResolveToken(cfg settings) (token, source string)
    FetchPR(ctx context.Context, target PRTarget, token string) (PRMeta, error)
    CheckPushAccess(ctx context.Context, target PRTarget, token string) bool
    SubmitReview(ctx context.Context, target PRTarget, token, headSHA string, comments []prComment, event, body string) error
}
```

`GitHubProvider` implements this interface using Go standard library `net/http` to communicate with the GitHub REST API, without external vendor SDKs.

#### Unconditional Merged PR Checkout
When opening an already-merged pull request, px0 does not block behind interactive terminal confirmation prompts. It proceeds immediately to check out the tree and badges the review session with a `[merged]` CLI indicator and a purple `Merged` pill in the browser review header.

#### Isolated Reviewer Diffs
When reviewers edit files locally or apply AI fixes during a PR review:
- The diff viewer separates frozen PR changes from local reviewer edits using collapsible sections.
- Reviewer-modified files receive a prominent **YOU** badge in the sidebar tree, and parent directory dirty dots reflect local reviewer edits.
- Staging checkboxes are hidden for original PR files and displayed only for files touched by the reviewer.
- Local reviewer diff sections are marked non-reviewable so inline comment drafts target original pull request commits rather than personal scratch modifications.

#### Process-Scoped Ephemeral Worktrees
Pull request checkouts are strictly ephemeral:
1. `checkoutPR` creates a dedicated temporary directory (`os.MkdirTemp("", "px0-pr-*")`).
2. If the user runs px0 inside a local clone of the same repository, it creates a lightweight git worktree (`git worktree add --detach <tmp> refs/px0/pr/<N>`).
3. For remote repositories or external forks, it performs a blobless clone (`git clone --filter=blob:none --branch <headRef> <tmp>`).
4. When px0 shuts down (`Ctrl+C` or exit), `prSession.Close` removes the temporary directory and deletes temporary references, leaving zero disk clutter.

#### Scoped Merge-Base Diffing
Unlike local workspaces that diff against `HEAD`, PR review mode computes the merge-base between the PR head commit and the base branch:
```go
diffBase := gitMergeBase(tmp, "HEAD", baseRef)
```
Both editor gutter indicators and the `Cmd/Ctrl+D` diff viewer display only changes introduced by the pull request relative to the target branch.

#### In-Memory Thread-Safe Draft Comments & Read-Only Nudges
Draft review comments are stored in server memory (`prSession.comments`) guarded by a `sync.Mutex`. Reviewers can add, view, and delete comments without disk writes or remote API calls. Comment drafting controls stay enabled in read-only sessions (without a configured token), presenting a helpful prompt to connect credentials only when submitting formal reviews. When ready, comments can be:
- Batch-applied locally across the worktree by delegating all comments to an AI coding harness (`Batch Apply`).
- Formally submitted to the GitHub REST API in a single atomic review payload (`provider.SubmitReview`).

#### In-Session Git Panel Synchronization
In PR review sessions, the sidebar Git panel allows reviewers to commit and push changes back to the PR's true branch:
- `prSession.Push` executes `git -C worktree push <meta.HeadRepoCloneURL> HEAD:refs/heads/<meta.HeadRef>`, pushing cleanly to the PR's actual repository (including user forks).
- `prSession.Pull` re-fetches the remote PR head, safely fast-forwards the worktree, re-calculates `diffBase`, re-indexes the workspace, and updates the PR review header bar and comments panel in place.

### 13. Server-Side Session Persistence & Frontend Event Bus
px0 coordinates frontend subsystems and persistent workspace state through dedicated modules:

- **Server-Side Session API (`/api/session`)**: Workspace state (including open file tabs, active tab selection, and expanded directory paths in the tree) is persisted on the backend via `/api/session`. This ensures workspace layout survives browser restarts and works reliably across different devices and private windows without relying strictly on browser `localStorage`.
- **Decoupled Event Bus (`bus.js`)**: A lightweight event bus coordinates tab lifecycle transitions (`file:open`, `tab:switch`, `tab:close`). Subsystems such as Markdown Preview, Image Viewer, Selection Bar, and PR Review subscribe to these events to synchronize status and view modes cleanly without circular dependencies.
- **Static Type Checking**: Frontend modules are annotated with structured JSDoc types and checked via `tsconfig.json` (`checkJs: true`) to ensure type safety across browser code.
