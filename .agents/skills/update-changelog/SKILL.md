---
name: update-changelog
description: >-
  Update or create changelog files for a px0 release version from git commits in ../px0.
  Use this skill whenever a new version of px0 is released, or when asked to update,
  generate, or add release notes and changelog entries.
---

# Update Changelog

This skill extracts git commits from the `../px0` repository for a given version or release tag, organizes the changes into crisp bullet points categorized by feature area, and creates a new version file in `src/data/changelog/v<version>.json`.

## Overview of Changelog Files

Each version release is represented as an individual JSON file in:
`src/data/changelog/v<version>.json`

File schema:
```json
{
  "version": "0.1.2",
  "tag": "v0.1.2",
  "date": "YYYY-MM-DD",
  "title": "Short descriptive title of the release",
  "summary": "Crisp overview sentence describing what this release delivers.",
  "commitCount": 8,
  "commitRange": "v0.1.1..v0.1.2",
  "categories": [
    {
      "name": "Features",
      "items": [
        "Crisp bullet point describing the change"
      ]
    }
  ]
}
```

## Step-by-Step Procedure

1. **Determine the target version and commit range:**
   - Check existing tags in `../px0`:
     ```bash
     cd ../px0 && git tag -l --sort=-v:refname
     ```
   - Identify the previous tag (e.g. `v0.1.1`) and target tag/commit (e.g. `v0.1.2` or `HEAD`).

2. **Generate or extract the release commits:**
   - You can run the automation script:
     ```bash
     node .agents/skills/update-changelog/scripts/generate-changelog.mjs <version> [from_ref] [to_ref]
     ```
     For example:
     ```bash
     node .agents/skills/update-changelog/scripts/generate-changelog.mjs 0.1.3 v0.1.2 HEAD
     ```
   - Alternatively, inspect the git log directly:
     ```bash
     cd ../px0 && git log --reverse --format="%h | %ad | %s%n%b" v0.1.1..v0.1.2
     ```

3. **Curate and polish the bullet points:**
   - Open the generated `src/data/changelog/v<version>.json`.
   - Ensure the points are concise, active-voice, and grouped logically:
     - **Features**: New user-facing or architectural capabilities.
     - **Improvements**: Performance optimizations, UX enhancements, and refactorings.
     - **Fixes**: Bug fixes, crash preventions, and collision resolutions.
     - **Documentation**: Docs reorganization, new guides, architecture notes.
   - Do NOT use em dashes anywhere in titles, summaries, or bullet points. Use standard hyphens (-) or colons (:).

4. **Update latest version in links data (if bumping the active release):**
   - If this is the new latest release, update `export const VERSION = "<version>";` in `src/data/links.ts`.

5. **Verify the website build:**
   - Run:
     ```bash
     npm run build
     ```
   - Verify `/changelog` and the landing page hero announcement pill display the updated version accurately.
