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
px0 [flags] [file or directory]
```

If `[file or directory]` is omitted, px0 opens the current working directory (`.`). You can pass either a folder to browse an entire codebase or a single file to jump directly into it.

## Complete Flags Reference

| Flag | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `-port <int>` | integer | `7777` | Port to listen on. Passing `0` automatically picks a random free port. |
| `-host <string>` | string | `127.0.0.1` | Network interface address to bind. Use `0.0.0.0` to expose px0 over local networks, Docker containers, or remote cloud VMs. |
| `-no-open` | boolean | `false` | Do not launch the default web browser automatically on startup. Useful for background execution or remote sessions. |
| `-no-lsp` | boolean | `false` | Do not use language servers (such as `gopls`, `rust-analyzer`, or `clangd`), even if installed on `$PATH`. Falls back to the built-in regex outline and search. |
| `-no-git` | boolean | `false` | Disable git repository awareness, branch detection, status badges, and diff overlays. |
| `-agent <harness>` | string | `none` | Pin coding harness for in-app agent edits: `claude`, `gemini`, `cursor-agent`, `agy`, `opencode`, `codex`, `aider`, `goose`, or a custom command template containing `{prompt}`. |
| `-no-agent` | boolean | `false` | Disable coding harness discovery and edit capabilities entirely. |
| `-no-color` | boolean | `false` | Disable ANSI color codes in terminal startup output. |
| `-no-telemetry` | boolean | `false` | Disable anonymous usage telemetry reporting. |
| `-quiet` | boolean | `false` | Suppress informational startup narration in the terminal. |
| `-verbose` | boolean | `false` | Enable verbose logging including request timing, prompt payloads, and agent job IDs. |
| `-update` | boolean | `false` | Check for, download, and install the latest available release of px0 directly into user space. |
| `-v, -version` | boolean | `false` | Print px0 version and exit. |

## Examples

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
