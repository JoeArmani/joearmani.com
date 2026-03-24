/**
 * joearmani.com — Source-level test suite
 * Reads source files directly; no build step required.
 *
 * Run: node tests/site.test.js
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let passed = 0;
let failed = 0;
const failures = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function read(relPath) {
  const fullPath = join(ROOT, relPath);
  if (!existsSync(fullPath)) throw new Error(`File not found: ${relPath}`);
  return readFileSync(fullPath, 'utf-8');
}

function exists(relPath) {
  return existsSync(join(ROOT, relPath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function has(content, str) { return content.includes(str); }
function lacks(content, str) { return !content.includes(str); }

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗  ${name}`);
    console.log(`     → ${err.message}`);
    failed++;
    failures.push({ name, error: err.message });
  }
}

function group(title) {
  console.log(`\n${title}`);
  console.log('─'.repeat(title.length));
}

// ─── 1. Structural Tests ──────────────────────────────────────────────────────

group('1. Structural — all page files exist');

const PAGES = [
  ['/',          'src/pages/index.astro'],
  ['/about',     'src/pages/about.astro'],
  ['/blog',      'src/pages/blog/index.astro'],
  ['/projects',  'src/pages/projects/index.astro'],
  ['/subscribe', 'src/pages/subscribe.astro'],
  ['/uses',      'src/pages/uses.astro'],
  ['/now',       'src/pages/now.astro'],
  ['/404',       'src/pages/404.astro'],
];

for (const [route, file] of PAGES) {
  test(`${route}  →  ${file}`, () => {
    assert(exists(file), `Missing page file: ${file}`);
  });
}

test('All page files contain Astro frontmatter delimiters', () => {
  for (const [, file] of PAGES) {
    const content = read(file);
    assert(has(content, '---'), `${file} missing frontmatter (---)`);
  }
});

// ─── 2. Content Integrity Tests ───────────────────────────────────────────────

group('2. Content Integrity — brand voice rewrites');

test('Hero pre-tagline says "Builder · Engineer · AI Practitioner"', () => {
  const content = read('src/components/Hero.astro');
  assert(has(content, 'Builder · Engineer · AI Practitioner'),
    'Expected "Builder · Engineer · AI Practitioner" in Hero.astro');
});

test('Hero pre-tagline does NOT say old "AI Practitioner · Builder · Entrepreneur"', () => {
  const content = read('src/components/Hero.astro');
  assert(lacks(content, 'AI Practitioner · Builder · Entrepreneur'),
    'Found old tagline "AI Practitioner · Builder · Entrepreneur" — should be updated');
});

test('Hero h1 says "I build with AI and write about what actually works."', () => {
  const content = read('src/components/Hero.astro');
  assert(has(content, 'I build with AI and write about what actually works.'),
    'Hero h1 text mismatch in Hero.astro');
});

test('Home page title is "Joe Armani | Builder, Engineer, AI Practitioner"', () => {
  const content = read('src/pages/index.astro');
  assert(has(content, 'Joe Armani | Builder, Engineer, AI Practitioner'),
    'Homepage <title> mismatch in index.astro');
});

test('Meta descriptions do not contain "at the intersection of"', () => {
  for (const [route, file] of PAGES) {
    const content = read(file);
    assert(lacks(content, 'at the intersection of'),
      `Banned phrase "at the intersection of" found in ${file} (${route})`);
  }
});

test('Meta descriptions do not contain em-dashes (—)', () => {
  for (const [route, file] of PAGES) {
    const content = read(file);
    const descMatches = content.match(/description="[^"]*"/g) ?? [];
    for (const desc of descMatches) {
      assert(lacks(desc, '—'),
        `Em-dash in description attribute in ${file} (${route}): ${desc}`);
    }
  }
});

test('About page does NOT contain "Beyond the Screen"', () => {
  const content = read('src/pages/about.astro');
  assert(lacks(content, 'Beyond the Screen'),
    'Removed section heading "Beyond the Screen" still present in about.astro');
});

test('About page does NOT contain "I\'m always open to connecting"', () => {
  const content = read('src/pages/about.astro');
  assert(lacks(content, "I'm always open to connecting"),
    'Removed phrase "I\'m always open to connecting" still present in about.astro');
});

test('About page has "Outside Work" section heading', () => {
  const content = read('src/pages/about.astro');
  assert(has(content, 'Outside Work'),
    '"Outside Work" heading missing from about.astro');
});

test('Blog subtitle says "Includes the failures" (not "lessons from the trenches")', () => {
  const content = read('src/pages/blog/index.astro');
  assert(has(content, 'Includes the failures'),
    'Expected "Includes the failures" in blog/index.astro');
  assert(lacks(content, 'lessons from the trenches'),
    'Old phrase "lessons from the trenches" still present in blog/index.astro');
});

// ─── 3. Component Existence Tests ────────────────────────────────────────────

group('3. Component Existence');

test('Comments.astro exists', () => {
  assert(exists('src/components/Comments.astro'),
    'Missing src/components/Comments.astro');
});

test('Subscribe.astro accepts variant prop (compact + full)', () => {
  const content = read('src/components/Subscribe.astro');
  assert(has(content, 'variant'),
    'Subscribe.astro does not define a variant prop');
  assert(has(content, 'compact') && has(content, 'full'),
    'Subscribe.astro missing compact/full variant values');
});

test('TagList.astro does NOT exist (was deleted)', () => {
  assert(!exists('src/components/TagList.astro'),
    'TagList.astro should have been deleted but still exists');
});

test('/uses page has Development section', () => {
  const content = read('src/pages/uses.astro');
  assert(has(content, 'Development'),
    'Missing "Development" section in uses.astro');
});

test('/uses page has AI & ML section', () => {
  const content = read('src/pages/uses.astro');
  assert(has(content, 'AI'),
    'Missing "AI" section in uses.astro');
});

test('/uses page has Infrastructure section', () => {
  const content = read('src/pages/uses.astro');
  assert(has(content, 'Infrastructure'),
    'Missing "Infrastructure" section in uses.astro');
});

test('/now page has Building section', () => {
  const content = read('src/pages/now.astro');
  assert(has(content, 'Building'),
    'Missing "Building" section in now.astro');
});

test('/now page has Learning section', () => {
  const content = read('src/pages/now.astro');
  assert(has(content, 'Learning'),
    'Missing "Learning" section in now.astro');
});

test('/now page has last-updated date reference', () => {
  const content = read('src/pages/now.astro');
  assert(has(content, 'Last updated') || has(content, 'Updated'),
    'Missing last-updated date reference in now.astro');
});

// ─── 4. Design System Tests ───────────────────────────────────────────────────

group('4. Design System');

const CSS = read('src/styles/global.css');

test('global.css contains --accent-warm custom property', () => {
  assert(has(CSS, '--accent-warm'),
    'Missing --accent-warm in global.css');
});

test('body font-size is 1.125rem', () => {
  assert(has(CSS, 'font-size: 1.125rem'),
    'Expected body font-size: 1.125rem in global.css');
});

test('h3 font-size is 1.375rem', () => {
  assert(has(CSS, '1.375rem'),
    'Expected 1.375rem (h3 size) in global.css');
});

test('Dark theme color tokens are defined', () => {
  assert(has(CSS, ':root, [data-theme="dark"]') || (has(CSS, ':root') && has(CSS, '[data-theme="dark"]')),
    'Missing dark theme token block in global.css');
});

test('Light theme color tokens are defined ([data-theme="light"])', () => {
  assert(has(CSS, '[data-theme="light"]'),
    'Missing light theme token block in global.css');
});

test('Dark mode --bg-primary defined (#0F1117)', () => {
  assert(has(CSS, '--bg-primary: #0F1117'),
    'Missing dark mode --bg-primary: #0F1117 in global.css');
});

test('Light mode --bg-primary defined (#F8F9FB)', () => {
  assert(has(CSS, '--bg-primary: #F8F9FB'),
    'Missing light mode --bg-primary: #F8F9FB in global.css');
});

test('Projects page uses grid layout (.project-list with grid-template-columns)', () => {
  assert(has(CSS, '.project-list'),
    'Missing .project-list in global.css');
  // Find the .project-list block and check it uses grid
  const idx = CSS.indexOf('.project-list');
  const block = CSS.slice(idx, idx + 400);
  assert(has(block, 'grid-template-columns'),
    '.project-list does not use grid-template-columns in global.css');
});

test('Reading progress bar exists in PostLayout.astro', () => {
  const content = read('src/layouts/PostLayout.astro');
  assert(has(content, 'reading-progress'),
    'Missing reading-progress element/id in PostLayout.astro');
});

// ─── 5. No Regression Tests ───────────────────────────────────────────────────

group('5. No Regressions');

test('Hero pre-tagline font-size is >= 0.875rem', () => {
  const match = CSS.match(/\.hero__pre\s*\{[^}]*font-size:\s*([\d.]+)rem/);
  assert(match, 'Could not locate .hero__pre font-size in global.css');
  const size = parseFloat(match[1]);
  assert(size >= 0.875,
    `hero__pre font-size is ${size}rem — expected >= 0.875rem (was inadvertently shrunk)`);
});

test('Subscribe input has a visible border defined', () => {
  assert(has(CSS, '.subscribe__input'),
    'Missing .subscribe__input in global.css');
  const idx = CSS.indexOf('.subscribe__input');
  const block = CSS.slice(idx, idx + 350);
  assert(has(block, 'border:') || has(block, 'border-color:'),
    '.subscribe__input has no border property defined');
  assert(lacks(block.split('\n').find(l => l.includes('border:')) ?? '', 'none'),
    '.subscribe__input border is set to none');
});

test('Subscribe input border uses a visible color token (not border-light-only)', () => {
  // After the fix, the main rule should use --border (or stronger), not --border-light
  const idx = CSS.indexOf('.subscribe__input {');
  const mainBlock = CSS.slice(idx, CSS.indexOf('}', idx) + 1);
  // Accept --border or --border-light; just reject completely missing border
  assert(has(mainBlock, 'border:'),
    '.subscribe__input main block has no border shorthand property');
});

test('Nav contains Blog link', () => {
  const content = read('src/components/Nav.astro');
  assert(has(content, '/blog'), 'Missing /blog link in Nav.astro');
});

test('Nav contains Projects link', () => {
  const content = read('src/components/Nav.astro');
  assert(has(content, '/projects'), 'Missing /projects link in Nav.astro');
});

test('Nav contains Uses link', () => {
  const content = read('src/components/Nav.astro');
  assert(has(content, '/uses'), 'Missing /uses link in Nav.astro');
});

test('Nav contains About link', () => {
  const content = read('src/components/Nav.astro');
  assert(has(content, '/about'), 'Missing /about link in Nav.astro');
});

test('Nav contains Subscribe link', () => {
  const content = read('src/components/Nav.astro');
  assert(has(content, '/subscribe'), 'Missing /subscribe link in Nav.astro');
});

test('Footer contains /now link', () => {
  const content = read('src/components/Footer.astro');
  assert(has(content, '/now'), 'Missing /now link in Footer.astro');
});

test('Subscribe form action points to Buttondown', () => {
  const subscribeComp = read('src/components/Subscribe.astro');
  const subscribePage = read('src/pages/subscribe.astro');
  assert(has(subscribeComp, 'buttondown.com'),
    'Missing Buttondown action URL in Subscribe.astro component');
  // Subscribe page uses the Subscribe component, so it inherits the Buttondown URL
  assert(has(subscribePage, 'Subscribe'),
    'Subscribe page should use the Subscribe component');
});

test('Hero does NOT have scroll indicator', () => {
  const content = read('src/components/Hero.astro');
  assert(lacks(content, 'hero__scroll'),
    'Hero still contains scroll indicator element (should be removed)');
});

test('Hero height is capped (not 100vh)', () => {
  assert(lacks(CSS, 'calc(100vh'),
    'Hero still uses calc(100vh) — should be reduced to ~80vh');
  const match = CSS.match(/\.hero\s*\{[^}]*min-height:\s*min\((\d+)vh/);
  assert(match, 'Could not locate .hero min-height with min() in global.css');
  const vh = parseInt(match[1]);
  assert(vh <= 85, `Hero min-height is ${vh}vh — expected <= 85vh`);
});

test('Fonts are self-hosted (no Google Fonts links)', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  assert(lacks(layout, 'fonts.googleapis.com/css'),
    'BaseLayout still has Google Fonts CSS link — should be self-hosted');
  assert(has(CSS, "@font-face"),
    'global.css missing @font-face declarations for self-hosted fonts');
});

test('Font files exist in public/fonts/', () => {
  assert(exists('public/fonts/plus-jakarta-sans-700-latin.woff2'),
    'Missing Plus Jakarta Sans WOFF2 font file');
  assert(exists('public/fonts/dm-sans-400-latin.woff2'),
    'Missing DM Sans 400 WOFF2 font file');
  assert(exists('public/fonts/jetbrains-mono-400-latin.woff2'),
    'Missing JetBrains Mono WOFF2 font file');
});

test('Theme-color meta tags exist in BaseLayout', () => {
  const layout = read('src/layouts/BaseLayout.astro');
  assert(has(layout, 'theme-color'),
    'Missing theme-color meta tag in BaseLayout');
  assert(has(layout, 'data-dynamic-theme-color'),
    'BaseLayout should expose a dynamic theme-color meta tag for user-selected themes');
  assert(has(layout, '#0F1117'),
    'Missing dark theme-color value in BaseLayout');
  assert(has(layout, '#F8F9FB'),
    'Missing light theme-color value in BaseLayout');
});

test('Section gap matches the intentionally tight layout rhythm', () => {
  const match = CSS.match(/--section-gap:\s*([\d.]+)rem/);
  assert(match, 'Could not find --section-gap in global.css');
  const gap = parseFloat(match[1]);
  assert(gap >= 0.75 && gap <= 1.25, `Section gap is ${gap}rem — expected roughly 1rem`);
  assert(has(CSS, '--section-gap: 0.5rem'),
    'Mobile section gap should tighten to 0.5rem');
});

test('About page has structured section headings', () => {
  const content = read('src/pages/about.astro');
  assert(has(content, 'The Pivot'),
    'About page missing "The Pivot" section heading');
  assert(has(content, 'What I Do at NCI'),
    'About page missing "What I Do at NCI" section heading');
  assert(has(content, 'What I\'m Building Now'),
    'About page missing "What I\'m Building Now" section heading');
  assert(has(content, 'Outside Work'),
    'About page missing "Outside Work" section heading');
});

test('About page credentials appear before career narrative', () => {
  const content = read('src/pages/about.astro');
  const credIdx = content.indexOf('Credentials');
  const narrativeIdx = content.indexOf('The Pivot');
  assert(credIdx > 0 && narrativeIdx > 0 && credIdx < narrativeIdx,
    'Credentials should appear before "The Pivot" in about.astro');
});

test('Footer has brand tagline', () => {
  const content = read('src/components/Footer.astro');
  assert(has(content, 'footer__tagline'),
    'Missing footer tagline element');
  assert(has(content, 'Building with AI'),
    'Footer tagline text missing');
});

test('Homepage section order: Subscribe after What I\'m Building (conclusion CTA)', () => {
  const content = read('src/pages/index.astro');
  const subIdx = content.indexOf('>Subscribe</h2>');
  const buildIdx = content.indexOf('>What I\'m Building</h2>');
  assert(subIdx > 0 && buildIdx > 0 && subIdx > buildIdx,
    'Subscribe section should appear after "What I\'m Building" on homepage');
});

test('Subscribe card accent uses --accent-warm (not --accent-blue)', () => {
  const match = CSS.match(/\.subscribe\s*\{[^}]*border-top:[^;]*/);
  assert(match, 'Could not find .subscribe border-top in global.css');
  assert(has(match[0], 'accent-warm'),
    'Subscribe card border-top should use --accent-warm for visual continuity');
});

test('/uses page tools have contextual descriptions', () => {
  const content = read('src/pages/uses.astro');
  // Check that tools have multi-sentence descriptions, not just labels
  assert(has(content, 'architecture and review'),
    'Claude Code description should include workflow context');
  assert(has(content, 'cross-attention model'),
    'RL/PyTorch description should mention the cross-attention model');
  assert(has(content, 'Firebase / GCP'),
    'Uses page should list Firebase/GCP under infrastructure');
});

// ─── 6. Code & Structure Integrity ────────────────────────────────────────────

group('6. Code & Structure Integrity');

test('Blog post is published (draft: false)', () => {
  const content = read('content/blog/from-woodshop-to-code.md');
  assert(has(content, 'draft: false'),
    'Blog post should have draft: false (published)');
});

test('Giscus repo-id is populated (not empty)', () => {
  const content = read('src/components/Comments.astro');
  const match = content.match(/data-repo-id['"]\s*,\s*'([^']*)'/);
  assert(match && match[1].length > 0,
    'Giscus data-repo-id should not be empty');
});

test('Giscus category-id is populated (not empty)', () => {
  const content = read('src/components/Comments.astro');
  const match = content.match(/data-category-id['"]\s*,\s*'([^']*)'/);
  assert(match && match[1].length > 0,
    'Giscus data-category-id should not be empty');
});

test('Giscus mounts into the placeholder container', () => {
  const content = read('src/components/Comments.astro');
  assert(has(content, 'container.appendChild(script)'),
    'Giscus script should mount into the .giscus placeholder container');
  assert(lacks(content, 'document.body.appendChild(script)'),
    'Giscus script should not mount on document.body');
});

test('Light mode cards have resting shadows', () => {
  assert(has(CSS, '[data-theme="light"] .card'),
    'Light mode should have card-specific shadow styles');
  assert(has(CSS, 'shadow-sm'),
    'Light mode cards should use shadow-sm for resting state');
});

test('Light mode bg-surface is white (#FFFFFF) for card depth', () => {
  // Cards should be white floating on off-white page background
  const lightBlock = CSS.split('[data-theme="light"]')[1]?.split('}')[0] || '';
  assert(lightBlock.includes('--bg-surface: #FFFFFF'),
    'Light mode --bg-surface should be #FFFFFF for card depth effect');
});

test('Nav Subscribe link has no button classes', () => {
  const content = read('src/components/Nav.astro');
  assert(!has(content, 'btn--primary') && !has(content, 'btn--outline'),
    'Nav should not use btn--primary or btn--outline on Subscribe link');
});

test('Theme toggle exposes pressed state for accessibility', () => {
  const content = read('src/components/ThemeToggle.astro');
  assert(has(content, 'aria-pressed'),
    'Theme toggle should expose aria-pressed');
});

test('Subscribe page reuses Subscribe component', () => {
  const content = read('src/pages/subscribe.astro');
  assert(has(content, "../components/Subscribe.astro") || has(content, 'variant="full"'),
    'Subscribe page should import and use the Subscribe component');
});

test('Prose has horizontal padding for mobile', () => {
  const proseMatch = CSS.match(/\.prose\s*\{[^}]*/);
  assert(proseMatch, 'Could not find .prose rule in global.css');
  assert(has(proseMatch[0], 'padding'),
    '.prose should have horizontal padding for mobile readability');
});

test('Homepage has smart Start Here deduplication logic', () => {
  const content = read('src/pages/index.astro');
  assert(has(content, 'showStartHere'),
    'Homepage should use showStartHere logic to avoid duplicate post display');
});

// ─── 7. Post-Launch Features ──────────────────────────────────────────────────

group('7. Post-Launch Features');

test('Breadcrumbs component exists', () => {
  assert(exists('src/components/Breadcrumbs.astro'),
    'Missing src/components/Breadcrumbs.astro');
});

test('Breadcrumbs component includes BreadcrumbList schema', () => {
  const content = read('src/components/Breadcrumbs.astro');
  assert(has(content, 'BreadcrumbList'),
    'Breadcrumbs.astro should include BreadcrumbList JSON-LD schema');
});

test('Breadcrumbs are used in PostLayout', () => {
  const content = read('src/layouts/PostLayout.astro');
  assert(has(content, 'Breadcrumbs'),
    'PostLayout should import and use Breadcrumbs component');
});

test('Breadcrumbs are used on blog index', () => {
  const content = read('src/pages/blog/index.astro');
  assert(has(content, 'Breadcrumbs'),
    'Blog index should import and use Breadcrumbs component');
});

test('Breadcrumbs are used on project detail pages', () => {
  const content = read('src/pages/projects/[...slug].astro');
  assert(has(content, 'Breadcrumbs'),
    'Project detail page should import and use Breadcrumbs component');
});

test('Breadcrumbs CSS exists in global.css', () => {
  assert(has(CSS, '.breadcrumbs'),
    'Missing .breadcrumbs styles in global.css');
});

test('Blog schema supports lastModified field', () => {
  const content = read('src/content.config.ts');
  assert(has(content, 'lastModified'),
    'Blog schema should include lastModified field');
});

test('PostLayout displays last-modified date', () => {
  const content = read('src/layouts/PostLayout.astro');
  assert(has(content, 'formattedLastModified'),
    'PostLayout should format and display lastModified date');
});

test('PostLayout includes dateModified in JSON-LD schema', () => {
  const content = read('src/layouts/PostLayout.astro');
  assert(has(content, 'dateModified'),
    'PostLayout should include dateModified in BlogPosting schema');
});

test('Blog post has lastModified in frontmatter', () => {
  const content = read('content/blog/from-woodshop-to-code.md');
  assert(has(content, 'lastModified:'),
    'Blog post should have lastModified field in frontmatter');
});

test('Blog search input exists on blog index', () => {
  const content = read('src/pages/blog/index.astro');
  assert(has(content, 'blog-search'),
    'Blog index should have a search input with blog-search class');
});

test('Blog search input has an accessible name', () => {
  const content = read('src/pages/blog/index.astro');
  assert(has(content, 'aria-label="Search posts"') || has(content, "aria-label='Search posts'"),
    'Blog search input should have an accessible name');
});

test('Blog search CSS exists in global.css', () => {
  assert(has(CSS, '.blog-search__input'),
    'Missing .blog-search__input styles in global.css');
});

test('Blog posts have data attributes for search', () => {
  const content = read('src/pages/blog/index.astro');
  assert(has(content, 'data-title'),
    'Blog post cards should have data-title attribute for search');
  assert(has(content, 'data-description'),
    'Blog post cards should have data-description attribute for search');
});

test('Dark mode is default for first-time visitors', () => {
  const content = read('src/layouts/BaseLayout.astro');
  // The inline theme script should NOT use matchMedia to detect system preference.
  // Theme selection should still default to dark and then sync the dynamic theme-color meta tag.
  const themeScript = content.match(/script is:inline[\s\S]*?<\/script>/)?.[0] || '';
  assert(lacks(themeScript, 'matchMedia'),
    'Theme script should not use matchMedia (always default to dark)');
  assert(has(themeScript, "savedTheme === 'light' ? 'light' : 'dark'") || has(themeScript, 'savedTheme === "light" ? "light" : "dark"'),
    'Theme script should fall back to dark mode when no light preference is saved');
  assert(has(themeScript, 'data-dynamic-theme-color'),
    'Theme script should synchronize the dynamic theme-color meta tag');
});

test('Link validation test exists', () => {
  assert(exists('tests/links.test.js'),
    'Missing tests/links.test.js for internal link validation');
});

test('Package test script runs link validation', () => {
  const content = read('package.json');
  assert(has(content, 'test:links'),
    'package.json should define a dedicated link validation script');
  assert(has(content, 'npm run test:site && npm run test:links'),
    'npm test should run both site and link validation');
});

test('Package check script exposes Astro type/content checks', () => {
  const content = read('package.json');
  assert(has(content, '"check": "astro check"'),
    'package.json should define an astro check script');
});

test('OG image utility exists', () => {
  assert(exists('src/utils/og-image.ts'),
    'Missing src/utils/og-image.ts for OG image generation');
});

test('OG image endpoint exists for blog posts', () => {
  assert(exists('src/pages/og/[slug].png.ts'),
    'Missing dynamic OG image endpoint for blog posts');
});

test('Default OG image endpoint exists', () => {
  assert(exists('src/pages/og/default.png.ts'),
    'Missing default OG image endpoint');
});

test('BaseLayout always has an OG image (default fallback)', () => {
  const content = read('src/layouts/BaseLayout.astro');
  assert(has(content, 'resolvedOgImage'),
    'BaseLayout should use resolvedOgImage with default fallback');
  assert(has(content, 'og/default.png'),
    'BaseLayout should fall back to /og/default.png');
});

test('PostLayout passes per-post OG image to BaseLayout', () => {
  const content = read('src/layouts/PostLayout.astro');
  assert(has(content, 'ogImage='),
    'PostLayout should pass ogImage prop to BaseLayout');
  assert(has(content, '/og/'),
    'PostLayout ogImage should reference /og/ endpoint');
});

test('BaseLayout advertises the RSS feed', () => {
  const content = read('src/layouts/BaseLayout.astro');
  assert(has(content, 'rel="alternate"') || has(content, "rel='alternate'"),
    'BaseLayout should advertise the RSS feed with an alternate link');
  assert(has(content, '/rss.xml'),
    'BaseLayout alternate link should point to /rss.xml');
});

test('Blog detail getStaticPaths filters draft posts', () => {
  const content = read('src/pages/blog/[...slug].astro');
  assert(has(content, "!data.draft"),
    'Blog detail route should filter draft posts in getStaticPaths');
});

test('TTF font files exist for OG image rendering', () => {
  assert(exists('public/fonts/plus-jakarta-sans-700.ttf'),
    'Missing Plus Jakarta Sans TTF for OG image rendering');
  assert(exists('public/fonts/dm-sans-400.ttf'),
    'Missing DM Sans TTF for OG image rendering');
});

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(50));
console.log(`  ${passed} passed  ·  ${failed} failed  ·  ${passed + failed} total`);
console.log('═'.repeat(50));

if (failures.length > 0) {
  console.log('\nFailed:');
  failures.forEach(({ name }) => console.log(`  ✗  ${name}`));
  process.exit(1);
} else {
  console.log('\n  All tests passed ✓');
  process.exit(0);
}
