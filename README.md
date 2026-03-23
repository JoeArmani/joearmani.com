# joearmani.com

Personal website and blog. Built with [Astro](https://astro.build), hosted on [Cloudflare Pages](https://pages.cloudflare.com).

## Stack

- **Framework:** Astro 6 (static output, zero runtime JS)
- **Styling:** Vanilla CSS with custom properties, dark/light themes
- **Fonts:** Plus Jakarta Sans, DM Sans, JetBrains Mono (self-hosted)
- **Newsletter:** [Buttondown](https://buttondown.com)
- **Comments:** [Giscus](https://giscus.app) (GitHub Discussions)
- **Content:** Markdown via Astro Content Collections

## Development

```bash
npm install
npm run dev        # localhost:4321
npm run build      # static build to dist/
npm test           # 59 tests
```

## Project Structure

```
src/
  components/    # Nav, Hero, PostCard, ProjectCard, Subscribe, etc.
  content/       # Blog posts and project entries (Markdown)
  layouts/       # BaseLayout, PostLayout
  pages/         # Routes: /, /blog, /projects, /uses, /about, /subscribe, /now
  styles/        # global.css (design system, both themes)
public/
  fonts/         # Self-hosted WOFF2 files
  favicon.svg
tests/
  site.test.js   # Structural, content, design system, regression tests
```
