# joearmani.com — Launch Checklist

> Track everything between now and go-live. Check items off as completed.

---

## Content

- [ ] **Write first blog post** — `content/blog/from-woodshop-to-code.md` has the outline. Needs 1500-2000 words in your voice. This is the single most important pre-launch item.
- [x] **Set blog post to draft until written** — Set to `draft: true` so placeholder content won't show on the live site.
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

- [x] **Full design review** — Deep review completed. Implemented: hero height reduction (80vh cap, scroll indicator removed), homepage section reorder (Subscribe above Projects), About page restructured with section headings, section gap tightened (6rem to 5rem), subscribe card warm accent, footer tagline added.
- [x] **Lighthouse audit** — Perf 94+ | A11y 100 | Best Practices 100 | SEO 100.
- [x] **Fonts self-hosted** — Plus Jakarta Sans, DM Sans, JetBrains Mono downloaded as WOFF2, Google Fonts links removed. Eliminates render-blocking external requests.
- [x] **Theme-color meta tags** — Mobile browser chrome matches site theme (dark #0F1117, light #FFFFFF).
- [x] **Nav styling fixed** — Links use `--text-primary` for better dark mode readability. Subscribe button changed to outline style.
- [x] **Email input contrast fixed** — Visible border (`--border`), off-white background in light mode.
- [x] **Hero pre-tagline sized up** — `font-size: 1rem`, removed decorative `>` arrow.
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
- [ ] **Initialize git repo** — `git init`, initial commit.
- [ ] **Push to GitHub** — Create `joeArmani/joearmani.com` repo (public), push.
- [ ] **Transfer domain to Cloudflare** — Move joearmani.com nameservers to Cloudflare (free plan).
- [ ] **Set up Cloudflare Email Routing** — Forward `joe@joearmani.com` to personal Gmail.
- [ ] **Configure Gmail "Send as"** — Reply from `joe@joearmani.com` via Gmail.
- [ ] **Connect Cloudflare Pages** — Link GitHub repo, build command `npm run build`, output dir `dist`, Node 22+.
- [ ] **Configure `www` redirect** — Redirect `www.joearmani.com` to `joearmani.com`.
- [ ] **Verify custom domain** — Confirm `joearmani.com` resolves to Cloudflare Pages with HTTPS.
- [ ] **Enable Cloudflare Web Analytics** — Inject token via CF Pages environment variable, not hardcoded.

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
- [ ] Blog post search
- [ ] Speaking / appearances page (if applicable)
- [ ] Automated social image generation per blog post
- [ ] Breadcrumb navigation for SEO
- [ ] Last-modified dates on blog posts

---

## Test Suite

59 tests covering structure, content integrity, components, design system, and regressions. Run with:

```bash
npm test
```

---

*Last updated: 2026-03-22*
