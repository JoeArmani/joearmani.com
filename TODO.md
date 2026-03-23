# joearmani.com — Launch Checklist

> Track everything between now and go-live. Check items off as completed.

---

## Content

- [x] **Write first blog post** — "From Woodshop to Code" published. ~2,000 words, written with voice skill, covers career arc from Etsy order to AI engineering.
- [x] **Set blog post to draft until written** — Published (`draft: false`).
- [x] **Voice & tone pass** — All static copy reviewed and rewritten. Brand voice skill created (`joe-armani-content`) with shared reference files for consistent future content.
- [ ] **Add headshot / profile photo** — Place in `public/images/`, add to About page. Ensure `alt` text is set.
- [x] **Review project descriptions** — All four project pages reviewed and current.

---

## Accessibility (a11y)

- [x] **Skip-to-content link** — Visually hidden link in BaseLayout, appears on focus, jumps to `#main-content`.
- [x] **Custom focus styles** — `:focus-visible` outlines on all interactive elements with blue ring + offset.
- [x] **`prefers-reduced-motion` support** — All animations and transitions disabled when user has motion reduced.
- [x] **Card focus states** — `:focus-within` on `.card` matches hover lift/shadow effect.
- [x] **`aria-current="page"` on nav** — Active nav link now has `aria-current="page"` for screen readers.
- [x] **Keyboard-accessible tag filter** — Tag filter buttons have `:focus-visible` styles.
- [x] **Color contrast fix** — All text passes WCAG AA 4.5:1. `--text-muted` #7D8590 (5.0:1), tag/badge text `--accent-blue-hover`, button bg #2563EB (4.6:1 with white).
- [x] **Mobile nav Escape key** — Pressing Escape closes the mobile menu and returns focus to hamburger button.
- [x] **Nav ARIA labels** — `aria-label="Main navigation"` on `<nav>`, `aria-hidden="true"` on decorative SVG.
- [x] **Heading hierarchy audit** — All pages verified: one `<h1>` each, no skipped levels.
- [x] **Lighthouse accessibility** — 100/100 on all pages.
- [ ] **Image alt text policy** — When images are added, ensure all `<img>` tags have meaningful `alt` attributes. Decorative images get `alt=""`.
- [x] **Link purpose clarity** — Audited all link text. No vague links found.

---

## Design & UX

- [x] **Full design review** — Deep review completed. Hero height reduced (80vh cap, scroll indicator removed), homepage sections consolidated (smart Start Here logic, Subscribe as conclusion CTA), About page restructured, section gap 8rem, subscribe card warm accent, footer tagline.
- [x] **Light mode overhaul** — Off-white page background (#F8F9FB) with white card surfaces for depth. Resting card shadows, stronger hero gradients, brighter accents, increased tag/border contrast.
- [x] **Lighthouse audit** — Perf 94+ | A11y 100 | Best Practices 100 | SEO 100.
- [x] **Fonts self-hosted** — Plus Jakarta Sans, DM Sans, JetBrains Mono as WOFF2, Google Fonts links removed.
- [x] **Theme-color meta tags** — Mobile browser chrome matches site theme (dark #0F1117, light #F8F9FB).
- [x] **Nav styling fixed** — Subscribe is now a regular nav link (no box). All links use `--text-primary`.
- [x] **Email input contrast fixed** — Visible border (`--border`), off-white background in light mode.
- [x] **Hero pre-tagline sized up** — `font-size: 1rem`, removed decorative `>` arrow.
- [x] **Subscribe page redesigned** — Reuses Subscribe component for consistent styling with homepage.
- [x] **Mobile blog padding** — Added horizontal padding to `.prose` for mobile readability.
- [ ] **Favicon renders** — Verify "JA" monogram shows in browser tab across browsers.
- [ ] **OG image** — Create a default Open Graph image (1200x630) for social sharing. Add to `public/images/` and wire into BaseLayout `ogImage` prop.
- [x] **404 page** — Created with styled message and helpful CTAs.
- [x] **Fix empty GitHub link on Agentic Dev System** — ProjectCard skips empty link strings.

---

## SEO

- [x] **`robots.txt`** — Allows all crawlers, points to sitemap.
- [x] **JSON-LD structured data** — WebSite (homepage), Person (about), BlogPosting (posts).
- [x] **`<meta name="author">`** — Added to BaseLayout head.
- [x] **Sitemap** — Valid XML, all pages included.
- [x] **RSS feed** — Valid XML. Items appear when posts are published.
- [x] **Canonical URLs** — Correct on all page types.
- [x] **OG tags** — og:title, og:description, og:type, og:url, og:site_name on every page.
- [ ] **Default OG image** — See Design section above.

---

## Social & Newsletter

- [ ] **Verify Buttondown integration** — Submit a test email on the live site, confirm it arrives in Buttondown dashboard.
- [x] **Giscus comments** — Configured with repo-id and category-id. Theme syncs with site dark/light toggle. Appears on blog posts via PostLayout.
- [ ] **Social media links audit**:
  - [x] LinkedIn, GitHub, Email in footer
  - [ ] Twitter/X — Add if applicable
  - [ ] Bluesky — Add if applicable
- [x] **Subscribe form spam protection** — Honeypot field on both forms.
- [x] **Privacy note** — On subscribe page.

---

## Infrastructure & Deployment

- [x] **`.gitignore`** — Covers node_modules, dist, .astro, .env, .DS_Store, .claude, editor files.
- [x] **Security audit** — Full scan for secrets/keys/tokens. Clean. No credentials in source.
- [x] **Initialize git repo** — Initial commit created.
- [x] **Push to GitHub** — Repo at `joeArmani/joearmani.com` (public), pushed.
- [x] **Transfer domain to Cloudflare** — Nameservers moved from Bluehost to Cloudflare (free plan). Domain active.
- [x] **Set up Cloudflare Email Routing** — `joe@joearmani.com` forwards to personal Gmail.
- [x] **Configure Gmail "Send as"** — Reply from `joe@joearmani.com` via Gmail, Apple Mail, and Gmail app.
- [x] **Connect Cloudflare Pages** — GitHub repo linked, static build via wrangler.jsonc, auto-deploys on push.
- [x] **Configure `www` redirect** — `www.joearmani.com` redirects to `joearmani.com`.
- [x] **Verify custom domain** — `joearmani.com` live on Cloudflare Pages with HTTPS. SSL Full (strict).
- [x] **Enable Cloudflare Web Analytics** — Auto-injected via Cloudflare Pages.
- [x] **Dark mode default** — First-time visitors always see dark mode. Toggle persists via localStorage.

---

## Post-Launch

- [ ] **Submit sitemap to Google Search Console**
- [ ] **Test all internal links** — Click through every link on the live site.
- [ ] **Cross-browser check** — Chrome, Firefox, Safari, mobile Safari/Chrome.
- [ ] **Share launch post** — LinkedIn, GitHub profile README.
- [ ] **Monitor analytics** — Check Cloudflare Web Analytics after first week.

---

## Future Enhancements (Post-Launch)

- [x] Light/dark mode toggle
- [x] Reading progress bar on blog posts
- [x] "Uses" page (tech stack / tools) with contextual descriptions
- [x] /now page
- [x] Blog post search — client-side search on /blog, filters by title/description/tags, works with tag filter simultaneously.
- [ ] Speaking / appearances page (if applicable)
- [ ] Automated social image generation per blog post
- [x] Breadcrumb navigation for SEO — Breadcrumbs component with BreadcrumbList JSON-LD schema on all subpages.
- [x] Last-modified dates on blog posts — `lastModified` field in schema, displayed in post header, included in BlogPosting JSON-LD as `dateModified`.
- [x] Internal link validation — `tests/links.test.js` scans all source files for broken internal links.

---

## Test Suite

95 tests (83 main + 12 link validation) covering structure, content integrity, components, design system, regressions, and post-launch features. Run with:

```bash
npm test
```

---

*Last updated: 2026-03-23*
