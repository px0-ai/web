---
title: "Keyboard Shortcuts Reference"
description: "Complete cheat sheet of all keyboard shortcuts and navigation hotkeys available in px0."
category: "reference"
order: 1
---

# Keyboard Shortcuts Reference

px0 is fully controllable via the keyboard. On macOS, use `Cmd` and `Option`. On Linux and Windows, use `Ctrl` and `Alt`.

You can also press `?` anywhere inside px0 to open the in-app shortcut cheat sheet.

## File & Workspace Navigation

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Cmd+P` | `Ctrl+P` | **Go to file**: Fast fuzzy file finder across workspace |
| `Cmd+K` | `Ctrl+K` | **Universal palette**: Quick open files, symbols, and actions |
| `Cmd+Shift+P` | `Ctrl+Shift+P` | **Command palette**: Access all editor and view commands |
| `Cmd+Shift+O` | `Ctrl+Shift+O` | **Go to symbol**: Symbol outline in current active file |
| `Cmd+Shift+F` | `Ctrl+Shift+F` | **Workspace search**: Full-text regex search across all files |
| `Cmd+Shift+R` | `Ctrl+Shift+R` | **Refresh workspace**: Live reindex of workspace tree and Git status |
| `Cmd+,` | `Ctrl+,` | **Open settings**: Open visual Settings UI and raw JSON configurator |
| `Cmd+F` | `Ctrl+F` | **Find in file**: In-file search seeded with current selection |
| `Cmd+G` | `Ctrl+G` | **Jump to line**: Enter line number to jump directly |
| `Cmd+B` | `Ctrl+B` | **Toggle sidebar**: Show or hide the left explorer sidebar |

## Code Intelligence & Language Server (LSP)

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `F12` or `Cmd+Click` | `F12` or `Ctrl+Click` | **Go to definition**: Jump to function, struct, or variable source |
| `Shift+F12` | `Shift+F12` | **Find all references**: Open workspace usages in Right Inspector |
| `Option+Shift+H` | `Alt+Shift+H` | **Call trail**: Open callers and callees hierarchy tree |
| `Hover` | `Hover` | **Type hover**: Inspect type signature and documentation tooltip |
| `Cmd+Hover` | `Ctrl+Hover` | **Inspect link**: Preview clickable identifier target |
| `Option+Left` | `Alt+Left` | **Navigate back**: Jump back to previous cursor position / file |
| `Option+Right` | `Alt+Right` | **Navigate forward**: Jump forward along the navigation trail |

## Git Review, GitHub PR & Everyday Operations

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Cmd+D` | `Ctrl+D` | **Toggle Git diff**: Toggle split or unified diff against `HEAD` (or merge-base in PR review) |
| `Option+R` | `Alt+R` | **Review comment**: Draft PR review comment on active selection |
| `Line Hover (✏)` | `Line Hover (✏)` | **Line action popover**: Choose between GitHub comment or inline agent edit |
| `Cmd+K` -> `Git: Open Pull Request...` | `Ctrl+K` -> `Git: Open Pull Request...` | **Open PR**: Launch a fresh pull request review tab |
| `Option+M` | `Alt+M` | **Toggle Markdown preview**: Switch between raw source and rendered GFM |

## Tabs & Editor Viewport

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Cmd+W` or `Option+W` | `Ctrl+W` or `Alt+W` | **Close tab**: Close the active editor tab |
| `Cmd+Shift+T` | `Ctrl+Shift+T` | **Reopen closed tab**: Restore the last closed editor tab |
| `Ctrl+Tab` | `Ctrl+Tab` | **Switch tab**: Cycle to the next open tab |
| `Option+1` ... `Option+9` | `Alt+1` ... `Alt+9` | **Select tab**: Select tab by its numeric position |
| `Option+Z` | `Alt+Z` | **Toggle word wrap**: Toggle visual soft-wrapping on or off |
| `Cmd+Up` / `Cmd+Down` | `Ctrl+Home` / `Ctrl+End` | **Top / Bottom**: Jump caret directly to first or last line |

## Selection & Agent Actions

When code is selected in the editor or diff view, the footer selection bar and context menu provide instant actions:

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Option+E` | `Alt+E` | **Edit Inline**: Open compose box to dispatch selected range to coding harness |
| `Cmd+Enter` | `Ctrl+Enter` | **Apply all comments**: Dispatch all staged inline comments as a single batch edit |
| `Right-click` | `Right-click` | **Selection actions menu**: Edit Inline, Copy Ref, Copy with Context, Find Usages |
| `Shift+Arrows` | `Shift+Arrows` | **Expand selection**: Classic text selection across characters and lines |
| `Shift+Option+Arrows` | `Shift+Ctrl+Arrows` | **Word selection**: Expand selection by word boundaries |
| `Option+C` | `Alt+C` | **Copy reference**: Copy standardized `@path:l1-l2` reference (Copy Ref) |
| `Option+A` | `Alt+A` | **Copy with context**: Copy snippet formatted with `@path:l1-l2` header for prompt composition |
| `Option+U` | `Alt+U` | **Find usages**: Search workspace for the selected identifier |
| `Escape` | `Escape` | **Cancel / Dismiss**: Dismiss composer, selection bar, lightbox, or open overlay |
| `?` | `?` | **Help sheet**: Display in-app shortcut modal overlay |

## Image Viewer & Asset Inspection

When an image file tab is active:

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `+` or `=` | `+` or `=` | **Zoom In**: Multiplies current scale by 1.25x (up to 3200%) |
| `-` or `_` | `-` or `_` | **Zoom Out**: Divides current scale by 1.25x (down to 5%) |
| `0` | `0` | **Fit to window**: Scales image to fit viewport bounds |
| `1` | `1` | **Actual size**: Resets scale to 100% (1:1 native resolution) |
| `b` or `B` | `b` or `B` | **Cycle background**: Switch contrast between Checkerboard, Dark, and Light |
| `p` or `P` | `p` or `P` | **Toggle mode**: Switch between Smooth and Pixelated interpolation |
| `Arrow keys` | `Arrow keys` | **Pan canvas**: Pan viewport by 40 px in corresponding direction |
| `Mouse Drag` | `Mouse Drag` | **Pan canvas**: Freeform grab-and-pan anywhere on the viewport |
| `Mouse Wheel` | `Mouse Wheel` | **Interactive zoom**: Smoothly zoom in and out |

## Vim Mode (Modal Navigation)

When `editor.vimMode` is enabled in Settings:

| Key | Mode | Action |
| :--- | :--- | :--- |
| `h`, `j`, `k`, `l` | Normal | Directional motions: Left, Down, Up, Right |
| `w`, `b`, `e` | Normal | Word motions: Next word, previous word, end of word |
| `0`, `^`, `$` | Normal | Line motions: Beginning of line, first non-blank character, end of line |
| `gg`, `G` | Normal | Document jumps: Top of file, bottom of file |
| `:[line]` or `[line]G` | Normal | Line jump: Navigate directly to specified line number |
| `Ctrl+u`, `Ctrl+d` | Normal | Half-page scrolling: Scroll half page up / down |
| `Ctrl+b`, `Ctrl+f` | Normal | Full-page scrolling: Scroll full page up / down |
| `/` | Normal | Search: Open in-file search bar |
| `n`, `N` | Normal | Next match, previous match |
| `v` | Normal | Enter character-wise Visual mode |
| `V` | Normal | Enter line-wise Visual mode |
| `y` | Visual | Yank: Copy selected text to clipboard |
| `Alt+C` / `Option+C` | Visual | Copy `@path:l1-l2` reference pointer |
| `Alt+A` / `Option+A` | Visual | Copy snippet formatted with context for LLM |
| `Alt+E` / `Option+E` | Visual | Dispatch selected range to coding agent |
| `Escape` | Visual | Cancel selection and return to Normal mode |


