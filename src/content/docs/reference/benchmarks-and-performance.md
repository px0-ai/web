---
title: "Performance Benchmarks & Methodology"
description: "Empirical benchmarks across seven real-world repositories from Flask to the Linux Kernel, comparing px0 to VS Code."
category: "reference"
order: 2
---

# Performance Benchmarks & Methodology

px0 is engineered for extreme responsiveness and minimal memory usage. While conventional IDEs allocate over 1 GB of RAM and run 15+ background processes, px0 operates as a single static Go binary utilizing ~20 MB of resident memory.

## Benchmark Corpus

Performance is evaluated across seven open-source repositories spanning two orders of magnitude in size:

| Repository | Source Size | Files Indexed | Character / Ecosystem |
| :--- | :--- | :--- | :--- |
| **flask** | 3 MB | 235 | Microframework: tests sub-millisecond instant path |
| **redis** | 26 MB | 1,855 | Systems C codebase with monolithic source files |
| **react** | 63 MB | 7,178 | Deep directory trees and nested `.gitignore` files |
| **django** | 74 MB | 7,014 | Large Python web framework with sprawling modules |
| **kubernetes** | 370 MB | 25,926 | Large enterprise Go monorepo with vendored code |
| **TypeScript** | 414 MB | 66,533 | Massive generated test trees and large source files |
| **linux** | 1,809 MB | 95,710 | Extreme scale: ~95,000 files and 1.8 GB source text |

## Benchmark Results (px0 Standalone)

Tested on Linux x86_64 with language servers disabled (`-no-lsp`):

| Repository | Files | Index Time | Fuzzy Search | Full-Tree Regex Scan | Resident RAM (RSS) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **flask** | 235 | **1 ms** | 0.8 ms | 2.3 ms | **16 MB** |
| **redis** | 1,855 | **13 ms** | 1.0 ms | 18.2 ms | **17 MB** |
| **django** | 7,014 | **39 ms** | 1.3 ms | 26.8 ms | **20 MB** |
| **react** | 7,178 | **52 ms** | 2.7 ms | 32.2 ms | **21 MB** |
| **kubernetes** | 25,926 | **150 ms** | 13.5 ms | 84.6 ms | **30 MB** |
| **TypeScript** | 66,533 | **566 ms** | 6.2 ms | 150.3 ms | **69 MB** |
| **linux** | 95,710 | **370 ms** | 6.0 ms | 451.8 ms | **55 MB** |

## Head-to-Head: px0 vs. VS Code Process Model

Measured during live active workspace inspection:

| Parameter | px0 | VS Code (Server/Remote) | Comparison |
| :--- | :--- | :--- | :--- |
| **Base Memory (RSS)** | **~20 MB** | 1,166 - 1,440 MB | px0 is **~70x lighter** |
| **Cold Startup Time** | **< 1 ms** | 3 - 8 seconds | Near-instant startup |
| **Process Count** | **1 single binary** | 15+ Node/Electron processes | Zero process sprawl |
| **Active Startup CPU Spike**| **< 1%** | 35% - 50% | Machines stay quiet |
| **Workspace Indexing** | **0 - 370 ms** | 4 - 15 seconds | Background churn eliminated |
| **Idle Memory Reclamation**| **Automatic (15s)**| Never released | OS RAM returned promptly |

## Reproducing the Benchmarks

All benchmark figures can be measured directly on your own machine using the reproducible benchmark script in the repository:

```bash
# 1. Fetch benchmark corpus (shallow clones of 7 repositories)
./benchmark.sh --clone

# 2. Run the complete benchmark suite
./benchmark.sh

# 3. Compare px0 directly against VS Code process tree on your current workspace
./benchmark.sh --vscode .

# 4. Profile memory lifecycle across index, search, and idle recovery
./benchmark.sh --memory bench-repos/linux
```
