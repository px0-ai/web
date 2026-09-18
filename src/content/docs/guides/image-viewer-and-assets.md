---
title: "Image Viewer & Asset Inspection"
description: "Inspect visual assets, icons, and diagrams with first-class image tabs, smooth and pixelated rendering, background contrast modes, and a markdown image lightbox."
category: "guides"
order: 9
---

# Image Viewer & Asset Inspection

Modern codebases contain a growing variety of visual assets: SVG icon bundles, UI mockups, generated architectural diagrams, charts, favicon sets, and asset pipelines. When pairing with AI coding agents or reviewing frontend pull requests, developers frequently need to inspect these visual outputs immediately without switching to an external image editor or desktop preview app.

px0 treats image formats (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.ico`, `.bmp`, `.avif`) as first-class documents alongside source code and Markdown. Images load in lightweight tabs, render instantly through native browser hardware acceleration, and consume zero background memory when idle.

---

## Opening Image Files

You can open images in px0 using any standard navigation method:

1. **File Tree**: Click any image file in the left sidebar explorer.
2. **Fuzzy File Finder (`Cmd+P` / `Ctrl+P`)**: Search for the image filename and press `Enter`.
3. **Markdown Previews**: Click any inline image in a rendered Markdown document to open the interactive lightbox, then click **Open in Tab**.

Images open in a dedicated tab with a custom image icon, presenting an interactive canvas and floating heads-up display (HUD).

---

## Interactive Viewing Controls

When viewing an image tab, px0 provides smooth pan-and-zoom controls tailored for both large diagrams and pixel-level icon inspection.

### 1. Smart Fit & Zoom Math

- **Fit-to-Window (`0`)**: Automatically scales the image so it fits completely within the current viewport bounds with 64px padding. If an image is smaller than the viewport (such as a 16x16 favicon or 32x32 icon), px0 displays it at 100% actual size ($1.0\times$) instead of blurring it with unwanted upscaling.
- **Actual Size 1:1 (`1`)**: Instantly resets the zoom level to 100% scale ($1.0\times$) and centers the image.
- **Step Zoom (`+` / `-`)**: Multiplies or divides the current scale by $1.25\times$. The zoom multiplier is clamped between $0.05\times$ (5%) and $32.0\times$ (3200%).
- **Mouse Wheel Zoom**: Scroll the mouse wheel up or down anywhere in the viewport to zoom smoothly centered on the viewport.

### 2. Freeform Drag-to-Pan

- **Mouse Drag**: Click and drag with mouse button 0 anywhere on the canvas to pan across large architectural diagrams or high-resolution screenshots. The cursor toggles between `grab` and `grabbing`.
- **Keyboard Panning**: Press the arrow keys (`↑`, `↓`, `←`, `→`) to pan the viewport in 40px increments.

---

## Background Contrast Modes (`b`)

Evaluating transparent PNGs or dark SVG icons against a dark theme can be challenging. Press `b` (or click the background toggle in the HUD) to cycle through three background contrast modes:

| Mode | Appearance | Ideal For |
| :--- | :--- | :--- |
| **Checkerboard** | Repeating subtle conic gradient (`var(--bg3)` / `var(--bg2)`) | Transparent PNGs, SVGs, and alpha-masked assets |
| **Dark** | Solid `#121214` dark matte | White or bright icons and diagrams |
| **Light** | Solid `#ffffff` clean bright matte | Dark logos, black line-art SVGs, and dark-themed UI mockups |

---

## Rendering Quality Modes (`p`)

Toggle between smooth bilinear filtering and crisp nearest-neighbor interpolation by pressing `p` (or clicking the mode button in the HUD):

- **Smooth Mode (`image-rendering: auto`)**: The default for photos, rendered UI mockups, and high-resolution diagrams.
- **Pixelated Mode (`image-rendering: pixelated`)**: Preserves crisp, unblurred pixel edges. Perfect for inspecting pixel art, retro assets, favicons, and individual SVG pixel alignments.
- **Smart Default Detection**: Any image with natural dimensions $\le 64 \times 64$ px automatically defaults to pixelated mode on first load, ensuring small icons are sharp immediately.

---

## Status Bar & HUD Integration

The bottom of the image viewer features a floating HUD overlay:
- Zoom out (`-`), Zoom ratio button, and Zoom in (`+`)
- Fit (`0`) and 1:1 Actual size (`1`)
- Background contrast switcher (`b`)
- Smooth / Pixelated switcher (`p`)
- Image resolution and file size badge (e.g. `1920 × 1080 px · 142.4 KB`)

The global px0 status bar updates in real time to show the image dimensions, active zoom percentage, and total byte size.

---

## Markdown Image Lightbox

Inline images in Markdown documentation receive special interactive enhancements:

1. **Lazy Loading & Async Decoding**: All Markdown images are marked with `loading="lazy"` and `decoding="async"`, preventing layout shifts and offscreen network requests until scrolled into view.
2. **Hover Affordance**: Standalone Markdown images feature a subtle accent hover ring and a `zoom-in` cursor.
3. **Click-to-Expand Modal**: Clicking any standalone image opens a full-window dimmed backdrop overlay with backdrop blur:
   - Displays image filename and natural dimensions.
   - **Open in Tab**: Promotes the image into a first-class editor tab for unrestricted zooming, panning, and background contrast switching.
   - **Copy Path / URL**: Copies the workspace path or remote URL to the clipboard.
   - **Close**: Dismisses the overlay on `Escape`, close button click, or backdrop click.
4. **Resilient Error Fallbacks**: Broken or missing image links are intercepted and replaced with a clean warning card (`Image not found: <path>`) instead of broken browser placeholders.

---

## Keyboard Shortcuts Summary

| Key | Action |
| :--- | :--- |
| `+` or `=` | Zoom In ($1.25\times$, up to $3200\%$) |
| `-` or `_` | Zoom Out ($1.25\times$, down to $5\%$) |
| `0` | Fit image to window |
| `1` | Actual size (100% scale / 1:1) |
| `b` or `B` | Cycle background mode (Checkerboard -> Dark -> Light) |
| `p` or `P` | Toggle rendering mode (Smooth vs. Pixelated) |
| Arrow keys | Pan canvas by 40 px |
| Mouse Drag | Freeform pan canvas |
| Mouse Wheel | Interactive zoom |
| `Escape` | Dismiss Markdown image lightbox |
| `Alt+W` / `Cmd+W` | Close image tab |
