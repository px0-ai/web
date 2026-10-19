---
title: "Tips & Tricks Discovery System"
description: "Discover keyboard shortcuts, Git workflows, and hidden productivity features through px0's interactive tips widget and inspector panel."
category: "guides"
order: 17
---

# Tips & Tricks Discovery System

px0 includes a built-in tips and tricks system designed to help developers discover powerful keyboard shortcuts, Git workflows, PR review capabilities, and editor features without blocking startup or cluttering the interface.

---

## Non-Intrusive Discovery Architecture

Unlike heavy IDEs that block startup with large modal windows, px0 loads tips asynchronously in the background with zero performance impact on the initial render:

- **Floating Tip Widget**: Appears smoothly in the bottom-right corner after an initial quiet period (~1.8 seconds). It displays one tip at a time with previous/next controls (`‹` and `›`), category tags, and optional keyboard shortcut badges.
- **Dedicated Inspector Tab**: An inspector panel labeled **Tips** (`#pane-right-tips`) lists all available tips in a searchable, filterable catalog directly alongside your code.
- **Offline Fallback Engine**: Tips are loaded asynchronously from `https://px0.ai/tips.json` and cached locally. When offline or disconnected from the network, px0 automatically falls back to built-in default tips.
- **Permanent Dismissal**: If you prefer not to see popup tips, you can dismiss them permanently with a single click.

---

## How to Access Tips

You can view and browse tips through several convenient entry points:

### 1. Floating Widget
The widget appears in the lower-right corner of the editor window. Use the **‹** and **›** buttons to cycle through tips manually, or let it advance automatically. Click **Don't show tips** to disable floating popups permanently.

### 2. Help Button in Sidebar Footer
Click the help icon (**?**) in the bottom sidebar footer (next to the theme palette and settings buttons) to open the Tips tab in the right inspector panel immediately.

### 3. Inspector Tab
Click the **Tips** tab in the top header of the right-side inspector. The panel lets you search tips by keyword or filter them by category:
- **Navigation**: File finding, jump to line, symbol jumping.
- **Git**: Branch diffs, commit stepping, PR review modes.
- **AI**: Inline edits, thread conversations, batch apply.
- **Editing**: File edits, indentation, save shortcuts.
- **Viewer**: Word wrap, Markdown preview, image zoom.
- **Workbench**: Autocompletion, pinned workspaces, worktree checkouts.
- **Performance**: Virtualized rendering, LSP memory, index tuning.

### 4. Command Palette
Press **`Cmd/Ctrl + Shift + P`** and select:
- **Help: Tips & Tricks (All Tips)**: Opens the full tips list in the inspector panel.
- **Help: Show Tip**: Triggers the floating tip widget to display a random discovery tip.

### 5. Keyboard Cheat Sheet
Press **`?`** anywhere in the app to display the keyboard shortcut sheet, then click the **💡 Tips & Tricks** button at the top of the modal.

---

## Configuring Tip Preferences

You can customize tip behavior in Settings (`Cmd/Ctrl+,`):

- **Enable / Disable Popups**: Set `tips.enabled` to `false` in Settings to prevent the floating widget from ever appearing. The inspector tab and Command Palette actions remain accessible whenever you want to browse tips manually.
- **One-Click Dismissal**: Clicking **Don't show tips** on the floating widget automatically sets `tips.enabled: false` in your configuration file.
