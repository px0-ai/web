---
title: "Markdown Preview & Documentation Reading"
description: "Render rich GitHub-Flavored Markdown previews with syntax-highlighted code fences and bi-directional scroll synchronization."
category: "guides"
order: 8
---

# Markdown Preview & Documentation Reading

px0 provides a built-in markdown preview engine powered by Goldmark and client-side security sanitization. It allows you to read technical documentation, design specs, and README files with rich typography without leaving your code viewer.

## Toggling Preview Mode (`Alt+M`)

When any markdown file (`.md`, `.markdown`, `.mdx`) is open in an editor tab, you can toggle between source code and rendered preview at any time:

```text
Alt+M
```

You can also click the **Preview / Source button** in the top right of the editor tab header.

![px0 Markdown Preview Mode](/images/docs/markdown-preview-ui.jpg)

## Key Capabilities

### 1. Synchronized Bi-Directional Scroll
When toggling between Markdown Source and Preview using `Alt+M`, px0 automatically preserves your vertical position using source line anchors (`data-line`). Switching back and forth keeps the exact paragraph or code block centered in your viewport.

### 2. Native Syntax-Highlighted Code Fences
Code fences within Markdown documents are tokenized and rendered using px0's syntax engine (Chroma), matching the color palette of your active theme.

### 3. Local Link & Image Resolution
- **Relative Links**: Clicking a relative link (such as `./docs/architecture.md`) automatically opens the target file in a new tab within px0.
- **Embedded Images**: Local relative image paths are resolved and served directly by the embedded web server.

### 4. DOM Security Allowlist
To protect users from malicious documentation or cross-site scripting attacks when viewing untrusted repositories, px0 processes all rendered HTML through an allowlist sanitizer before injecting it into the DOM. Dangerous tags, external scripts, and iframe injections are stripped away.
