## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Content Collections Guidelines

All documentation, learning materials, and blog articles are managed as Astro Content Collections defined in `src/content.config.ts`. When creating or editing content, agents must adhere to the following taxonomy:

### Taxonomy & Placement Rules

1. **`src/content/docs/` (How-To Guides, Walkthroughs & Technical Reference)**
   - Subdirectories: `getting-started/`, `guides/`, `reference/`
   - Purpose: Problem-oriented how-to guides, walkthroughs, and factual technical reference (CLI flags, shortcuts, configuration).
   - Required frontmatter:
     ```yaml
     ---
     title: "Article Title"
     description: "Concise summary of the guide"
     category: "getting-started" # or "guides", "reference"
     order: 1 # integer sorting order
     ---
     ```

2. **`src/content/blog/` (Engineering Notes, Deep Dives & Announcements)**
   - Location: `src/content/blog/*.md`
   - Purpose: Systems architecture deep dives, benchmark analyses, design philosophy, and release announcements.
   - Required frontmatter:
     ```yaml
     ---
     title: "Post Title"
     description: "Summary of the article"
     pubDate: 2026-09-15
     author: "px0 team"
     tags: ["architecture", "performance"]
     draft: false
     ---
     ```

## Style

- Do not use em dashes.
- Keep code snippets copy-pasteable with explicit language tags.
- Emphasize px0's read-only guarantees and low resource footprint.
