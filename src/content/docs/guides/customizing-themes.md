---
title: "Themes & Interface Customization"
description: "Switch between 14 curated high-contrast themes and learn how the CSS token architecture works."
category: "guides"
order: 9
---

# Themes & Interface Customization

px0 ships with 14 built-in syntax and interface themes optimized for code legibility across both dark and light environments.

## Available Themes

The following themes are included out of the box:

| Theme Name | Style | Characteristics |
| :--- | :--- | :--- |
| **Tokyo Night** (Default) | Dark | Deep violet background with neon cyan and magenta accents |
| **Catppuccin Mocha** | Dark | Warm pastel palette on soothing dark mauve |
| **Catppuccin Latte** | Light | Clean, high-contrast daytime pastel palette |
| **Dracula** | Dark | Vibrant pink, purple, and green syntax accents |
| **GitHub Dark** | Dark | Default GitHub code audit appearance |
| **GitHub Light** | Light | High-contrast black on white documentation style |
| **Gruvbox Dark** | Dark | Warm retro autumnal earthy tones |
| **Gruvbox Light** | Light | Parchment warm background with retro accents |
| **Nord** | Dark | Arctic, north-bluish clean aesthetic |
| **One Dark** | Dark | Classic Atom / VS Code dark blue-gray |
| **Solarized Dark** | Dark | Precision-calibrated blue-green palette |
| **Solarized Light** | Light | Warm solarized yellow-tinted daylight theme |
| **Monokai** | Dark | High-contrast yellow, green, and orange syntax |
| **Rose Pine** | Dark | Muted vintage minimalist aesthetic |

## Switching Themes

You can change themes through multiple methods:

### Method 1: Activity Rail / Sidebar Footer
Click the **Theme Button** in the bottom left footer of the sidebar (or press the theme icon on the activity rail) to open the theme selection dropdown.

### Method 2: Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
1. Press `Ctrl+Shift+P` to open the Command Palette.
2. Type `Theme` and select **Preferences: Select Theme**.
3. Use the arrow keys to preview themes dynamically in real time and press `Enter` to commit your choice.

### Persistence
Your selected theme is automatically saved to browser local storage and restored whenever you open any px0 session on that machine.

## Theme Architecture & CSS Tokens

px0 uses a strict CSS Custom Property token architecture. Rather than hardcoding hex colors across components, the entire interface is styled through semantic CSS variables defined in `/static/themes.css`.

Key color tokens include:

```css
--bg-main: #1a1b26;        /* Main editor background */
--bg-side: #16161e;        /* Sidebar and activity rail */
--bg-tab: #1f2335;         /* Active tab background */
--fg-main: #c0caf5;        /* Default editor text */
--fg-dim: #565f89;         /* Comments and line numbers */
--accent: #7aa2f7;         /* Selection and highlights */
--git-mod: #e0af68;        /* Git modified badge */
--git-add: #9ece6a;        /* Git added badge */
--git-del: #f7768e;        /* Git deleted badge */
```

Because themes are clean modular stylesheets, they load with zero runtime JavaScript overhead.
