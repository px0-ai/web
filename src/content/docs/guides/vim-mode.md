---
title: "Vim Keybindings & Modal Navigation"
description: "Navigate codebases from the home row with Vim normal, visual, and motion modes, status bar indicators, and direct agent selection bridging."
category: "guides"
order: 11
---

# Vim Keybindings & Modal Navigation

For developers accustomed to Vim, Neovim, or Helix, modal navigation is second nature. Reaching for a mouse or repeatedly tapping arrow keys disrupts cognitive focus when auditing code, tracing call chains, or inspecting pull requests.

px0 includes an optional Vim modal navigation system. Because px0 focuses on ultra-fast code reading and reviewing, its modal mode focuses on navigation, scrolling, line jumping, and text selection. When text is highlighted in Visual mode, the selection bridges immediately into px0's context actions: press `Alt+C` to copy a reference, `Alt+A` to copy context for an LLM prompt, or `Alt+E` to dispatch an edit to your coding agent.

---

## Enabling Vim Mode

You can enable Vim mode in Settings:

1. Press `Cmd+,` (macOS) or `Ctrl+,` (Linux/Windows) to open Settings.
2. Search for **Editor: Vim Mode** (`editor.vimMode`).
3. Click the `[true]` pill button to activate it immediately without reloading.

Alternatively, add `"editor.vimMode": true` to your `~/.px0/settings.json` file:

```json
{
  "editor.vimMode": true
}
```

---

## Status Bar Mode Indicators

When Vim mode is active, the left side of the bottom status bar renders a visual mode indicator badge:
- `-- NORMAL --`
- `-- VISUAL --`
- `-- VISUAL LINE --`

This provides continuous confirmation of your active modal state.

---

## Supported Modes & Keybindings

### 1. Normal Mode (Navigation)
Active by default when Vim mode is enabled.

#### Directional Navigation
- `h`: Move cursor left
- `j`: Move cursor down
- `k`: Move cursor up
- `l`: Move cursor right

#### Word Motions
- `w`: Move forward to the start of the next word
- `b`: Move backward to the start of the previous word
- `e`: Move forward to the end of the current word

#### Line Boundaries
- `0`: Jump to the absolute beginning of the line
- `^`: Jump to the first non-whitespace character
- `$`: Jump to the end of the line

#### Document Jumps
- `gg`: Jump to the top of the file (line 1)
- `G`: Jump to the bottom of the file
- `[count]G` or `:[count]`: Jump directly to line number `[count]`

#### Scrolling
- `Ctrl+u`: Scroll half page up
- `Ctrl+d`: Scroll half page down
- `Ctrl+b`: Scroll full page up
- `Ctrl+f`: Scroll full page down

#### In-File Search
- `/`: Initiate in-file search
- `n`: Advance to the next search match
- `N`: Step backward to the previous search match

---

### 2. Visual Mode (Selection & Agent Actions)

- Press **`v`** to enter character-wise Visual mode.
- Press **`V`** to enter line-wise Visual mode.
- Move the caret using any motion (`j`, `k`, `w`, `$`, etc.) to expand or contract the selection range.
- Press **`Escape`** to clear the selection and return to Normal mode.

#### Bridging Visual Selection into Actions
While code is selected in Visual mode:
- `y`: Yank (copy) selected text to the system clipboard
- `Alt+C`: Copy standardized reference pointer (`@path:l1-l2`)
- `Alt+A`: Copy code snippet formatted with `@path:l1-l2` context header for AI chat prompts
- `Alt+E`: Open the inline coding agent composer on the selected range

---

## Summary of Keybindings

| Mode | Key / Chord | Action |
| :--- | :--- | :--- |
| Normal | `h`, `j`, `k`, `l` | Left, Down, Up, Right cursor motion |
| Normal | `w`, `b`, `e` | Next word, previous word, end of word |
| Normal | `0`, `^`, `$` | Beginning of line, first non-blank, end of line |
| Normal | `gg`, `G` | Top of file, bottom of file |
| Normal | `:[line]` or `[line]G` | Jump directly to specified line number |
| Normal | `Ctrl+u`, `Ctrl+d` | Scroll half page up / down |
| Normal | `Ctrl+b`, `Ctrl+f` | Scroll full page up / down |
| Normal | `/` | Open in-file search bar |
| Normal | `n`, `N` | Next match, previous match |
| Normal | `v` | Enter character-wise Visual mode |
| Normal | `V` | Enter line-wise Visual mode |
| Visual | Motions (`h/j/k/l`, etc.) | Adjust selection bounds |
| Visual | `y` | Yank selection to clipboard |
| Visual | `Alt+C` | Copy `@path:l1-l2` reference |
| Visual | `Alt+A` | Copy snippet with context for LLM |
| Visual | `Alt+E` | Dispatch selection to coding agent |
| Visual | `Escape` | Cancel selection and return to Normal mode |
