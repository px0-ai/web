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

## Git Review & Diffs

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Cmd+D` | `Ctrl+D` | **Toggle Git diff**: Toggle split or unified diff against `HEAD` |
| `Option+M` | `Alt+M` | **Toggle Markdown preview**: Switch between raw source and rendered GFM |

## Tabs & Editor Viewport

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Cmd+W` or `Option+W` | `Ctrl+W` or `Alt+W` | **Close tab**: Close the active editor tab |
| `Cmd+Shift+T` | `Ctrl+Shift+T` | **Reopen closed tab**: Restore the last closed editor tab |
| `Ctrl+Tab` | `Ctrl+Tab` | **Switch tab**: Cycle to the next open tab |
| `Option+1` ... `Option+9` | `Alt+1` ... `Alt+9` | **Select tab**: Select tab by its numeric position |
| `Option+Z` | `Alt+Z` | **Toggle word wrap**: Toggle visual soft-wrapping on or off |
| `Option+L` | `Alt+L` | **Toggle line numbers**: Show or hide editor line number gutter |
| `Cmd+Up` / `Cmd+Down` | `Ctrl+Home` / `Ctrl+End` | **Top / Bottom**: Jump caret directly to first or last line |

## Selection & Agent Actions

When code is selected in the editor, the status bar displays helper actions:

| macOS | Linux / Windows | Action |
| :--- | :--- | :--- |
| `Option+C` | `Alt+C` | **Copy reference**: Copy formatted `path:line` citation |
| `Option+A` | `Alt+A` | **Copy for agent**: Copy snippet formatted with filepath header for AI prompts |
| `Option+U` | `Alt+U` | **Find usages**: Search workspace for the selected identifier |
| `?` | `?` | **Help sheet**: Display in-app shortcut modal overlay |
