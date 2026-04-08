# Joe Armani Personal Website — Build Specification

> Historical build specification used during the initial development of joearmani.com.
>
> Kept in the public repo for context. The live source code is the authoritative implementation, and some detailed sections below reflect the original build plan rather than the current state of the site.

---

## 1. Project Overview & Identity

### Who Is Joe Armani?

Joe Armani is a senior software engineer, AI/ML practitioner, and former business owner building a public body of work around agentic development, applied AI, and production-minded engineering.

**Career arc:** Ran a woodworking/ecommerce factory for ~8 years → pivoted to software engineering → B.S. in Computer Science (Summa Cum Laude, CSU Global, 2021) → built and shipped a mobile app (Racquet Rivalry) → Senior Software Engineer contracting to the National Cancer Institute on the Connect for Cancer Prevention Study (via Cirrus Lake Solutions) → Master's in AI/ML (CSU Global, 4.0 GPA) → currently focused on agentic AI development, applied ML, and building a durable body of technical work.

**Current work:** By day, full-stack JS/GCP/Firestore development for NCI across 4 repos. By night, building a multi-agent development system, rebuilding Racquet Rivalry with AI-augmented tools, developing a privacy-focused news app, and building an RL trading environment for EMini futures.

### Positioning

**One-liner:** "Building with AI and writing about what actually works."

**Tagline:** "AI practitioner. Builder. Entrepreneur."

**Voice:** Approachable technical depth — like explaining something complex to a smart friend over coffee. Never academic jargon for its own sake, never dumbed down. First person. Confident but not arrogant. Shows the work.

### Audience (priority order)

1. **Developers and engineers** interested in AI-augmented development, agentic workflows, and practical ML
2. **Potential employers and collaborators** evaluating Joe for senior or lead roles, partnerships, or consulting work
3. **AI-curious professionals** who want practitioner insights, not hype

### Brand

- **Public name:** Joe Armani
- **Formal name:** Joseph Armani (credentials, about page legal references)
- **Domain:** joearmani.com
- **Social:** LinkedIn (primary), GitHub, email

---

## 2. Technical Specification

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 6.x (static output, zero JS by default) |
| Content | Markdown with Astro Content Collections |
| Styling | Vanilla CSS with custom properties (no Tailwind) |
| Code highlighting | Shiki (built into Astro), theme: `github-dark-dimmed` |
| Fonts | Self-hosted: Plus Jakarta Sans, DM Sans, JetBrains Mono |
| Hosting | Cloudflare Workers static assets + custom domains |
| Analytics | Cloudflare Web Analytics (free) or Plausible |
| Newsletter | Buttondown (embed signup form) |

### Initialize the Project

```bash
cd joearmani.com
npm create astro@latest . -- --template minimal --install --no-git
```

Then install dependencies:
```bash
npx astro add sitemap
npm install @astrojs/rss
```

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://joearmani.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
```

### Project Structure

Original planned file and directory structure during the first build. The current repository may differ.

```
joearmani.com/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro        # HTML shell, head, nav, footer, meta
│   │   └── PostLayout.astro        # Blog post wrapper (extends BaseLayout)
│   ├── components/
│   │   ├── Nav.astro               # Sticky nav
│   │   ├── Footer.astro            # Three-column footer
│   │   ├── Hero.astro              # Homepage hero section
│   │   ├── PostCard.astro          # Blog post preview card
│   │   ├── ProjectCard.astro       # Project feature card
│   │   ├── Subscribe.astro         # Email capture block (reusable)
│   │   ├── TagList.astro           # Renders tag pills
│   │   └── ScrollReveal.astro      # IntersectionObserver fade-in wrapper
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── about.astro             # About page
│   │   ├── subscribe.astro         # Newsletter landing page
│   │   ├── blog/
│   │   │   ├── index.astro         # Blog listing with tag filter
│   │   │   └── [...slug].astro     # Dynamic post route
│   │   ├── projects/
│   │   │   ├── index.astro         # Projects listing
│   │   │   └── [...slug].astro     # Dynamic project route
│   │   └── rss.xml.js              # RSS feed
│   ├── content/
│   │   └── config.ts               # Content collection schemas
│   └── styles/
│       └── global.css              # Complete design system
├── content/
│   ├── blog/
│   │   └── from-woodshop-to-code.md
│   └── projects/
│       ├── agentic-dev-system.md
│       ├── racquet-rivalry.md
│       ├── rl-trading.md
│       └── connect-for-cancer.md
├── public/
│   ├── favicon.svg
│   └── images/
│       └── .gitkeep
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

### Content Collection Schemas (src/content/config.ts)

```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(), // minutes
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['Active', 'Shipped', 'Rebuilding', 'Research', 'Ongoing']),
    tags: z.array(z.string()),
    order: z.number(), // display order
    featured: z.boolean().default(false),
    links: z.object({
      github: z.string().optional(),
      live: z.string().optional(),
      appStore: z.string().optional(),
      playStore: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog, projects };
```

### Valid Tag Taxonomy

Use only these tags for blog posts to keep taxonomy clean:

- `ai-ml`
- `agentic-development`
- `build-in-public`
- `engineering`
- `career`
- `product-development`
- `reinforcement-learning`
- `web-development`

---

## 3. Design System (global.css)

### Color Palette — Dark Mode

```css
:root {
  /* Backgrounds */
  --bg-primary: #0F1117;
  --bg-surface: #161B22;
  --bg-surface-hover: #1C2333;
  --bg-code: #0D1117;

  /* Text */
  --text-primary: #E6EDF3;
  --text-secondary: #8B949E;
  --text-muted: #484F58;

  /* Accents */
  --accent-blue: #3B82F6;
  --accent-blue-hover: #60A5FA;
  --accent-amber: #F59E0B;
  --accent-green: #22C55E;

  /* Borders */
  --border: #21262D;
  --border-light: #30363D;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);

  /* Typography */
  --font-heading: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --font-code: 'JetBrains Mono', monospace;

  /* Spacing */
  --section-gap: 6rem;
  --content-width: 720px;
  --page-width: 1200px;
  --nav-height: 64px;

  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.6s ease;

  /* Border radius */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
}
```

### Typography Rules

```css
/* Import fonts in <head> of BaseLayout.astro via Google Fonts link tag: */
/* Plus Jakarta Sans:wght@700 */
/* DM Sans:wght@400;500 */
/* JetBrains Mono:wght@400 */

body {
  font-family: var(--font-body);
  font-size: 1.065rem;   /* ~17px */
  line-height: 1.75;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-primary);
}

h1 { font-size: 2.5rem; margin-bottom: 1rem; }
h2 { font-size: 1.75rem; margin-top: 2.5rem; margin-bottom: 0.75rem; }
h3 { font-size: 1.25rem; margin-top: 2rem; margin-bottom: 0.5rem; }

/* Blog post prose max width */
.prose { max-width: var(--content-width); margin: 0 auto; }
.prose p { margin-bottom: 1.5rem; }
.prose a { color: var(--accent-blue); text-decoration: underline; text-underline-offset: 3px; }
.prose a:hover { color: var(--accent-blue-hover); }

/* Code blocks */
.prose pre {
  background: var(--bg-code);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  overflow-x: auto;
  font-family: var(--font-code);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 1.5rem 0;
}

.prose code:not(pre code) {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.15em 0.4em;
  font-family: var(--font-code);
  font-size: 0.875em;
}
```

### Layout Rules

```css
.container {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.container--narrow {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

section {
  padding: var(--section-gap) 0;
}

/* Responsive */
@media (max-width: 640px) {
  :root {
    --section-gap: 4rem;
  }
  h1 { font-size: 1.75rem; }
  h2 { font-size: 1.35rem; }
}
```

### Nav Styles

```css
/* Sticky nav, dark background, blur effect */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: rgba(15, 17, 23, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  z-index: 100;
  display: flex;
  align-items: center;
}

.nav__inner {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav__logo {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-primary);
  text-decoration: none;
}

.nav__links {
  display: flex;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav__links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.925rem;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.nav__links a:hover,
.nav__links a.active {
  color: var(--accent-blue);
}

/* Mobile: hamburger menu */
@media (max-width: 640px) {
  .nav__links { display: none; }
  /* Implement a simple hamburger toggle with JS island if needed */
}
```

### Card Styles

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-light);
}

.card__title {
  font-family: var(--font-heading);
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card__title a {
  color: var(--text-primary);
  text-decoration: none;
}

.card__title a:hover {
  color: var(--accent-blue);
}

.card__meta {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.card__excerpt {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}
```

### Tag Styles

```css
.tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.2em 0.65em;
  border-radius: 9999px;
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-blue);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.tag--amber {
  background: rgba(245, 158, 11, 0.1);
  color: var(--accent-amber);
  border-color: rgba(245, 158, 11, 0.2);
}
```

### Button Styles

```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  border-radius: var(--radius-sm);
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

.btn--primary {
  background: var(--accent-blue);
  color: white;
}

.btn--primary:hover {
  background: var(--accent-blue-hover);
}

.btn--outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-light);
}

.btn--outline:hover {
  border-color: var(--accent-blue);
  color: var(--accent-blue);
}
```

### Subscribe Block Styles

```css
.subscribe {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.subscribe__title {
  font-family: var(--font-heading);
  font-size: 1.35rem;
  margin-bottom: 0.5rem;
}

.subscribe__text {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.subscribe__form {
  display: flex;
  gap: 0.75rem;
  max-width: 420px;
  margin: 0 auto;
}

.subscribe__input {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-light);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
}

.subscribe__input::placeholder {
  color: var(--text-muted);
}

.subscribe__input:focus {
  outline: none;
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

@media (max-width: 480px) {
  .subscribe__form {
    flex-direction: column;
  }
}
```

### Scroll Reveal Animation

```css
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}
```

The ScrollReveal.astro component should use this JS (as an inline `<script>` tag):

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
```

### Footer Styles

```css
.footer {
  border-top: 1px solid var(--border);
  padding: 3rem 0;
  margin-top: var(--section-gap);
}

.footer__inner {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}

.footer__heading {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.footer__links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer__links li { margin-bottom: 0.5rem; }

.footer__links a {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color var(--transition-fast);
}

.footer__links a:hover { color: var(--accent-blue); }

.footer__copyright {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

@media (max-width: 640px) {
  .footer__inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

---

## 4. Page-by-Page Build Instructions

### BaseLayout.astro

Accepts props: `title` (string), `description` (string), `ogImage` (string, optional).

- `<head>`: charset, viewport, title tag, meta description, Google Fonts link, canonical URL, OG tags (og:title, og:description, og:type, og:url, og:site_name="Joe Armani"), Twitter card tags, favicon link, global.css link, Cloudflare Web Analytics snippet (placeholder comment for now).
- `<body>`: Nav component, `<main>` with `<slot />`, Footer component, ScrollReveal script.
- Add `padding-top: var(--nav-height)` to main to account for fixed nav.

### Nav.astro

- Left: "Joe Armani" as text logo linking to `/`
- Right: links to Blog (`/blog`), Projects (`/projects`), About (`/about`), and a Subscribe button styled as `btn--primary` linking to `/subscribe`
- Highlight the current page link using `Astro.url.pathname`
- Mobile: collapse links behind a hamburger button (simple JS toggle, no framework needed)

### Homepage (index.astro)

**Hero section (full viewport height minus nav):**
- Pre-heading: "AI Practitioner · Builder · Entrepreneur" — small, muted, uppercase tracking
- H1: "I build with AI and write about what actually works."
- Subtext: "Senior engineer at the National Cancer Institute. Master's in AI/ML. Former business owner. Currently exploring the frontier of agentic development, applied ML, and building products with AI."
- Two CTA buttons: "Read the Blog" (primary, links to /blog) and "About Me" (outline, links to /about)
- Subtle animated gradient mesh or noise texture as background (CSS only, no images)
- "Scroll" indicator at bottom with subtle bounce animation

**Latest Writing section:**
- H2: "Latest Writing"
- Display the 3 most recent non-draft blog posts as PostCard components
- "View All Posts →" link to /blog

**What I'm Building section:**
- H2: "What I'm Building"
- Display featured projects (where featured: true) as ProjectCard components
- "See All Projects →" link to /projects

**Subscribe section:**
- Reusable Subscribe component

### Blog Listing (blog/index.astro)

- H1: "Writing"
- Subtitle: "Thoughts on AI development, building products, and lessons from the trenches."
- Tag filter bar at top: render all unique tags as clickable pills. Use client-side JS to show/hide posts by tag (no page reload).
- Posts displayed as a vertical list (PostCard components), sorted by date descending
- Filter out posts where draft: true

### Blog Post (blog/[...slug].astro)

- Uses PostLayout.astro which extends BaseLayout
- Post header: H1 title, date formatted as "March 20, 2026", reading time, tags as pills
- Post body: rendered Markdown in `.prose` container (720px max-width)
- Post footer: horizontal rule, Subscribe component, "Related Posts" section showing 2-3 posts with matching tags

### Projects Listing (projects/index.astro)

- H1: "Projects"
- Subtitle: "Things I've built, shipped, and learned from."
- Large ProjectCard components in a single-column layout, sorted by `order` field

### Project Detail (projects/[...slug].astro)

- Uses BaseLayout
- Project header: H1 title, status badge, technology tags, links (GitHub, live, app stores)
- Project body: rendered Markdown in `.prose` container
- Back link to /projects at bottom

### About Page (about.astro)

- Uses BaseLayout with container--narrow (720px)
- **Full content below — render this exactly:**

---

**[H1]** About Me

Before I wrote my first line of code, I ran a woodworking factory. I shipped tables, not APIs. That experience — building something from raw materials, selling it to real people, and doing it profitably for eight years — shapes everything about how I approach software.

When I decided to pivot into tech, I didn't dip a toe in. I went back to school full-time while teaching myself to build. I earned a B.S. in Computer Science with Summa Cum Laude distinction, then spent a year building Racquet Rivalry — a mobile app connecting racquet sports players locally — and shipped it to both the App Store and Google Play.

That led to a role as a full-stack software engineer on the National Cancer Institute's Connect for Cancer Prevention Study, where I've since been promoted to Senior Engineer. The work is serious — building and maintaining production systems that support one of the largest cancer research studies in the country. It's also where I learned what "production-grade" really means.

Alongside that work, I completed a Master's degree in Artificial Intelligence and Machine Learning with a 4.0 GPA. Not because I needed the credential, but because I wanted the depth. My coursework wasn't theoretical — I built a retrieval-based chatbot from scratch with TensorFlow, designed a reinforcement learning trading environment for EMini futures, and wrote a portfolio project on using hybrid AI to detect stock accumulation patterns.

Now, I'm focused on what I think is the most important shift in software development in a decade: AI-augmented and agentic development. I'm building multi-agent systems that orchestrate coding workflows, rebuilding my own apps using these tools, and documenting what works and what doesn't. I write about all of it here.

**[H2]** Credentials

- **M.S. in Artificial Intelligence & Machine Learning** — Colorado State University Global (4.0 GPA)
- **B.S. in Computer Science** — Colorado State University Global (Summa Cum Laude, 2021)
- **Senior Software Engineer** — National Cancer Institute / Connect for Cancer Prevention Study (via Cirrus Lake Solutions)
- **8 years** as founder and operator of a woodworking and ecommerce business

**[H2]** Beyond the Screen

When I'm not building, you'll find me on the tennis court working on my backhand, hiking Colorado trails, experimenting in the kitchen, or playing guitar. The tennis habit is how Racquet Rivalry was born — I wanted an easier way to find people to play with.

**[H2]** Get in Touch

I'm always open to connecting with people building interesting things. Find me on [LinkedIn](https://linkedin.com/in/joearmani) or reach out at [joe@joearmani.com](mailto:joe@joearmani.com).

---

### Subscribe Page (subscribe.astro)

- Uses BaseLayout with container--narrow
- H1: "Stay sharp on AI development."
- Description text: "I share practical insights on building with AI — from multi-agent workflows to production ML systems. One email, every two weeks, from someone who's building this stuff daily."
- Large centered Subscribe form (email input + submit button)
- Below the form: "No spam. No hype. Unsubscribe anytime."
- Below that: a "What you'll get" section with 3 short bullets:
  - Practitioner insights on AI-augmented development
  - Build-in-public updates on real projects
  - Curated takes on AI research that matters for builders

---

## 5. Starter Content

### Blog Post: from-woodshop-to-code.md

```markdown
---
title: "From Woodshop to Code: My Unconventional Path to AI Engineering"
description: "How running a woodworking factory for eight years prepared me for a career in AI and software engineering — and why the best developers might not have traditional backgrounds."
date: 2026-03-20
tags: ["career", "ai-ml"]
draft: false
featured: true
readingTime: 8
---

## The outline

1. **Hook** — Open with a specific moment from the woodworking days that connects to a software engineering concept. Maybe a production optimization that was essentially an algorithm. Something that makes readers go "huh, I never thought about it that way."

2. **The factory years** — What you built, what you learned about systems thinking, customer feedback loops, and operational efficiency. Don't romanticize it, but make the parallels to engineering clear.

3. **The pivot** — Why you decided to change. What the transition felt like. Be honest about what was hard.

4. **The accelerated path** — CS degree, building Racquet Rivalry, landing the NCI role. Show the velocity without bragging.

5. **The AI chapter** — What drew you to AI/ML specifically. How the Master's program connected to real work. Where you are now.

6. **The thesis** — What you believe about the future of development, and how your unusual background gives you a different lens. This is the takeaway that makes people want to follow your work.

*Target: 1500-2000 words. Write it in the voice you'd use telling a friend the story over drinks.*
```

### Project: agentic-dev-system.md

```markdown
---
title: "Agentic Development System"
description: "A spec-driven, CLI-agnostic multi-agent system for test-driven development across production JavaScript codebases."
status: "Active"
tags: ["AI/ML", "Agentic", "JavaScript", "TDD"]
order: 1
featured: true
links:
  github: ""
---

## Overview

A structured development system that enables AI coding agents (Claude Code, Gemini CLI, Codex) to work effectively in production codebases without context rot or regression. Built around the "agent contract" pattern — a single AGENTS.md file that any CLI tool can read and follow.

## The Problem

AI coding tools are powerful but brittle in large codebases. They lose context, introduce regressions, and produce inconsistent results across sessions. The more complex the codebase, the worse these problems get.

## The Approach

The system uses three core patterns:

**Agent contracts (AGENTS.md):** A single markdown file per repo that specifies exact commands, constraints, and step-by-step workflows. This makes the system CLI-agnostic — Claude Code, Gemini CLI, and Codex all read markdown.

**Test-driven development workflow:** Every task starts with a planning phase that produces test specifications before any implementation code. The agent writes failing tests first, then implements until they pass. This prevents the "it compiles but doesn't work" problem that plagues AI-generated code.

**Structured review engine:** A local code review system that produces structured JSON + markdown findings, enabling consistent quality checks both pre-PR (self-review) and post-PR (automated review).

## Technical Details

- Covers 3 client-side JavaScript apps and 1 server-side app (Cloud Functions)
- Firebase/Firestore + GCP stack
- Two-tier verification: fast CI checks + local Firebase emulator testing
- Prompt-file-per-task pattern for reproducible agent behavior
- Task working memory (.task/ directory) for context continuity

## Status

Actively in use across production NCI codebases. Iterating on the review engine and multi-repo consistency.
```

### Project: racquet-rivalry.md

```markdown
---
title: "Racquet Rivalry"
description: "A mobile app connecting local racquet sports players by skill level and match preferences. Currently undergoing a ground-up rebuild."
status: "Rebuilding"
tags: ["Flutter", "Firebase", "GCP", "Mobile"]
order: 2
featured: true
links:
  live: "https://racquetrivalry.com"
  appStore: "https://apps.apple.com/us/app/racquet-rivalry-meet-rally/id1641760049"
---

## Overview

Racquet Rivalry connects local tennis, pickleball, table tennis, and other racquet sports players. Users create profiles with their skill level and preferences, then find and schedule matches with compatible local players.

## The Original Build

Built with Flutter for cross-platform iOS/Android deployment, with Firebase (Firestore, Auth, Cloud Functions) as the backend. Published under Game Day Interactive LLC. Launched November 2022, reached ~1,900 downloads on Google Play before being sunset for a rebuild.

## Why Rebuild?

The original app was my first major mobile development project, built while I was still a relatively junior developer. Since then, I've gained two years of production engineering experience at the National Cancer Institute, completed a Master's in AI/ML, and developed a deep understanding of agentic development tools.

The rebuild is as much about demonstrating modern AI-augmented development practices as it is about improving the product. I'm documenting the entire process as a "build in public" series.

## What's Changing

- Ground-up architecture redesign informed by production engineering experience
- AI-augmented development workflow using the agentic development system
- Potential rebrand and expanded feature set
- Focus on solving the cold-start problem that limited initial traction

## Status

Active rebuild in progress. Follow the build-in-public series on the blog for detailed progress updates.
```

### Project: rl-trading.md

```markdown
---
title: "RL Trading Environment"
description: "A reinforcement learning system for EMini futures trading with cross-attention models and custom reward engineering."
status: "Research"
tags: ["Python", "PyTorch", "Reinforcement Learning", "Finance"]
order: 3
featured: true
---

## Overview

A research project exploring the application of deep reinforcement learning to intraday futures trading. The system operates on EMini contracts (ES, NQ, YM) using multi-timeframe data and custom environment design.

## Technical Architecture

**Environment:** Custom OpenAI Gym environment built in Python with PyTorch. Handles multi-timeframe data for three futures instruments, position management with realistic margin requirements, and market impact/slippage modeling.

**Model pipeline:** A cross-attention model processes multi-instrument, multi-timeframe features before feeding into the RL agent. This allows the system to capture inter-market relationships that single-instrument models miss.

**Reward engineering:** Multi-factor reward function combining Sharpe ratio, Sortino ratio, Calmar ratio, trade frequency scoring, and time decay penalties. Designed to encourage risk-adjusted returns rather than raw PnL maximization.

**Training:** Stable Baselines 3 for the RL component, with separate supervised pre-training of the attention model. Uses SubprocVecEnv for parallel training environments.

## Key Learnings

- Reward function design dominates model architecture choices in trading RL
- Realistic transaction cost and slippage modeling is essential — without it, the agent learns strategies that only work in simulation
- Multi-instrument cross-attention captures regime shifts better than single-instrument approaches

## Status

Research phase. Refining the reward function and exploring different RL algorithms. This project serves as a deep exploration of applied ML, not a production trading system.
```

### Project: connect-for-cancer.md

```markdown
---
title: "Connect for Cancer Prevention Study"
description: "Senior Software Engineer on one of the National Cancer Institute's major cancer research technology platforms."
status: "Ongoing"
tags: ["JavaScript", "GCP", "Firestore", "Cloud Functions"]
order: 4
featured: false
---

## Overview

The Connect for Cancer Prevention Study is a large-scale National Cancer Institute research initiative. As a Senior Software Engineer (contracted via Cirrus Lake Solutions), I work across the study's full technology stack — three client-side JavaScript applications and a server-side Cloud Functions application, all built on Google Cloud Platform with Firestore.

## My Role

Full-stack development including feature work, API design and implementation, data architecture, debugging, code reviews, and architectural improvements. I also contribute to process improvements and have introduced AI-augmented development practices to the team's workflow.

## What I Can Share

Due to the nature of federal research work, I can't share proprietary details. What I can say is that this work has given me deep experience in building and maintaining production systems where reliability and data integrity aren't optional — they're mission-critical. It's shaped how I think about software quality, testing, and operational stability in everything I build.
```

---

## 6. Quality Checklist

Before considering any page complete, verify:

### Visual
- [ ] Renders correctly at 320px, 640px, 1024px, and 1440px widths
- [ ] No horizontal scrolling at any breakpoint
- [ ] All text is readable (contrast ratio 4.5:1 minimum)
- [ ] Cards, buttons, and interactive elements have visible hover states
- [ ] Scroll reveal animations fire correctly on first viewport entry
- [ ] Code blocks don't overflow their containers on mobile

### Functional
- [ ] All internal links work (no 404s)
- [ ] Blog listing correctly filters by tag
- [ ] Blog posts sorted by date descending
- [ ] RSS feed generates valid XML
- [ ] Sitemap generates and includes all pages

### SEO
- [ ] Every page has a unique `<title>` tag
- [ ] Every page has a unique `<meta name="description">`
- [ ] Open Graph tags present (og:title, og:description, og:type, og:url)
- [ ] Canonical URL set on every page
- [ ] JSON-LD structured data on homepage (WebSite), about (Person), posts (BlogPosting)
- [ ] Favicon renders in browser tab

### Performance
- [ ] No external JS frameworks loaded (Astro should ship zero JS by default)
- [ ] Images optimized (WebP preferred, width/height attributes set, loading="lazy" on below-fold)
- [ ] Google Fonts loaded with `display=swap`
- [ ] Target: 95+ PageSpeed Insights score

### Content
- [ ] No lorem ipsum anywhere
- [ ] About page has the full career arc content from this spec
- [ ] At least one real blog post published (even if it's a structural outline)
- [ ] Project case studies have real content, not placeholders

---

## 7. Deployment

### Cloudflare Workers Setup

1. Push the repo to GitHub
2. In Cloudflare dashboard → Workers & Pages → Create or connect the Worker to Git
3. Build settings:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Node version: 22+
4. Configure `wrangler.jsonc`:
   - `assets.directory = "./dist"`
   - `routes` for `joearmani.com` and `www.joearmani.com`
   - `workers_dev = true` and `preview_urls = true` for debug URLs
5. Add a tiny Worker entrypoint that redirects `www` to apex, then falls through to `env.ASSETS.fetch(request)`
6. Enable Cloudflare Web Analytics in the dashboard if desired

### DNS (if domain is not already on Cloudflare)

1. Transfer nameservers to Cloudflare (free plan)
2. Worker custom domains will create the proxied DNS `Worker` records for apex and `www`
3. SSL is automatic
4. Keep `www` canonicalized by redirecting it to `joearmani.com`

---

**End of specification. Retained for reference alongside the live implementation.**
