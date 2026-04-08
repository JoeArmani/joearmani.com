# joearmani.com

Personal website and blog. Built with [Astro](https://astro.build), deployed on [Cloudflare Workers](https://developers.cloudflare.com/workers/) with static assets.

## Stack

- **Framework:** Astro 6 (static output, zero runtime JS)
- **Styling:** Vanilla CSS with custom properties, dark/light themes
- **Fonts:** Plus Jakarta Sans, DM Sans, JetBrains Mono (self-hosted)
- **Newsletter:** [Buttondown](https://buttondown.com)
- **Comments:** [Giscus](https://giscus.app) (GitHub Discussions)
- **Content:** Markdown via Astro Content Collections
- **Deployment:** Cloudflare Worker custom domains with a `www -> apex` redirect

## Development

```bash
npm install
npm run dev        # localhost:4321
npm run build      # static build to dist/
npm run check      # Astro type/content checks
npm test           # source + link validation
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
  site.test.js   # Structural, content, design system, and regression tests
worker/
  index.js       # Cloudflare Worker entry for www -> apex host normalization
```

## Deployment

- `npm run build` generates the static site into `dist/`
- `npx wrangler deploy` publishes the Worker and static assets
- `worker/index.js` permanently redirects `https://www.joearmani.com/*` to `https://joearmani.com/*`
- `wrangler.jsonc` owns the apex, `www`, and `workers.dev` routes
