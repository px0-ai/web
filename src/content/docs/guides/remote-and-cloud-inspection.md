---
title: "Remote & Cloud Workspace Inspection"
description: "Inspect remote servers, cloud instances, and CI runners in your local browser with zero SSH port forwarding churn."
category: "guides"
order: 4
---

# Remote & Cloud Workspace Inspection

Traditional remote development extensions spawn multi-process Node.js environments and background indexers that consume 1 GB or more of server RAM. 

px0 runs as an ultra-light single binary requiring strictly ~20-30 MB of host memory and boots in under 1 ms. The rendering workload is offloaded to your local browser tab (~80-150 MB), so remote devboxes and containers stay lean and responsive.

## Network Topology

```text
[ Remote Host / VM / Devbox ]                [ Local Machine ]
+---------------------------+                +-------------------------+
| px0 Server (:7777)        | <== Secure ==  | Local Web Browser       |
| (~20-30 MB host RSS)      |     Tunnel     | (~80-150 MB client tab) |
+---------------------------+                +-------------------------+
```

## Pattern 1: Tailscale / WireGuard Mesh (Recommended)

When your remote machine is part of a private mesh network (such as Tailscale or WireGuard), px0 can bind directly to the machine's private network interface:

```bash
# On remote machine: bind to all interfaces in headless mode
px0 -host 0.0.0.0 -port 7777 -no-open /path/to/remote/code
```

Then open the machine's private IP or MagicDNS hostname in your local browser:

```text
http://100.x.y.z:7777
```

Opening px0 directly by private IP allows both fast code navigation and authenticated agent editing.

## Pattern 2: SSH Port Forwarding

If you access your server through standard SSH, forward the px0 port over your existing encrypted SSH connection:

```bash
# Connect with port 7777 forwarded to your local machine
ssh -L 7777:127.0.0.1:7777 user@remote-server.com
```

Once connected to the remote shell, start px0 binding to localhost:

```bash
px0 -no-open /path/to/remote/code
```

Open your local browser to `http://127.0.0.1:7777`. All traffic is forwarded securely through your SSH tunnel.

## Pattern 3: Reverse Proxy or Tunnels

For persistent or shared inspection endpoints behind Nginx or Cloudflare Tunnels:

```bash
px0 -host 127.0.0.1 -port 7777 -no-open /workspace
```

Example Nginx reverse proxy configuration block:

```nginx
server {
    listen 443 ssl http2;
    server_name inspect.internal.domain;

    location / {
        proxy_pass http://127.0.0.1:7777;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_buffering off;
    }
}
```

## Pattern 4: Reverse Proxy & Subpath Hosting (`-base-path`)

When hosting px0 behind an API gateway, ingress controller, or multi-tenant review platform (such as PR review pods at `https://tenant.px0.ai/rev-123/` or internal portals at `https://corp.internal/tools/px0/`), px0 can be served from a URL subpath rather than the root domain:

```bash
px0 -base-path /rev-123/ -host 0.0.0.0 -port 7777 ~/workspace
```

**Key capabilities:**
- **Endpoint Prefixing**: Automatically prefixes all HTTP multiplexer endpoints (`/<base-path>/api/...`, `/<base-path>/static/...`).
- **Dynamic `<base href>` Injection**: Injects `<base href="/<base-path>/">` dynamically into `index.html` so the browser resolves relative asset requests and API calls cleanly.
- **Automatic Trailing Slash Redirects**: Requests to `/<base-path>` redirect to `/<base-path>/`, and root `/` redirects to the base path.
- **Configurable in Settings**: Can also be set permanently in `~/.px0/settings.json` via `server.basePath`.

## Headless CLI Options for Remote Hosts

When running px0 on remote machines, use these flags:

| Flag | Purpose |
| :--- | :--- |
| `-no-open` | Disables launching a browser on the remote server (essential for headless servers without graphical environments). |
| `-host 0.0.0.0` | Binds all network interfaces rather than only loopback `127.0.0.1`. |
| `-port N` | Sets a fixed port (default `7777`). Pass `0` to allocate a random available port. |
| `-base-path P` | Base URL path prefix to serve endpoints and assets from (e.g. `/rev-123/`). Overrides `server.basePath`. |
| `-no-agent` | Disables agent dispatch endpoints entirely (recommended on shared or multi-user instances). |
| `-quiet` | Suppresses terminal narration banner and outputs only fatal errors. |

## Security & Sandboxing Guarantees

When exposing px0 across networks:
- **Exploration Sandboxing**: File reading, search, and symbol endpoints are strictly sandboxed.
- **Path Traversal Protection**: Every request verifies that target file paths resolve strictly inside the designated workspace root.
- **DNS Rebinding Prevention**: The HTTP router verifies incoming `Host` headers to prevent cross-origin DNS rebinding attacks.
- **Agent Editing Origin Verification (`localPost`)**: Agent dispatch endpoints (`/api/agent/...`) verify that the `Origin` matches the `Host` header and that the Host is an IP address or localhost. Access through public tunnel hostnames will refuse agent edits to prevent remote exploitation.
- **Network Isolation**: When exposing px0 with `-host 0.0.0.0`, ensure the port is accessible only over private networks (WireGuard, Tailscale, private VPCs) or pass `-no-agent` to prevent unwanted code execution.
