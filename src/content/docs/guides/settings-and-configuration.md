---
title: "Settings & Configuration System"
description: "Customize editor ergonomics, typography, diff layouts, themes, and agent parameters with a VS Code-style visual settings manager and synchronized raw JSON editing."
category: "guides"
order: 10
---

# Settings & Configuration System

Developer preferences for typography, spacing, diff orientations, and cursor behaviors vary widely. However, managing configuration files manually in text editors or juggling fragmented dotfile directories can be tedious. Furthermore, storing editor settings inside project folders risks committing personal workstation preferences into team repositories.

px0 includes a built-in visual Settings manager modeled after VS Code. It provides a dual-mode experience: an intuitive graphical form editor with interactive attribute pills alongside a synchronized raw JSON editor. Configuration is stored globally in your user directory (`~/.px0/settings.json`), keeping all repository working trees completely clean.

---

## Opening the Settings Manager

You can open Settings using any of the following methods:

- **Keyboard Shortcut**: Press `Cmd+,` (macOS) or `Ctrl+,` (Linux/Windows).
- **Status Bar**: Click the gear icon (`⚙️`) in the bottom-right corner of the window.
- **Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)**:
  - `Preferences: Open Settings (UI)`
  - `Preferences: Open Settings (JSON)`

---

## Key Capabilities

### 1. Dual UI & Raw JSON Modes
Switch instantly between the graphical form editor and raw JSON mode with a single click. Changes made in the UI update the JSON document in real time, and direct edits in JSON immediately reflect back in the UI form.

### 2. Interactive Attribute Pills
Every setting displays metadata badges (category, type, default value) along with interactive pill buttons for immediate selection:
- Cursor styles: `[line]`, `[block]`, `[underline]`
- Boolean toggles: `[true]`, `[false]`
- Tab sizes: `[2]`, `[4]`, `[8]`

Clicking any pill applies that value immediately without typing.

### 3. Instant Live Preview Without Reloads
Adjusting font sizes, line heights, themes, cursor animations, or diff modes takes effect immediately across all open tabs. You do not need to refresh the page or restart px0.

### 4. One-Click Factory Reset
Whenever a setting is modified from its default, px0 displays an amber `Modified` badge and an inline `Reset` button. Click `Reset` to revert that specific property back to its factory default instantly.

### 5. Pristine Repositories
All configuration is saved to:
- `~/.px0/settings.json`
- Or `$XDG_CONFIG_HOME/px0/settings.json` (if the environment variable is set).

Your git status, commits, and repository files remain completely untouched.

---

## Key Configurable Properties

| Setting Key | Category | Default | Allowed Values / Range | Description |
| :--- | :--- | :--- | :--- | :--- |
| `editor.fontSize` | Text Editor | `13.5` | `9.0` to `32.0` (px) | Font size in the code viewport |
| `editor.fontFamily` | Text Editor | JetBrains Mono stack | CSS font stack string | Font family for code rendering |
| `editor.lineHeight` | Text Editor | `21.0` | `14.0` to `48.0` (px) | Line height for viewport rows |
| `editor.tabSize` | Text Editor | `4` | `2`, `4`, `8` | Number of spaces per indentation tab |
| `editor.wordWrap` | Text Editor | `"on"` | `"on"`, `"off"` | Soft line wrapping at editor boundary |
| `editor.lineNumbers` | Text Editor | `"on"` | `"on"`, `"off"` | Line numbers display in gutter |
| `editor.cursorStyle` | Text Editor | `"line"` | `"line"`, `"block"`, `"underline"` | Cursor rendering style |
| `editor.cursorBlinking` | Text Editor | `"smooth"` | `"blink"`, `"smooth"`, `"solid"` | Cursor blinking animation style |
| `editor.renderLineHighlight` | Text Editor | `"line"` | `"line"`, `"none"` | Active line highlight style |
| `editor.occurrencesHighlight` | Text Editor | `true` | `true`, `false` | Highlight occurrences of active word |
| `editor.scrollBeyondLastLine` | Text Editor | `true` | `true`, `false` | Enable scrolling past end of document |
| `editor.bracketPairColorization` | Text Editor | `true` | `true`, `false` | Rainbow bracket pairs and matching |
| `editor.vimMode` | Text Editor | `false` | `true`, `false` | Modal Vim navigation keybindings |
| `workbench.colorTheme` | Workbench | `"github-dark"` | 14 built-in theme IDs | Active color theme |
| `diffEditor.renderSideBySide` | Diff Editor | `true` | `true`, `false` | Split vs. unified diff view default |
| `diffEditor.ignoreTrimWhitespace` | Diff Editor | `true` | `true`, `false` | Ignore whitespace differences in diffs |
| `git.gutterIndicators` | Git | `true` | `true`, `false` | Visual change markers in gutter |
| `explorer.compactFolders` | Explorer | `true` | `true`, `false` | Compact single-child directory chains |
| `explorer.autoReveal` | Explorer | `true` | `true`, `false` | Auto-scroll to active file in tree |
| `files.exclude` | Files | Default globs | Array of glob patterns | Exclude patterns from trees and search |
| `search.smartCase` | Search | `true` | `true`, `false` | Case-insensitive unless uppercase used |
| `search.maxResults` | Search | `1000` | `50` to `10000` | Maximum search results returned |
| `lsp.enabled` | LSP | `true` | `true`, `false` | Master toggle for Language Servers |
| `lsp.hover.enabled` | LSP | `true` | `true`, `false` | Hover documentation cards |
| `agent.harness` | Coding Agent | `""` | `claude`, `gemini`, `agy`, etc. | Preferred CLI coding harness |
| `agent.timeoutSeconds` | Coding Agent | `120` | `10` to `600` (seconds) | Max execution runtime for agent jobs |

---

## Direct JSON Configuration & Dotfiles

For automated developer workstation bootstrapping or dotfile management, you can edit `~/.px0/settings.json` directly:

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "\"JetBrains Mono\", monospace",
  "editor.lineHeight": 22,
  "workbench.colorTheme": "tokyo-night",
  "diffEditor.renderSideBySide": true,
  "agent.harness": "claude",
  "agent.timeoutSeconds": 180
}
```

Any changes written to this file while px0 is running will be detected and applied dynamically.
