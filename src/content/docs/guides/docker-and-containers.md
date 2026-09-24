---
title: "Running px0 in Docker & Containers"
description: "Run px0 inside isolated containers, microVMs, and CI build runners with mounted host volumes."
category: "guides"
order: 10
---

# Running px0 in Docker & Containers

Running px0 inside Docker allows you to inspect unfamiliar codebases, audit artifacts from automated CI runners, or browse isolated build environments without running binaries directly on your host machine.

## Quick Docker Run

Run px0 in a container while mounting your current directory:

```bash
docker run --rm -it \
  -p 7777:7777 \
  -v "$(pwd):/workspace:ro" \
  ghcr.io/px0-ai/px0:latest \
  -host 0.0.0.0 -port 7777 -no-open /workspace
```

Now open `http://localhost:7777` in your host browser.

### Key Flags Explained:
- `-p 7777:7777`: Maps container port 7777 to your local machine.
- `-v "$(pwd):/workspace"`: Mounts your project directory into the container workspace (or append `:ro` for isolated audit-only containers).
- `-host 0.0.0.0`: Ensures px0 listens on all container network interfaces so requests from the host are accepted.
- `-base-path /rev-123/`: Optional subpath prefix for multi-container ingress routing or reverse proxies.
- `-no-open`: Prevents trying to open a desktop browser inside the headless container.

## Minimal Dockerfile Recipe

If you build custom internal developer images, you can add px0 as a single layer with zero external dependencies:

```dockerfile
FROM alpine:latest

# Install ca-certificates and curl
RUN apk add --no-cache ca-certificates curl git

# Install px0 single binary
RUN curl -fsSL https://px0.ai/install.sh | sh

# Set entrypoint
EXPOSE 7777
ENTRYPOINT ["/root/.local/bin/px0", "-host", "0.0.0.0", "-port", "7777", "-no-open"]
CMD ["/workspace"]
```

Because px0 is a statically linked binary with zero CGO or dynamic library requirements, it runs directly on standard Alpine, Debian, Ubuntu, or distroless base images, consuming only ~20-30 MB of container memory while browser rendering is offloaded to the client.

## Inspecting CI/CD Artifacts & Runners

In CI environments (such as GitHub Actions or GitLab CI), px0 can be spawned in the background during debugging sessions:

```yaml
# Example GitHub Actions debug step
- name: Inspect build tree on failure
  if: failure()
  run: |
    curl -fsSL https://px0.ai/install.sh | sh
    ~/.local/bin/px0 -host 0.0.0.0 -port 7777 -no-open . &
    echo "px0 running on runner port 7777"
```

You can then forward the runner's port using an action like `action-tmate` or an SSH bastion to inspect failing test trees, generated logs, and compiler outputs directly in your browser.
