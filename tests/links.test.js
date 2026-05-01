/**
 * joearmani.com — Internal link validation
 * Scans all .astro and .md source files for internal links,
 * then verifies each one resolves to an existing page or content file.
 *
 * Run: node tests/links.test.js
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname } from 'path';
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

/**
 * Recursively collect all files matching the given extension(s) under a directory.
 */
function collectFiles(dir, extensions) {
  const results = [];
  const absDir = join(ROOT, dir);
  if (!existsSync(absDir)) return results;

  function walk(current) {
    for (const entry of readdirSync(current)) {
      const fullPath = join(current, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (extensions.includes(extname(entry))) {
        // Store path relative to ROOT
        results.push(fullPath.slice(ROOT.length + 1));
      }
    }
  }

  walk(absDir);
  return results;
}

// ─── Collect all source files ────────────────────────────────────────────────

const astroFiles = [
  ...collectFiles('src/pages', ['.astro']),
  ...collectFiles('src/components', ['.astro']),
  ...collectFiles('src/layouts', ['.astro']),
];

const mdFiles = [
  ...collectFiles('content/blog', ['.md', '.mdx']),
  ...collectFiles('content/projects', ['.md', '.mdx']),
];

const allFiles = [...astroFiles, ...mdFiles];

// ─── Build the set of known content slugs ────────────────────────────────────

const blogSlugs = collectFiles('content/blog', ['.md', '.mdx']).map((f) => {
  // content/blog/from-woodshop-to-code.md → from-woodshop-to-code
  // content/blog/operator-control-for-agentic-systems.mdx → operator-control-for-agentic-systems
  const parts = f.split('/');
  return parts[parts.length - 1].replace(/\.mdx?$/, '');
});

const projectSlugs = collectFiles('content/projects', ['.md', '.mdx']).map((f) => {
  const parts = f.split('/');
  return parts[parts.length - 1].replace(/\.mdx?$/, '');
});

// ─── Extract internal links from all files ───────────────────────────────────

/**
 * Returns an array of { link, file } objects for every internal link found.
 */
function extractLinks() {
  const found = [];

  for (const file of allFiles) {
    const content = read(file);
    const ext = extname(file);

    // 1. href="..." and href='...' in .astro and .md files
    //    Matches both static href="/path" and template href={`/path`} patterns
    const hrefRegex = /href\s*=\s*(?:"([^"]*?)"|'([^']*?)'|{`([^`]*?)`})/g;
    let m;
    while ((m = hrefRegex.exec(content)) !== null) {
      const link = m[1] ?? m[2] ?? m[3];
      if (link) found.push({ link, file });
    }

    // 2. Markdown-style links [text](/path) in .md and .mdx files
    if (ext === '.md' || ext === '.mdx') {
      const mdLinkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
      let ml;
      while ((ml = mdLinkRegex.exec(content)) !== null) {
        const link = ml[2];
        if (link) found.push({ link, file });
      }
    }
  }

  return found;
}

/**
 * Classify a raw link string and return { skip, reason } or { internal, path }.
 */
function classifyLink(raw) {
  // Skip anchors-only
  if (raw.startsWith('#')) return { skip: true, reason: 'anchor' };

  // Skip external URLs
  if (/^https?:\/\//.test(raw)) return { skip: true, reason: 'external' };
  if (raw.startsWith('mailto:')) return { skip: true, reason: 'mailto' };

  // Skip RSS (generated at build time)
  if (raw === '/rss.xml' || raw === '/rss.xml/') return { skip: true, reason: 'rss' };

  // Skip javascript: and data: schemes
  if (raw.startsWith('javascript:') || raw.startsWith('data:')) return { skip: true, reason: 'scheme' };

  // Skip dynamic template expressions (e.g. /blog/${slug})
  if (raw.includes('${')) return { skip: true, reason: 'dynamic' };

  // Must start with / to be a local absolute link
  if (!raw.startsWith('/')) return { skip: true, reason: 'relative-or-other' };

  // Strip trailing slash and anchor fragments for resolution
  let path = raw.replace(/\/$/, '') || '/';
  path = path.split('#')[0] || '/';

  return { skip: false, internal: true, path };
}

/**
 * Given a normalized internal path like "/blog/from-woodshop-to-code",
 * return whether it resolves to an existing source file.
 */
function resolveInternalLink(path) {
  // "/" → src/pages/index.astro
  if (path === '/') {
    return exists('src/pages/index.astro');
  }

  // Strip leading slash for matching
  const segments = path.slice(1).split('/');

  // Check blog posts: /blog/<slug>
  if (segments.length === 2 && segments[0] === 'blog') {
    const slug = segments[1];
    if (blogSlugs.includes(slug)) return true;
  }

  // Check project pages: /projects/<slug>
  if (segments.length === 2 && segments[0] === 'projects') {
    const slug = segments[1];
    if (projectSlugs.includes(slug)) return true;
  }

  // Check direct page files:
  //   /about → src/pages/about.astro
  //   /blog  → src/pages/blog/index.astro
  const directPage = `src/pages/${segments.join('/')}.astro`;
  if (exists(directPage)) return true;

  // Check index pages:
  //   /blog → src/pages/blog/index.astro
  const indexPage = `src/pages/${segments.join('/')}/index.astro`;
  if (exists(indexPage)) return true;

  // Check static assets in public/ (fonts, favicon, images, etc.)
  const publicFile = `public${path}`;
  if (exists(publicFile)) return true;

  return false;
}

// ─── Run link extraction ─────────────────────────────────────────────────────

const allLinks = extractLinks();

// Deduplicate: unique (link, file) pairs
const seen = new Set();
const uniqueEntries = allLinks.filter(({ link, file }) => {
  const key = `${link}|||${file}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

// Build a map: normalized path → { files, raw links }
const internalLinkMap = new Map(); // path → { rawLinks: Set, files: Set }
const skipped = { anchor: 0, external: 0, mailto: 0, rss: 0, scheme: 0, dynamic: 0, 'relative-or-other': 0 };

for (const { link, file } of uniqueEntries) {
  const result = classifyLink(link);
  if (result.skip) {
    skipped[result.reason] = (skipped[result.reason] || 0) + 1;
    continue;
  }

  const path = result.path;
  if (!internalLinkMap.has(path)) {
    internalLinkMap.set(path, { rawLinks: new Set(), files: new Set() });
  }
  internalLinkMap.get(path).rawLinks.add(link);
  internalLinkMap.get(path).files.add(file);
}

// ─── Report scan summary ─────────────────────────────────────────────────────

group('Link Validation — scan summary');

console.log(`  Files scanned: ${allFiles.length} (${astroFiles.length} .astro, ${mdFiles.length} .md)`);
console.log(`  Total link occurrences found: ${allLinks.length}`);
console.log(`  Unique internal paths to validate: ${internalLinkMap.size}`);
console.log(`  Skipped: ${Object.entries(skipped).filter(([,v]) => v > 0).map(([k,v]) => `${v} ${k}`).join(', ')}`);

// ─── Validate each internal link ─────────────────────────────────────────────

group('Link Validation — internal link resolution');

const sortedPaths = [...internalLinkMap.keys()].sort();

for (const path of sortedPaths) {
  const { files } = internalLinkMap.get(path);
  const fileList = [...files].sort();

  test(`${path}  (found in ${fileList.length} file${fileList.length > 1 ? 's' : ''})`, () => {
    const resolves = resolveInternalLink(path);
    if (!resolves) {
      throw new Error(
        `Broken link "${path}" — no matching page file.\n` +
        `     Found in: ${fileList.join(', ')}`
      );
    }
  });
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(50));
console.log(`  ${passed} passed  ·  ${failed} failed  ·  ${passed + failed} total`);
console.log('═'.repeat(50));

if (failures.length > 0) {
  console.log('\nBroken links:');
  failures.forEach(({ name, error }) => {
    console.log(`  ✗  ${name}`);
    console.log(`     → ${error}`);
  });
  process.exit(1);
} else {
  console.log('\n  All internal links valid ✓');
  process.exit(0);
}
