# px0 web

Source for [px0.ai](https://px0.ai) - the landing page for [px0](https://github.com/px0-ai/px0), the Open Source Prompt Infrastructure.

## Getting started

Make sure you have Node.js 22+ installed, then install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`. The dev server supports hot reload, so changes to components and styles reflect instantly.

## Building for production

```bash
npm run build
```

Output is written to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Project structure

```
src/
  components/   # Nav, Hero, Features, Footer
  data/         # Shared constants (links, URLs)
  layouts/      # Base HTML layout
  pages/        # index.astro
  styles/       # global.css
public/         # Favicons and static assets
```

## Stack

- [Astro](https://astro.build) - static site generator
- Vanilla CSS with CSS custom properties
- No JS frameworks - interactive bits use plain script tags

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
