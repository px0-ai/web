# Hero Kernel Demo

The stage below the hero copy on the landing page plays a short scripted scene. A terminal types `px0 ~/workspace/kernel`, px0 prints its startup narration, and the IDE opens on the Linux kernel. The palette then fuzzy-finds `lib/sort.c`, opens it, and loops through more searches. This document records how the scene was built and how to regenerate or retarget it.

## What the Visitor Sees

1. A terminal types `px0 ~/workspace/kernel` and presses enter.
2. px0 prints its header, the workspace path, the URL, and `ctrl-c to stop`. After 370 ms it prints the index line and the language server bullet.
3. About half a second later the IDE pops in over the terminal. The tree shows the kernel root, the editor shows an empty state, and the clangd dot is idle.
4. The palette types `libsort`, selects `lib/sort.c`, and opens it. The tree scrolls to `lib/`, the editor shows lines 225 to 260, a hover card sits on `do_swap`, and the inspector lists its references and the file outline.
5. The palette loops through `schedcore`, `ext4inode`, `@swap`, `>diff`, and `:253`.

A replay button in the stage bar restarts from the terminal. Clicking the stage during the terminal phase skips to the finished scene. Visitors with reduced motion or without JavaScript see the finished scene directly.

## Files

| File                            | Role                                                                      |
| ------------------------------- | ------------------------------------------------------------------------- |
| `src/components/Hero.astro`     | Markup, styles, C tokenizer, boot script, palette, and demo loop          |
| `src/data/kernel.ts`            | Generated kernel facts: paths, tree, excerpt, symbols, references         |
| `src/data/px0.ts`               | `CORPUS` (benchmark numbers) and `COMMANDS` (palette commands)            |
| `src/data/themes.ts`            | `THEMES[0]` (Tokyo Night) colours the IDE mock                            |
| `scripts/gen-kernel-data.mjs`   | Regenerates `src/data/kernel.ts` from a Linux checkout                    |
| `scripts/shoot-hero.cjs`        | Screenshots every stage at desktop and phone width and reports errors     |

## Where Every Fact Comes From

Nothing in the scene is invented. Each number and string traces back to a source.

| Shown in the scene                                    | Source                                                                                     |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Terminal narration layout                             | px0 `main.go` (`uiHeading`, `uiKV` with width 11, `uiHint`, `uiStatus`, `uiBullet`) and `ui.go` |
| `95710 files`, `370ms`, `RAM 55 MB`                   | The `linux` row of `CORPUS` in `src/data/px0.ts`, which mirrors px0 `BENCHMARKS.md`        |
| `clangd` as the C language server                     | px0 `lspservers.go`                                                                        |
| Tree root, `lib/` entries, palette paths              | `git ls-tree` and `git ls-files` on `px0/bench-repos/linux`                                |
| Code excerpt, outline, `do_swap` references           | `lib/sort.c` in the same checkout, read verbatim                                           |
| Fuzzy scores in the palette                           | `fuzzyScore` in `Hero.astro`, a line-for-line port of px0 `fuzzy.go`                       |

The generated file records the kernel commit it was taken from in its header comment.

## Regenerating the Data

The kernel checkout lives in the sibling px0 repo at `px0/bench-repos/linux`. `benchmark.sh` populates it. The generator reads that path by default.

```bash
node scripts/gen-kernel-data.mjs
# or point it at another checkout
node scripts/gen-kernel-data.mjs /path/to/linux
```

The script prints a summary and exits non-zero if the target file, symbol, or excerpt window is missing.

```text
wrote .../src/data/kernel.ts
  linux 5225b8eec4c9: 1066 palette paths, 24 root dirs, 17 root files
  lib/sort.c: 357 lines, excerpt 225-260, 12 functions, 6 mentions of do_swap
```

After regenerating against a newer kernel, check that the excerpt still starts at a sensible line and that the cursor line in `Hero.astro` still lands on a `do_swap` call. Line numbers drift between kernel releases.

### How the Generator Derives Each Export

- `KERNEL_FILES` lists tracked files directly inside the directories in `PATH_GLOBS`, plus the headers in `EXTRA_PATHS`. The full tree has 95,710 files, which would bloat the page, so the palette ranks this sample of about 1,000 real paths.
- `ROOT_DIRS` and `ROOT_FILES` come from `git ls-tree HEAD .`, directories first, sorted case-insensitively. This ordering mirrors the tree in the original px0 mock.
- `LIB_WINDOW` holds the siblings of the target file in byte order, `WINDOW` rows above and below it, with directories suffixed by `/`. It stands in for the tree scrolled to the open file.
- `SORT_SYMBOLS` collects column-0 function definitions: a return type, a name, then `(`.
- `DO_SWAP_REFS` lists every line that calls or defines the symbol, with the definition first.
- `SORT_EXCERPT` holds lines `START` to `END` verbatim, tabs included, plus the file's total line count.

## Retargeting to Another File or Symbol

The knobs sit at the top of `scripts/gen-kernel-data.mjs`: `FILE`, `START`, `END`, `SYMBOL`, `WINDOW`, `PATH_GLOBS`, and `EXTRA_PATHS`. The export names (`SORT_SYMBOLS`, `DO_SWAP_REFS`, `LIB_WINDOW`) stay the same so `Hero.astro` keeps compiling. Rename them in both places if the mismatch bothers you.

Pick a file where a helper function is defined earlier and called at least twice inside a 36-line window. The hover card, occurrence highlights, and reference list all need that. `lib/sort.c` fits because `do_swap` is defined at line 137 and called at 232 and 236.

`Hero.astro` hard-codes a few details that must change with the data:

- `CURSOR_LINE` sets the highlighted line. The tokenizer puts the caret after the first `do_swap` token on that line.
- `tokenizeC` marks occurrences with `if (v === 'do_swap') c += ' occ'`.
- `.ide-hover` contains a hand-written, two-line signature for the symbol. Its `left: calc(6ch + 12ch)` offset assumes three tabs of indentation at `tab-size: 4`.
- The breadcrumb reads `kernel › lib › sort.c › __sort_r`, the tab reads `sort.c`, and the outline heading reads `outline · sort.c`.
- The tree highlights `name === 'sort.c'` and the outline highlights `s.name === '__sort_r'`, the enclosing function.
- The `tour` function types `libsort`. Confirm the target file ranks first for the new query, as `scripts/shoot-hero.cjs` prints the top palette rows.
- The `script` array holds the looping palette queries. Keep them relevant to the workspace and the open file's symbols.

To change the workspace path or the command, edit `ideData.cmd`, the `workspace:` line in `bootLines`, and the stage bar label. Keep the narration in step with px0 `main.go` if its startup output changes.

## How the Scene Works

Two attributes drive all state, and CSS does the rest.

| Attribute            | Element  | Values           | Effect                                                                                  |
| -------------------- | -------- | ---------------- | --------------------------------------------------------------------------------------- |
| `data-phase`         | `#stage` | `boot`, `ide`    | `boot` shows the terminal overlay and hides the IDE. `ide` fades the overlay and pops the IDE in. |
| `data-view`          | `#ide`   | `empty`, `open`  | Hides `.v-open` elements when empty and `.v-empty` elements when open.                  |

The server-rendered markup ships `data-phase="boot"` and `data-view="open"`. With JavaScript, visitors see the terminal first and no finished IDE flashes. Without JavaScript, a `<noscript>` style hides the terminal and shows the finished IDE.

The script runs in two stages.

1. `boot(id)` resets to the terminal, waits until the frame is at least 30% visible, types the command at 50 to 110 ms per character, prints the header, waits `indexMs` (370 ms) before the index lines, then waits 520 ms and switches to `ide`.
2. `tour(id)` waits 900 ms, types `libsort` into the palette, selects `lib/sort.c`, and opens it through the same `choose()` path a visitor uses. Then it loops the `script` queries, pausing 2.4 s between rounds.

A single counter, `run`, cancels work in flight. Every async step captures its `id` and stops once `id !== run`. Any visitor interaction increments `run`: a pointer down on the stage, focusing the palette input, or clicking a palette button. A pointer down during `boot` calls `finish()`, which jumps to the open file. The replay button calls `play()`, which increments `run` and starts both stages again. `live(id)` pauses the script while the stage is off screen.

With `prefers-reduced-motion: reduce`, the script calls `finish()` at once and hides the replay button.

## Verifying Changes

Start the dev server in background mode, as `CLAUDE.md` requires.

```bash
astro dev --background
```

Run the screenshot check. It needs Playwright with Chromium. If `require('playwright')` cannot resolve, point `PLAYWRIGHT` at the package.

```bash
PLAYWRIGHT=/path/to/node_modules/playwright node scripts/shoot-hero.cjs /tmp/hero-shots
```

The script loads the page at 1440 px and 400 px wide, in dark and light schemes. For each run it captures four frames: `1-terminal`, `2-ide-empty`, `3-palette`, and `4-open`. It prints the terminal text and the top palette rows. It also checks that replay returns to `boot`, that a click during boot lands on `open`, and that reduced motion lands on `open`. It exits non-zero on any console or page error.

Review the screenshots for these points:

- The terminal text matches px0's real output line for line.
- The target file ranks first in the palette.
- The hover card does not spill past the editor.
- The phone layout hides the sidebar and inspector cleanly.

Finish with a production build.

```bash
npm run build
```

## Known Limitations

- At 400 px the longest narration line, `language servers: clangd (started on first use)`, overflows the terminal and scrolls horizontally inside it.
- The palette's `N ranked` count reflects the roughly 1,000-path sample, not the full 95,710 files.
- The page already overflowed horizontally at 400 px before this scene existed. The overflow comes from `.scen-item` in the Remote section, and `scripts/shoot-hero.cjs` reports it as a 38 px overflow.
- The tree's case-insensitive, directories-first ordering copies the original mock. Nobody has checked it against px0's tree code.
