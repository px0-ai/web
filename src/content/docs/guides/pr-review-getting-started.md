---
title: "Getting Started with Pull Request Review"
description: "Open, review, fix, and merge pull requests across GitHub, GitLab, Gitea, and Bitbucket Cloud with zero local setup."
category: "guides"
order: 8
---

# Getting Started with Pull Request Review

This guide walks you through reviewing, editing, resolving conflicts, and merging pull requests in px0. It takes about five minutes the first time; after that, opening and reviewing any pull request requires just one command.

px0 supports **GitHub**, **GitLab** (gitlab.com and self-hosted), **Gitea / Forgejo / Codeberg**, and **Bitbucket Cloud** using the same unified interface and keyboard shortcuts.

### Prerequisites

- `git` installed on your machine.
- For AI-assisted conflict resolution, AI commit messages, and batch-applying comments: a local coding harness supported by px0 (Claude Code, Gemini CLI, Cursor Agent, Codex, Antigravity, and others). All review, diffing, and manual editing features work completely without a harness.

---

## 1. Open the Pull Request

Copy the pull request or merge request URL from your browser and pass it directly to `px0`:

```bash
# GitHub
px0 https://github.com/owner/repo/pull/123

# GitLab (gitlab.com or self-hosted)
px0 https://gitlab.com/group/project/-/merge_requests/45

# Gitea / Forgejo / Codeberg
px0 https://codeberg.org/owner/repo/pulls/7

# Bitbucket Cloud
px0 https://bitbucket.org/workspace/repo/pull-requests/9
```

px0 checks out the PR into a temporary worktree and opens it in your default browser. When executed from inside a local clone of the repository, px0 attaches an isolated `git worktree` to that clone rather than downloading full Git history again.

You can also open PRs from the [Review Workbench](/docs/guides/review-workbench) or from inside an active px0 session by pressing `Cmd/Ctrl+K` and choosing **Git: Open Pull Request...**.

> [!NOTE]
> The checkout is an isolated worktree. It is cleanly removed when px0 terminates, so be sure to push any commits you wish to keep back to the PR branch.

---

## 2. Connect Your Forge

You can read public pull requests without authentication. To draft inline comments, submit reviews, push commits, or execute merges, px0 requires an access token.

### Quick Connect Modal

Click **No &lt;forge&gt; token - click to connect** in the top PR bar. The Connect dialog provides direct links to your forge's token creation page, describes required permissions, and validates the token immediately upon pasting. The token is saved to your configuration without requiring a restart.

### Forge-Specific Token Setup

#### GitHub
1. Open [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) (fine-grained token).
2. Set a name (e.g. `px0`) and expiration.
3. Under **Repository access**, select the repositories you review, or **All repositories**.
4. Under **Repository permissions**, configure **Contents** and **Pull requests** to **Read and write**.
5. Generate the token and paste it into px0.
- If you use the GitHub CLI, running `gh auth login` allows px0 to discover your token automatically. `GITHUB_TOKEN` and `GH_TOKEN` environment variables are also respected.

#### GitLab
1. Open **User settings -> Access tokens** on your GitLab instance (or [gitlab.com/-/user_settings/personal_access_tokens](https://gitlab.com/-/user_settings/personal_access_tokens)).
2. Select **Add new token**, set a name, and choose an expiration date.
3. Under **Select scopes**, check **`api`**.
4. Generate the token and paste it into px0.
- For self-hosted instances, the Connect dialog records the target hostname (`gitlab.host`) and sends credentials only to that host. If you use the GitLab CLI, `glab auth login --hostname <your-gitlab>` tokens are discovered automatically.

#### Gitea, Forgejo, and Codeberg
1. Open **Settings -> Applications** on your instance (or [codeberg.org/user/settings/applications](https://codeberg.org/user/settings/applications)).
2. Under **Generate new token**, provide a name.
3. Under **Select permissions**, set **repository** and **issue** to **Read and write**.
4. Generate the token and paste it into px0.
- The target instance hostname is saved under `gitea.host` in settings.

#### Bitbucket Cloud
Bitbucket offers two token types. To approve and merge, use an **API token**:
1. Open [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens).
2. Choose **Create API token with scopes**, provide a label, and pick an expiry.
3. Select **Bitbucket** as the application.
4. Grant read and write permissions to repositories and pull requests, and read access to your account.
5. Paste the token into px0 along with your **Atlassian account email**.
- Standard repository, project, or workspace access tokens can also be used (leave the email empty). However, access tokens cannot verify push permissions in Bitbucket, keeping **Approve** and **Merge** disabled.

---

## 3. Review Code & Leave Comments

- **Inspect merge-base diffs**: The sidebar **Changes** filter lists all files touched by the PR. Press `Cmd/Ctrl+D` on any file to toggle side-by-side or unified diffs calculated against the merge base. Full-codebase search and Go to Definition (`F12`) remain available across untouched files.
- **Draft inline comments**: Select lines of code and press `Alt+R` (or hover a line number and click **Add Review Comment**). Comment drafts are saved persistently in `$XDG_STATE_HOME/px0/pr-sessions/` keyed to the PR ID, surviving restarts.
- **Read discussion threads**: The bottom **Comments** panel shows existing inline comments and discussion threads; reply directly in place.
- **Submit your review**: Enter an optional summary in the PR bar, then click **Submit Review**, **Request Changes**, or **Approve**.

---

## 4. Fix Code and Batch Apply Changes

Because the review runs in a genuine Git worktree, you can make fixes directly:

- Edit files in your browser with `Cmd/Ctrl+E` and save with `Cmd/Ctrl+S`.
- Use **`⚡ Batch Apply`** in the PR bar to dispatch all drafted comments to your local AI coding harness simultaneously.
- Stage changes in the Git panel, generate a commit message with **Commit with AI**, and click **Commit**.
- Click **Push** to send commits straight to the PR's source branch, even if the PR originated from a fork.
- Click **Pull** to fast-forward remote commits pushed by others during review.

---

## 5. Bring PRs Up to Date & Resolve Conflicts

When the upstream base branch has moved ahead, the PR status pill displays **Behind main** or **Conflicts with main**, and the merge button updates to **Update branch** or **Resolve conflicts**:

1. Click **Resolve conflicts** (or **Update branch**).
2. px0 fetches the base branch and presents two agent-assisted strategies in the Git panel:
   - **Rebase with AI**: Replays the PR commits on top of the updated base branch for a clean, linear history.
   - **Merge with AI**: Joins the branches by creating a merge commit.
3. Your local coding harness resolves conflict markers and stages the files. The harness is instructed never to push automatically.
4. Review the resolution in the diff viewer.
5. For merges, click standard **Push to PR**. For rebases, click **Force-push**. px0 uses `git push --force-with-lease` to ensure concurrent commits pushed by others are never overwritten.

---

## 6. Merge the Pull Request

When the status pill indicates **Ready to merge**, use the split button next to Approve:

1. Click the dropdown caret to pick a merge method:
   - **Create a merge commit**: Creates a two-parent merge commit on the base branch.
   - **Squash and merge**: Combines all PR commits into a single commit on the base branch.
   - **Rebase and merge**: Fast-forwards PR commits linearly onto the base branch.
2. In the merge dialog, edit the commit title and message. Click **Rewrite with AI** to synthesize an informative summary from the PR diff and commit history.
3. Click **Confirm**. px0 executes the merge pinned to the exact commit you reviewed.

---

## Troubleshooting

| Issue | Cause | Resolution |
| :--- | :--- | :--- |
| *Forge didn't accept this token* | Token expired or lacks necessary repository permissions. | Generate a new token with the required permissions listed in Step 2. |
| *404 Not Found* opening private PR | Missing token or token cannot access the repository. | Connect your token in Settings or set environment variables before launching px0. |
| Missing **Approve** / **Merge** buttons | Token lacks push/write permissions to the target repository. | Use an account with write access. On Bitbucket Cloud, supply an API token with your account email. |
| Self-hosted GitLab/Gitea token not recognized | Token is registered for a different host. | Verify `gitlab.host` or `gitea.host` in Settings matches the target instance domain. |
| *The PR has new commits since checkout* | Remote branch received updates during your review. | Click **Pull** in the Git panel, review the incoming changes, and proceed. |
| *Diff base unresolved* | Unable to fetch the target base branch ref. | Verify token read permissions and click **Pull** to retry fetching refs. |
