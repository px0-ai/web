---
title: "CLI Flags & Parameters"
description: "Comprehensive reference of all runtime flags, arguments, and environment variables supported by px0."
category: "reference"
order: 3
---

# CLI Flags & Parameters

This reference covers the complete list of startup arguments and command options supported by the `px0` executable.

## Command Syntax

```bash
px0 [flags] [file, directory, or pull request URL]
```

If the argument is omitted, px0 opens the current working directory (`.`). You can pass a folder to browse an entire codebase, a single file to jump directly into it, or a GitHub pull request URL to enter review mode.

## Complete Flags Reference

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `-port <int>` | integer | `7777` | Port to listen on. Passing `0` automatically picks a random free port. |
| `-host <string>` | string | `127.0.0.1` | Network interface address to bind. Use `0.0.0.0` to expose px0 over local networks, Docker containers, or remote cloud VMs. |
| `-base-path <path>` | string | `"/"` | Base URL path prefix to serve endpoints and assets from (e.g. `/rev-123/`). Also configurable in settings via `server.basePath`. |
| `-y, -yes` | boolean | `false` | Legacy bypass flag (merged PRs now open automatically without confirmation). |
| `-no-open` | boolean | `false` | Do not launch the default web browser automatically on startup. Useful for background execution or remote sessions. |
| `-no-lsp` | boolean | `false` | Do not use language servers (such as `gopls`, `rust-analyzer`, or `clangd`), even if installed on `$PATH`. Falls back to the built-in regex outline and search. |
| `-no-git` | boolean | `false` | Disable git repository awareness, branch detection, status badges, and diff overlays. |
| `-agent <harness>` | string | `none` | Pin coding harness for in-app agent edits: `claude`, `gemini`, `cursor-agent`, `agy`, `opencode`, `codex`, `aider`, `goose`, or a custom command template containing `{prompt}`. |
| `-no-agent` | boolean | `false` | Disable coding harness discovery and edit capabilities entirely. |
| `-no-color` | boolean | `false` | Disable ANSI color codes in terminal startup output. |
| `-quiet` | boolean | `false` | Suppress informational startup narration in the terminal. |
| `-verbose` | boolean | `false` | Enable verbose logging including request timing, prompt payloads, and agent job IDs. |
| `-update` | boolean | `false` | Check for, download, and install the latest available release of px0 directly into user space. |
| `-v, -version` | boolean | `false` | Print px0 version and exit. |

## Examples

### Reviewing a GitHub Pull Request Directly
```bash
# Open a GitHub pull request with merge-base diffs and live commenting
px0 https://github.com/owner/repo/pull/123
```

### Reverse Proxy & Subpath Hosting
```bash
# Host behind a reverse proxy or PR review pod with a custom URL path prefix
px0 -base-path /rev-123/ -host 0.0.0.0 -port 7777 /path/to/project
```

### Ephemeral Port and Headless Mode (Remote / Agent Workflow)
```bash
px0 -port 0 -no-open /path/to/project
```

### Pinning an Agent Harness for the Session
```bash
# Pin Claude Code
px0 -agent claude /path/to/project

# Or pin Gemini CLI
px0 -agent gemini /path/to/project

# Or use a custom command template
px0 -agent 'my-agent --prompt {prompt}' /path/to/project
```

### Disabling Agent Dispatch
```bash
px0 -no-agent /path/to/project
```

### Exposing Across Local Network or Cloud VM
```bash
px0 -host 0.0.0.0 -port 7777 -no-open /path/to/project
```

### Self-Update to Latest Release
```bash
px0 -update
```
