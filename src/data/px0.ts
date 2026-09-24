// Facts about px0, taken from its README, BENCHMARKS.md, ARCHITECTURE.md and source.

export const COMMANDS = [
  'Go to File', 'Search in Files', 'Go to Symbol', 'Find in File', 'Go to Line',
  'Toggle Git Diff', 'Toggle Markdown Preview',
  'Toggle Word Wrap', 'Select Theme', 'Next Theme',
  'Edit with Agent', 'Cancel Agent Edit', 'Call Trail', 'Find Usages',
  'Git: Open Pull Request...', 'Git: Stage All', 'Git: Commit', 'Git: Push', 'Git: Pull',
  'Keyboard Shortcuts', 'Re-index Workspace',
];

/** Supported coding harnesses for agent-delegated edits */
export const HARNESSES = [
  {
    name: 'Claude Code',
    id: 'claude',
    defaultModel: 'haiku',
    cmd: 'claude --permission-mode acceptEdits --model haiku -p {prompt}',
  },
  {
    name: 'Gemini CLI',
    id: 'gemini',
    defaultModel: 'gemini-2.5-flash-lite',
    cmd: 'gemini --approval-mode auto_edit -m gemini-2.5-flash-lite -p {prompt}',
  },
  {
    name: 'Cursor Agent',
    id: 'cursor-agent',
    defaultModel: 'gemini-3.6-flash-minimal',
    cmd: 'cursor-agent --force --model gemini-3.6-flash-minimal -p {prompt}',
  },
  {
    name: 'Antigravity',
    id: 'agy',
    defaultModel: 'gemini-3.6-flash-low',
    cmd: 'agy --dangerously-skip-permissions --mode accept-edits --model gemini-3.6-flash-low -p {prompt}',
  },
  {
    name: 'OpenCode',
    id: 'opencode',
    defaultModel: 'opencode/big-pickle',
    cmd: 'opencode run -m opencode/big-pickle {prompt}',
  },
  {
    name: 'OpenAI Codex',
    id: 'codex',
    defaultModel: 'gpt-5-codex',
    cmd: 'codex exec --ask-for-approval never -m gpt-5-codex {prompt}',
  },
  {
    name: 'Aider',
    id: 'aider',
    defaultModel: 'claude-3-7-sonnet',
    cmd: 'aider --yes-always --no-auto-commits --model claude-3-7-sonnet --message {prompt}',
  },
  {
    name: 'Goose',
    id: 'goose',
    defaultModel: 'gpt-4o',
    cmd: 'goose run --no-session --model gpt-4o -t {prompt}',
  },
];

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
  { lang: 'Python', server: 'pyright / pylsp / ruff', cmd: 'npm install -g pyright or pipx install python-lsp-server' },
  { lang: 'C / C++', server: 'clangd', cmd: 'sudo apt install clangd or brew install llvm' },
  { lang: 'Zig', server: 'zls', cmd: 'brew install zls' },
  { lang: 'Lua', server: 'lua-language-server', cmd: 'brew install lua-language-server' },
  { lang: 'Ruby', server: 'solargraph', cmd: 'gem install solargraph' },
  { lang: 'Java', server: 'jdtls', cmd: 'brew install jdtls' },
  { lang: 'C#', server: 'omnisharp', cmd: 'Install OmniSharp on PATH' },
  { lang: 'LaTeX', server: 'texlab', cmd: 'brew install texlab' },
];

export const FLAGS = [
  { flag: '-port N', def: '7777', desc: 'port to listen on (0 picks an ephemeral free port)' },
  { flag: '-host H', def: '127.0.0.1', desc: 'local address to bind' },
  { flag: '-base-path P', def: 'none', desc: 'base URL path prefix to serve endpoints and assets from (e.g. /rev-123/)' },
  { flag: '-no-open', def: 'false', desc: 'do not launch the browser' },
  { flag: '-no-lsp', def: 'false', desc: 'skip language servers, use the regex outline' },
  { flag: '-no-git', def: 'false', desc: 'disable git awareness (tree status badges and diff view)' },
  { flag: '-agent H', def: 'none', desc: 'pin coding harness: claude, gemini, cursor-agent, agy, opencode, codex, aider, goose, or command template with {prompt}' },
  { flag: '-no-agent', def: 'false', desc: 'do not offer editing through a coding harness' },
  { flag: '-no-color', def: 'false', desc: 'strip ANSI escape sequences' },
  { flag: '-no-telemetry', def: 'false', desc: 'disable anonymous backend usage telemetry' },
  { flag: '-quiet', def: 'false', desc: 'suppress narration, errors still go to stderr' },
  { flag: '-update', def: 'false', desc: 'check for and install the latest release' },
  { flag: '-version, -v', def: 'false', desc: 'print version and architecture, then exit' },
];

export const TARGETS = [
  { os: 'darwin', arch: ['amd64', 'arm64'] },
  { os: 'linux', arch: ['386', 'amd64', 'arm', 'arm64', 'riscv64'] },
  { os: 'freebsd', arch: ['amd64', 'arm64'] },
  { os: 'openbsd', arch: ['amd64', 'arm64'] },
  { os: 'netbsd', arch: ['amd64'] },
  { os: 'windows', arch: ['386', 'amd64', 'arm64'] },
];

export const EDITORS_BENCH = [
  { editor: 'px0', hostMem: '~20 - 30 MB', totalMem: '~100 - 180 MB', mem: '~20 - 30 MB (host) / ~100 - 180 MB (total)', memVal: 180, hostVal: 30, open: '~10 ms', interact: '~15 ms', proc: 'Native Go daemon + Browser client' },
  { editor: 'Vim', hostMem: '~10 - 15 MB', totalMem: '~10 - 15 MB', mem: '~10 - 15 MB', memVal: 15, hostVal: 15, open: '~15 ms', interact: '~15 ms', proc: 'Native CLI' },
  { editor: 'Neovim', hostMem: '~10 - 20 MB', totalMem: '~10 - 20 MB', mem: '~10 - 20 MB', memVal: 20, hostVal: 20, open: '~150 ms', interact: '~150 ms', proc: 'Native CLI' },
  { editor: 'Sublime Text', hostMem: '~100 - 250 MB', totalMem: '~100 - 250 MB', mem: '~100 - 250 MB', memVal: 250, hostVal: 250, open: 'GUI dep.', interact: '~250 - 500 ms', proc: 'Native GUI (C++)' },
  { editor: 'Zed', hostMem: '~200 - 450 MB', totalMem: '~200 - 450 MB', mem: '~200 - 450 MB', memVal: 450, hostVal: 450, open: 'GUI dep.', interact: '~300 - 600 ms', proc: 'Native GUI (Metal / Vulkan)' },
  { editor: 'VS Code', hostMem: '~500 - 1,440 MB', totalMem: '~1,100 - 1,440 MB', mem: '~1,100 - 1,440 MB', memVal: 1440, hostVal: 1440, open: '~3.0 - 5.0 s', interact: '~6.0 - 10.0 s', proc: 'Electron (Chromium + Node)' },
];

export const CLIENT_SERVER_BENCH = [
  { layer: 'Server / Host Daemon', vscode: '~400 - 600 MB (Node.js, Extension Host)', vscodeRemote: '~500 - 1,200 MB (VS Code Server tree)', px0Local: '~20 - 30 MB (Native Go binary)', px0Remote: '~20 - 30 MB (Host memory only)' },
  { layer: 'Client UI / Frontend', vscode: '~700 - 900 MB (Bundled Chromium + GPU)', vscodeRemote: '~150 - 300 MB (Web browser tab)', px0Local: '~80 - 150 MB (Single browser tab)', px0Remote: '~80 - 150 MB (Local client browser)' },
  { layer: 'Total System RAM', vscode: '~1,100 - 1,440 MB', vscodeRemote: '~650 - 1,500 MB', px0Local: '~100 - 180 MB (~85-90% reduction)', px0Remote: '~100 - 180 MB', hi: true },
  { layer: 'Host Impact (Server / Devbox)', vscode: 'N/A', vscodeRemote: '~500 - 1,200 MB', px0Local: '~20 - 30 MB', px0Remote: '~20 - 30 MB', note: '20-50x leaner on host' },
];
