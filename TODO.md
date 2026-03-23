# joearmani.com — Launch Checklist

> Track everything between now and go-live. Check items off as completed.

---

## Content

- [ ] **Write first blog post** — `content/blog/from-woodshop-to-code.md` has the outline. Needs 1500–2000 words in your voice. This is the single most important pre-launch item.
- [x] **Set blog post to draft until written** — Set to `draft: true` so placeholder content won't show on the live site.
- [ ] **Voice & tone pass** — Review all static copy (hero, about, subscribe page, project descriptions) with Claude to dial in your personal voice. Develop a reusable voice/tone skill so future content stays consistent.
- [ ] **Add headshot / profile photo** — Place in `public/images/`, consider adding to About page and/or homepage hero. Ensure `alt` text is set.
- [ ] **Review project descriptions** — Read through all four project pages in the browser. Flag anything that feels stale or needs updating.

---

## Accessibility (a11y)

- [x] **Skip-to-content link** — Visually hidden link in BaseLayout, appears on focus, jumps to `#main-content`.
- [x] **Custom focus styles** — `:focus-visible` outlines on all interactive elements with blue ring + offset.
- [x] **`prefers-reduced-motion` support** — All animations and transitions disabled when user has motion reduced.
- [x] **Card focus states** — `:focus-within` on `.card` matches hover lift/shadow effect.
- [x] **`aria-current="page"` on nav** — Active nav link now has `aria-current="page"` for screen readers.
- [x] **Keyboard-accessible tag filter** — Tag filter buttons have `:focus-visible` styles.
- [x] **Color contrast fix** — All text passes WCAG AA 4.5:1. `--text-muted` → `#7D8590` (5.0:1), tag/badge text → `--accent-blue-hover`, button bg → `#2563EB` (4.6:1 with white).
- [x] **Mobile nav Escape key** — Pressing Escape closes the mobile menu and returns focus to hamburger button.
- [x] **Nav ARIA labels** — `aria-label="Main navigation"` on `<nav>`, `aria-hidden="true"` on decorative SVG.
- [x] **Heading hierarchy audit** — All pages verified: one `<h1>` each, no skipped levels. Footer uses `<p>` instead of `<h4>`. Subscribe component uses `<p>` instead of `<h3>`. Card heading levels are props (h2 on listing pages, h3 when nested under h2).
- [x] **Lighthouse accessibility** — 100/100 on all pages (homepage, about, projects, blog, subscribe).
- [ ] **Image alt text policy** — When images are added, ensure all `<img>` tags have meaningful `alt` attributes. Decorative images get `alt=""`.
- [x] **Link purpose clarity** — Audited all link text across all pages. No vague links ("click here", "read more", etc.) found.

---

## Design & UX

- [x] **Full design review with Claude** — All pages reviewed at 320px, 640px, 1024px, 1440px. Fixed: scroll reveal no-JS safety, empty blog/homepage states, heading hierarchy, color contrast. Mobile hamburger close-on-outside-click added.
- [x] **Lighthouse audit** — All pages: Perf 94+ | A11y 100 | Best Practices 100 | SEO 100. Performance dips are from Google Fonts render-blocking (expected).
- [ ] **Favicon renders** — Verify "JA" monogram shows in browser tab across browsers.
- [ ] **OG image** — Create a default Open Graph image (1200×630) for social sharing. Add to `public/images/` and wire into BaseLayout `ogImage` prop.
- [x] **404 page** — Created at `src/pages/404.astro` with styled message and link home.
- [x] **Fix empty GitHub link on Agentic Dev System** — ProjectCard and project detail page now skip empty link strings.

---

## SEO

- [x] **`robots.txt`** — Created at `public/robots.txt`, allows all crawlers, points to sitemap.
- [x] **JSON-LD structured data** — Implemented:
  - [x] `WebSite` schema on homepage
  - [x] `Person` schema on about page
  - [x] `BlogPosting` schema on each blog post
- [x] **`<meta name="author">`** — Added to BaseLayout head.
- [x] **Sitemap verification** — Valid XML, 10 URLs, all pages included.
- [x] **RSS feed verification** — Valid XML structure. Currently 0 items (blog post is draft). Items will appear when posts are published.
- [x] **Canonical URLs** — Verified correct on all 8 page types.
- [x] **OG tags verification** — og:title, og:description, og:type, og:url, og:site_name all render correctly on every page.
- [ ] **Default OG image** — See Design section above.

---

## Social & Newsletter

- [ ] **Verify Buttondown integration** — Submit a test email on the live site, confirm it arrives in Buttondown dashboard.
- [ ] **Social media links audit** — Currently in footer:
  - [x] LinkedIn — `linkedin.com/in/joseph-armani/` ✓
  - [x] GitHub — `github.com/JoeArmani` ✓
  - [x] Email — `joe@joearmani.com` ✓
  - [ ] Twitter/X — Add if you have an account or plan to create one
  - [ ] Bluesky — Add if applicable
- [x] **Subscribe form spam protection** — Honeypot field added to both Subscribe component and subscribe page form.
- [x] **Privacy note** — Added to subscribe page: "Your email is only used to send the newsletter and is never shared."

---

## Infrastructure & Deployment

- [x] **Create `.gitignore`** — Covers `node_modules/`, `dist/`, `.astro/`, `.env`, `.DS_Store`, editor files.
- [ ] **Initialize git repo** — `git init`, initial commit.
- [ ] **Push to GitHub** — Create repo under `JoeArmani` account, push.
- [ ] **Transfer domain to Cloudflare** — Move joearmani.com nameservers to Cloudflare (free plan).
- [ ] **Set up Cloudflare Email Routing** — Forward `joe@joearmani.com` to personal Gmail.
- [ ] **Configure Gmail "Send as"** — So you can reply from `joe@joearmani.com` via Gmail.
- [ ] **Connect Cloudflare Pages** — Link GitHub repo, set build command (`npm run build`), output dir (`dist`), Node 22+.
- [ ] **Configure `www` → apex redirect** — Redirect `www.joearmani.com` to `joearmani.com` in Cloudflare.
- [ ] **Verify custom domain** — Confirm `joearmani.com` resolves to Cloudflare Pages with HTTPS.
- [ ] **Enable Cloudflare Web Analytics** — Free with CF Pages. Add token to BaseLayout if snippet needed.

---

## Post-Launch

- [ ] **Submit sitemap to Google Search Console**
- [ ] **Test all internal links** — Click through every nav link, card, project link, blog link on the live site.
- [ ] **Cross-browser check** — Verify in Chrome, Firefox, Safari, and mobile Safari/Chrome.
- [ ] **Share launch post** — LinkedIn, GitHub profile README, etc.
- [ ] **Monitor analytics** — Check Cloudflare Web Analytics after first week.

---

## Future Enhancements (Post-Launch)

- [x] Light/dark mode toggle — implemented with system preference detection, localStorage persistence, no flash on load
- [ ] Blog post search
- [ ] Reading progress bar on blog posts
- [ ] "Uses" page (tech stack / tools)
- [ ] Speaking / appearances page (if applicable)
- [ ] Automated social image generation per blog post
- [ ] Breadcrumb navigation for SEO
- [ ] Last-modified dates on blog posts

---

*Last updated: 2026-03-19*
