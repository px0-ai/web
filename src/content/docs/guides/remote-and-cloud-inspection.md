---
title: "Remote & Cloud Workspace Inspection"
description: "Inspect remote servers, cloud instances, and CI runners in your local browser with zero SSH port forwarding churn."
category: "guides"
order: 4
---

# Remote & Cloud Workspace Inspection

Traditional remote development extensions spawn multi-process Node.js environments and background indexers that consume 1 GB or more of server RAM. 

px0 runs as an ultra-light single binary requiring ~20 MB of memory and boots in under 1 ms. This makes it ideal for cloud VMs, staging instances, containerized runners, and remote development hosts.

## Network Topology

```text
[ Remote Host / VM / Runner ]                 [ Local Machine ]
+---------------------------+                 +-------------------------+
| px0 Server (:7777)        | <=== Secure === | Local Web Browser       |
| (~20 MB RAM, < 1ms boot)  |      Tunnel     | (http://127.0.0.1:7777) |
+---------------------------+                 +-------------------------+
```

## Pattern 1: Tailscale / WireGuard Mesh (Recommended)

When your remote machine is part of a private mesh network (such as Tailscale or WireGuard), px0 can bind directly to the machine's private network interface:

```bash
# On remote machine: bind to all interfaces in headless mode
px0 -host 0.0.0.0 -port 7777 -no-open /path/to/remote/code
```

Then open the machine's MagicDNS hostname or private IP in your local browser:

```text
http://my-dev-server:7777
```

Because px0 is strictly read-only, viewers cannot mutate files or execute commands on the remote server.

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

## Pattern 3: Cloudflare Tunnels or Reverse Proxy

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

## Headless CLI Options for Remote Hosts

When running px0 on remote machines, use these flags:

| Flag | Purpose |
| :--- | :--- |
| `-no-open` | Disables launching a browser on the remote server (essential for headless servers without X11/Wayland). |
| `-host 0.0.0.0` | Binds all network interfaces rather than only loopback `127.0.0.1`. |
| `-port N` | Sets a fixed port (default `7777`). Pass `0` to allocate a random available port. |
| `-quiet` | Suppresses terminal narration banner and outputs only fatal errors. |

## Security & Sandboxing Guarantees

When exposing px0 across networks:
- **Strict Read-Only**: The backend contains no endpoints for file creation, deletion, or modification.
- **Path Traversal Protection**: Every request verifies that target file paths resolve strictly inside the designated workspace root.
- **DNS Rebinding Prevention**: The HTTP router verifies incoming `Host` headers to prevent cross-origin DNS rebinding attacks.
