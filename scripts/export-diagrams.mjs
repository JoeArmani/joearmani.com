#!/usr/bin/env node
/**
 * Export inline-SVG Astro diagram components to 2x PNGs using @resvg/resvg-js.
 *
 * Usage:
 *   node scripts/export-diagrams.mjs --post <slug> [--out <dir>]
 *   node scripts/export-diagrams.mjs --component <DiagramName> [--out <dir>]
 *   node scripts/export-diagrams.mjs --all [--out <dir>]
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const DIAGRAMS_DIR = join(ROOT, 'src', 'components', 'diagrams');
const BLOG_DIR = join(ROOT, 'content', 'blog');
const FONTS_DIR = join(ROOT, 'public', 'fonts');

function printUsage() {
  console.log(`Usage:
  node scripts/export-diagrams.mjs --post <slug> [--out <dir>]
  node scripts/export-diagrams.mjs --component <DiagramName> [--out <dir>]
  node scripts/export-diagrams.mjs --all [--out <dir>]

Options:
  --post <slug>           Export all diagrams imported in content/blog/<slug>.mdx
                          named <slug>-fig<N>-<kebab-name>.png
  --component <name>      Export a single component from src/components/diagrams/
  --all                   Export every *Diagram.astro component
  --out <dir>             Output directory (default: medium-exports)
  -h, --help              Show help`);
}

function parseArgs(argv) {
  const opts = {
    post: null,
    component: null,
    all: false,
    out: 'medium-exports',
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      printUsage();
      process.exit(0);
    } else if (arg === '--all') {
      opts.all = true;
    } else if (arg === '--post' || arg === '--component' || arg === '--out') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error(`Missing value for ${arg}`);
      }
      opts[arg.slice(2)] = value;
      i += 1;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  const modeCount = Number(Boolean(opts.post)) + Number(Boolean(opts.component)) + Number(opts.all);
  if (modeCount !== 1) {
    throw new Error('Specify exactly one of --post, --component, or --all.');
  }

  return opts;
}

function toKebabCase(name) {
  return name
    .replace(/Diagram$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

// Warm-paper Light Mode diagram tokens for standalone PNG export (Resvg does not
// inherit external CSS custom properties from global.css).
const LIGHT_DIAGRAM_TOKENS = {
  '--dg-surface': '#FFFFFF',
  '--dg-lane-bg': '#F7F5F0',
  '--dg-lane-stroke': '#E2DDD4',
  '--dg-card-bg': '#FFFFFF',
  '--dg-card-stroke': '#CFC9BE',
  '--dg-chip-muted-bg': '#EFECE5',
  '--dg-ink': '#1A1816',
  '--dg-ink-2': '#4A453E',
  '--dg-muted': '#6B655D',
  '--dg-conn-faint': '#A69F95',
  '--dg-opaque-bg': '#23201C',
  '--dg-opaque-stroke': '#141311',
  '--dg-opaque-inner': '#57524B',
  '--dg-opaque-ink': '#F7F5F0',
  '--dg-opaque-sub': '#C9C2B6',
  '--dg-blue-bg': '#EEF2F7',
  '--dg-blue-bg-soft': '#F5F7FA',
  '--dg-blue-stroke': '#3B5B82',
  '--dg-blue-ink': '#264163',
  '--dg-blue-rule': '#CFD9E6',
  '--dg-ext-bg': '#EDF4F7',
  '--dg-ext-stroke': '#2D637A',
  '--dg-red-bg': '#FAEDE9',
  '--dg-red-bg-soft': '#FCF4F2',
  '--dg-red-stroke': '#AD3A2B',
  '--dg-red-ink': '#84291D',
  '--dg-red-rule': '#E8C9C3',
  '--dg-orange-bg': '#FAF0E6',
  '--dg-orange-stroke': '#B54B1A',
  '--dg-orange-ink': '#863510',
  '--dg-amber-bg': '#FAF3E3',
  '--dg-amber-bg-soft': '#FCF8EE',
  '--dg-amber-stroke': '#995F14',
  '--dg-purple-bg': '#F4EFF8',
  '--dg-purple-stroke': '#6D4C8C',
  '--dg-purple-ink': '#4E3468',
  '--dg-green-bg': '#EDF4EC',
  '--dg-green-stroke': '#3A6B4C',
  '--dg-green-ink': '#2B5239',
  '--dg-teal-bg': '#ECF4F3',
  '--dg-teal-stroke': '#2E6B66',
};

function resolveCssVars(svg) {
  return svg.replace(/var\(\s*(--[a-z0-9-]+)(?:\s*,\s*([^)]+))?\s*\)/gi, (_, name, fallback) => {
    return LIGHT_DIAGRAM_TOKENS[name] || (fallback ? fallback.trim() : '#1A1816');
  });
}

function prepareSvgMarkup(astroSource, componentName) {
  const svgMatch = astroSource.match(/<svg\b[\s\S]*?<\/svg>/i);
  if (!svgMatch) {
    throw new Error(`No <svg> element found in ${componentName}`);
  }

  let svg = resolveCssVars(svgMatch[0]);

  // Parse viewBox="0 0 W H" (fallback 1320 x 860)
  let width = 1320;
  let height = 860;
  const vbMatch = svg.match(/viewBox\s*=\s*["']([^"']+)["']/i);
  if (vbMatch) {
    const parts = vbMatch[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && Number.isFinite(parts[2]) && Number.isFinite(parts[3])) {
      width = parts[2];
      height = parts[3];
    }
  }

  // Normalize web font stacks so Resvg resolves Newsreader 600 TTF from public/fonts
  // alongside full bold/italic sans & mono weights from system fonts.
  svg = svg
    .replace(
      /['"]DM Sans['"],\s*-apple-system,\s*BlinkMacSystemFont,\s*sans-serif/g,
      "'Helvetica Neue', Helvetica, Arial, sans-serif"
    )
    .replace(
      /system-ui,\s*-apple-system,\s*['"]Segoe UI['"],\s*sans-serif/g,
      "'Helvetica Neue', Helvetica, Arial, sans-serif"
    )
    .replace(
      /['"]JetBrains Mono['"],\s*ui-monospace,\s*['"]?SFMono-Regular['"]?,\s*Menlo,\s*Consolas,\s*monospace/g,
      "'Menlo', 'Monaco', monospace"
    )
    .replace(
      /['"]JetBrains Mono['"],\s*ui-monospace,\s*SFMono-Regular,\s*monospace/g,
      "'Menlo', 'Monaco', monospace"
    )
    .replace(
      /ui-monospace,\s*['"]?SFMono-Regular['"]?,\s*Menlo,\s*Consolas,\s*monospace/g,
      "'Menlo', 'Monaco', monospace"
    );

  // Inject solid white editorial plate background behind all diagram layers
  const bgRect = `<rect x="0" y="0" width="${width}" height="${height}" fill="#FFFFFF"/>`;
  if (/<\/defs>/i.test(svg)) {
    svg = svg.replace(/<\/defs>/i, (match) => `${match}\n    ${bgRect}`);
  } else {
    svg = svg.replace(/<svg\b[^>]*>/i, (match) => `${match}\n    ${bgRect}`);
  }

  return { svg, width, height };
}

function renderDiagramToPng(componentPath, outPath) {
  const componentName = basename(componentPath, '.astro');
  const source = readFileSync(componentPath, 'utf-8');
  const { svg, width } = prepareSvgMarkup(source, componentName);

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width * 2 },
    font: {
      loadSystemFonts: true,
      fontDirs: [FONTS_DIR],
      defaultFontFamily: 'Helvetica Neue',
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, pngBuffer);

  return {
    outPath,
    width: pngData.width,
    height: pngData.height,
    bytes: pngBuffer.length,
  };
}

function resolvePostDiagrams(slug) {
  const mdxPath = join(BLOG_DIR, `${slug}.mdx`);
  const mdPath = join(BLOG_DIR, `${slug}.md`);
  const postPath = existsSync(mdxPath) ? mdxPath : existsSync(mdPath) ? mdPath : null;
  if (!postPath) {
    throw new Error(`Blog post not found for slug "${slug}" under content/blog/`);
  }

  const content = readFileSync(postPath, 'utf-8');
  const importRegex = /^import\s+(\w+)\s+from\s+['"]([^'"]*diagrams\/([^/'"]+?)\.astro)['"];?\s*$/gm;
  const importedByVar = new Map();
  let m;
  while ((m = importRegex.exec(content)) !== null) {
    importedByVar.set(m[1], m[3]);
  }

  if (importedByVar.size === 0) {
    throw new Error(`No diagram component imports found in ${postPath}`);
  }

  // Match component tags in body order
  const usageRegex = new RegExp(`<(${[...importedByVar.keys()].join('|')})\\b[^>]*\\/?>`, 'g');
  const ordered = [];
  const seen = new Set();
  while ((m = usageRegex.exec(content)) !== null) {
    const varName = m[1];
    if (!seen.has(varName)) {
      seen.add(varName);
      ordered.push(importedByVar.get(varName));
    }
  }

  // Fallback to import order if no explicit JSX tags matched
  const diagrams = ordered.length > 0 ? ordered : [...importedByVar.values()];

  return diagrams.map((componentName, index) => {
    const componentPath = join(DIAGRAMS_DIR, `${componentName}.astro`);
    if (!existsSync(componentPath)) {
      throw new Error(`Imported diagram component not found: ${componentPath}`);
    }
    const filename = `${slug}-fig${index + 1}-${toKebabCase(componentName)}.png`;
    return { componentPath, filename };
  });
}

function resolveSingleComponent(name) {
  const cleanName = name.replace(/\.astro$/, '');
  const exact = join(DIAGRAMS_DIR, `${cleanName}.astro`);
  const withSuffix = join(DIAGRAMS_DIR, `${cleanName}Diagram.astro`);
  const componentPath = existsSync(exact) ? exact : existsSync(withSuffix) ? withSuffix : null;

  if (!componentPath) {
    throw new Error(`Diagram component not found: ${cleanName}`);
  }
  const finalName = basename(componentPath, '.astro');
  return [{ componentPath, filename: `${finalName}.png` }];
}

function resolveAllDiagrams() {
  const entries = readdirSync(DIAGRAMS_DIR)
    .filter((file) => file.endsWith('Diagram.astro'))
    .sort();
  return entries.map((file) => ({
    componentPath: join(DIAGRAMS_DIR, file),
    filename: `${basename(file, '.astro')}.png`,
  }));
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const outDir = resolve(ROOT, opts.out);

  let targets;
  if (opts.post) {
    targets = resolvePostDiagrams(opts.post);
  } else if (opts.component) {
    targets = resolveSingleComponent(opts.component);
  } else {
    targets = resolveAllDiagrams();
  }

  for (const { componentPath, filename } of targets) {
    const result = renderDiagramToPng(componentPath, join(outDir, filename));
    const kb = Math.round(result.bytes / 1024);
    console.log(`Exported ${result.outPath} (${result.width}x${result.height}, ${kb} KB)`);
  }
}

try {
  main();
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
