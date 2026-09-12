// Facts about px0, taken from its README, BENCHMARKS.md, ARCHITECTURE.md and source.

/** Every tracked path in the px0 repository, fed to the palette in the hero mock. */
export const FILES = [
  '.github/ISSUE_TEMPLATE/bug_report.md', '.github/ISSUE_TEMPLATE/config.yml',
  '.github/ISSUE_TEMPLATE/feature_request.md', '.github/workflows/release.yml', '.gitignore',
  'AGENT.md', 'ARCHITECTURE.md', 'BENCHMARKS.md', 'CONTRIBUTING.md', 'LICENSE', 'Makefile',
  'README.md', 'STYLING.md', 'VERSION', 'benchmark.sh', 'build.sh', 'fuzzy.go', 'go.mod', 'go.sum',
  'highlight.go', 'highlight_test.go', 'ignore.go', 'index.go', 'install.sh', 'lsp.go',
  'lsp_test.go', 'lspnav.go', 'lspservers.go', 'main.go', 'metrics.go', 'px0_test.go',
  'scripts/build-web.js', 'search.go', 'server.go', 'symbols.go', 'tty_bsd.go', 'tty_linux.go',
  'tty_other.go', 'ui.go', 'update.go', 'update_integration_test.go', 'update_test.go',
  'web/app.js', 'web/index.html', 'web/src/cursor.js', 'web/src/find.js', 'web/src/history.js',
  'web/src/hover.js', 'web/src/inspector.js', 'web/src/lsp.js', 'web/src/main.js',
  'web/src/outline.js', 'web/src/palette.js', 'web/src/panels.js', 'web/src/refmenu.js',
  'web/src/renderer.js', 'web/src/search.js', 'web/src/shortcuts.js', 'web/src/state.js',
  'web/src/status.js', 'web/src/tabs.js', 'web/src/theme.js', 'web/src/tree.js', 'web/src/ui.js',
  'web/style.css', 'web/themes/catppuccin-latte.css', 'web/themes/catppuccin-mocha.css',
  'web/themes/dark.css', 'web/themes/dracula.css', 'web/themes/github-dark.css',
  'web/themes/gruvbox-dark.css', 'web/themes/gruvbox-light.css', 'web/themes/light.css',
  'web/themes/monokai.css', 'web/themes/nord.css', 'web/themes/one-dark.css',
  'web/themes/rose-pine.css', 'web/themes/solarized-dark.css', 'web/themes/solarized-light.css',
];

/** Top-level declarations in fuzzy.go. */
export const SYMBOLS = [
  { name: 'FuzzyResult', kind: 'struct', line: 10 },
  { name: 'isBoundary', kind: 'func', line: 17 },
  { name: 'fuzzyScore', kind: 'func', line: 29 },
  { name: 'min', kind: 'func', line: 87 },
  { name: 'FuzzyFind', kind: 'func', line: 95 },
];

export const COMMANDS = [
  'Go to File', 'Search in Files', 'Go to Symbol', 'Find in File', 'Go to Line',
  'Toggle Word Wrap', 'Toggle Line Numbers', 'Select Theme', 'Next Theme',
  'Keyboard Shortcuts', 'Re-index Workspace',
];

/** fuzzy.go, lines 50 to 85, verbatim. */
export const FUZZY_EXCERPT = {
  file: 'fuzzy.go',
  total: 156,
  start: 50,
  lines: [
    '\t// Collected right-to-left; flip in place.',
    '\tfor i, j := 0, len(pos)-1; i < j; i, j = i+1, j-1 {',
    '\t\tpos[i], pos[j] = pos[j], pos[i]',
    '\t}',
    '',
    '\tscore, prev := 0, -2',
    '\tfor k, i := range pos {',
    '\t\tif i == prev+1 {',
    '\t\t\tscore += 12 // consecutive run',
    '\t\t} else if k > 0 {',
    '\t\t\tscore -= min(i-prev, 12) // gap penalty, bounded',
    '\t\t}',
    '\t\tif i >= e.nameStart {',
    '\t\t\tscore += 14 // basename beats directory noise',
    '\t\t}',
    '\t\tif i == 0 || isBoundary(p[i-1]) {',
    '\t\t\tscore += 16 // start of a path or word segment',
    "\t\t} else if p[i] >= 'A' && p[i] <= 'Z' && p[i-1] >= 'a' && p[i-1] <= 'z' {",
    '\t\t\tscore += 14 // camelCase hump',
    '\t\t}',
    '\t\tif p[i] == q[k] {',
    '\t\t\tscore += 4 // exact case',
    '\t\t}',
    '\t\tprev = i',
    '\t}',
    '\t// Prefer the shallower, shorter of two otherwise-equal paths.',
    '\tscore -= len(p) / 8',
    '\tscore -= strings.Count(p, "/") * 2',
    '\tif idx := strings.Index(e.lower[e.nameStart:], q); idx >= 0 {',
    '\t\tscore += 40 // whole query appears verbatim in the basename',
    '\t\tif idx == 0 {',
    '\t\t\tscore += 20',
    '\t\t}',
    '\t}',
    '\treturn score, pos, true',
    '}',
  ],
};

/** BENCHMARKS.md results: Linux, -no-lsp, fastest of 5 runs. Times in ms, sizes in MB. */
export const CORPUS = [
  { repo: 'flask', lang: 'Python', source: 3, files: 235, index: 1, fuzzy: 0.8, scan: 2.3, open: null, reopen: null, mem: 16, peak: 18 },
  { repo: 'redis', lang: 'C', source: 26, files: 1855, index: 13, fuzzy: 1.0, scan: 18.2, open: 80.8, reopen: 1.2, mem: 17, peak: 27 },
  { repo: 'django', lang: 'Python', source: 74, files: 7014, index: 39, fuzzy: 1.3, scan: 26.8, open: 166.8, reopen: 1.0, mem: 20, peak: 29 },
  { repo: 'react', lang: 'JavaScript', source: 63, files: 7178, index: 52, fuzzy: 2.7, scan: 32.2, open: 57.7, reopen: 0.7, mem: 21, peak: 28 },
  { repo: 'kubernetes', lang: 'Go', source: 370, files: 25926, index: 150, fuzzy: 13.5, scan: 84.6, open: 199.0, reopen: 0.9, mem: 30, peak: 44 },
  { repo: 'typescript', lang: 'TypeScript', source: 414, files: 66533, index: 566, fuzzy: 6.2, scan: 150.3, open: 40.9, reopen: 6.5, mem: 69, peak: 105 },
  { repo: 'linux', lang: 'C', source: 1809, files: 95710, index: 370, fuzzy: 6.0, scan: 451.8, open: 26.7, reopen: 0.6, mem: 55, peak: 73 },
];

/** Resident memory of a VS Code process tree on the same workspace, BENCHMARKS.md. */
export const VSCODE_TREE = [
  { name: 'extension host', mb: 500 },
  { name: 'language server', mb: 350 },
  { name: 'server main', mb: 260 },
  { name: 'IPC proxies & utility', mb: 190 },
  { name: 'PTY host & terminal', mb: 71 },
  { name: 'file watcher', mb: 68 },
];

/** ./benchmark.sh --memory bench-repos/linux */
export const MEM_TRACE = [
  { step: 'indexed', mb: 59 },
  { step: 'fuzzy find', mb: 59 },
  { step: '5 full scans', mb: 85 },
  { step: 'open largest', mb: 88 },
  { step: 'scroll it', mb: 94 },
  { step: '8 s idle', mb: 94 },
  { step: '30 s idle', mb: 57 },
];

/** ./benchmark.sh --lsp . with gopls */
export const LSP_OPS = [
  { op: 'document outline', ms: 1.4 },
  { op: 'go to definition', ms: 1.5 },
  { op: 'find all references', ms: 3.0 },
  { op: 'hover', ms: 5.1 },
];

export const LSP_SERVERS = [
  { lang: 'Go', server: 'gopls', cmd: 'go install golang.org/x/tools/gopls@latest' },
  { lang: 'Rust', server: 'rust-analyzer', cmd: 'rustup component add rust-analyzer' },
  { lang: 'TypeScript / JavaScript', server: 'typescript-language-server', cmd: 'npm install -g typescript-language-server typescript' },
  { lang: 'Python', server: 'pyright or ruff', cmd: 'npm install -g pyright' },
  { lang: 'C / C++', server: 'clangd', cmd: 'brew install llvm' },
  { lang: 'Zig', server: 'zls', cmd: 'brew install zls' },
  { lang: 'Lua', server: 'lua-language-server', cmd: 'brew install lua-language-server' },
  { lang: 'Ruby', server: 'solargraph', cmd: 'gem install solargraph' },
];

export const FLAGS = [
  { flag: '-port N', def: '7777', desc: 'port to listen on (0 picks an ephemeral free port)' },
  { flag: '-host H', def: '127.0.0.1', desc: 'local address to bind' },
  { flag: '-no-open', def: 'false', desc: 'do not launch the browser' },
  { flag: '-no-lsp', def: 'false', desc: 'skip language servers, use the regex outline' },
  { flag: '-no-color', def: 'false', desc: 'strip ANSI escape sequences' },
  { flag: '-quiet', def: 'false', desc: 'suppress narration, errors still go to stderr' },
  { flag: '-update', def: 'false', desc: 'check for and install the latest release' },
  { flag: '-version', def: 'false', desc: 'print version and architecture, then exit' },
];

/** The 15 release targets from `make dist`. */
export const TARGETS = [
  { os: 'darwin', arch: ['amd64', 'arm64'] },
  { os: 'linux', arch: ['386', 'amd64', 'arm', 'arm64', 'riscv64'] },
  { os: 'freebsd', arch: ['amd64', 'arm64'] },
  { os: 'openbsd', arch: ['amd64', 'arm64'] },
  { os: 'netbsd', arch: ['amd64'] },
  { os: 'windows', arch: ['386', 'amd64', 'arm64'] },
];
