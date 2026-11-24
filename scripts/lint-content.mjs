#!/usr/bin/env node
/**
 * Guardrail & voice linter for joearmani.com Markdown/MDX content.
 *
 * Hard errors (exit 1):
 *   - Staging/local URL leaks
 *   - Em dashes in YAML frontmatter descriptions
 *   - Missing required frontmatter fields on published blog posts
 *   - Stale 30-minute daily review metric in ai-email-pipeline-manual-on-purpose.mdx
 *   - CourtMix proprietary / unlaunched red-line term leaks
 *
 * Voice / Claude-ism warnings (exit 1 only with --strict):
 *   - Banned buzzwords / cliches from brand-voice.md
 *   - Excessive em dashes in prose
 *   - Stacked negative parallelism ("It is not X. It is Y.")
 *   - Staccato 1-sentence paragraph streaks (3+ consecutive)
 *   - Rhetorical question chains (3+ questions in one paragraph)
 *
 * Usage:
 *   node scripts/lint-content.mjs [--strict] [file ...]
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const BANNED_PHRASES = [
  'delve',
  'moreover',
  'furthermore',
  "it's worth noting",
  'landscape',
  'synergy',
  'game-changing',
  'unlock',
  'move the needle',
  'hot take',
  'unpack',
  'excited to share',
  'thrilled to share',
  'thrilled to announce',
  'humbled to',
  "in today's rapidly evolving",
  'at the end of the day',
  'moving forward',
  'circle back',
];

const STAGING_PATTERNS = [
  /staging\.peaktopeaksystems\.com/i,
  /https?:\/\/localhost(?::\d+)?/i,
  /https?:\/\/127\.0\.0\.1(?::\d+)?/i,
];

const COURTMIX_REDLINES = [
  { label: 'Google Places reference', regex: /\bgoogle\s+places\b/i },
  {
    label: 'private-lot / dedup threshold detail',
    regex: /\b(dedup|deduplication|private[- ]lot)\s+(threshold|score|cutoff|rule)\b/i,
  },
  { label: 'paid-placement ranking detail', regex: /\bpaid[- ]placement\b/i },
  {
    label: 'unlaunched feature / internal wave detail',
    regex: /\b(paid\s+plans?|court\s+booking|player\s+booking|enrichment\s+waves?|holdout\s+tests?)\b/i,
  },
];

function parseArgs(argv) {
  let strict = false;
  const files = [];

  for (const arg of argv) {
    if (arg === '--strict') {
      strict = true;
    } else if (arg === '-h' || arg === '--help') {
      console.log('Usage: node scripts/lint-content.mjs [--strict] [file ...]');
      process.exit(0);
    } else {
      files.push(arg);
    }
  }

  return { strict, files };
}

function collectDefaultFiles() {
  const targets = [];
  for (const dir of [join(ROOT, 'content', 'blog'), join(ROOT, 'content', 'projects')]) {
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir).sort()) {
      const full = join(dir, entry);
      if (statSync(full).isFile() && (extname(entry) === '.md' || extname(entry) === '.mdx')) {
        targets.push(full);
      }
    }
  }
  return targets;
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw, rawFrontmatter: '' };
  }

  const rawFrontmatter = match[1];
  const body = match[2];
  const data = {};
  let currentKey = null;

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const val = kv[2].trim();
      if (val === '') {
        data[currentKey] = [];
      } else {
        data[currentKey] = val.replace(/^["']|["']$/g, '');
      }
      continue;
    }

    const listItem = line.match(/^\s*-\s+(.*)$/);
    if (listItem && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      data[currentKey].push(listItem[1].trim().replace(/^["']|["']$/g, ''));
    }
  }

  return { data, body, rawFrontmatter };
}

function stripNonProse(body) {
  return body
    .replace(/```[\s\S]*?```/g, '\n')
    .replace(/^import\s+.*$/gm, '')
    .replace(/<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g, '');
}

function countSentences(paragraph) {
  const cleaned = paragraph.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
  if (!cleaned) return 0;
  const parts = cleaned.split(/[.!?]+(?:\s|$)/).filter((s) => s.trim().length > 0);
  return parts.length;
}

function lintFile(absPath) {
  const relPath = relative(ROOT, absPath);
  const raw = readFileSync(absPath, 'utf-8');
  const { data, body } = parseFrontmatter(raw);
  const prose = stripNonProse(body);

  const errors = [];
  const warnings = [];

  // 1. Hard: Staging / local URL leaks
  for (const pattern of STAGING_PATTERNS) {
    if (pattern.test(raw)) {
      errors.push(`Staging or local URL leak matched (${pattern.source})`);
    }
  }

  // 2. Hard: Em dashes in frontmatter description
  if (typeof data.description === 'string' && data.description.includes('—')) {
    errors.push('Frontmatter description contains an em dash (—)');
  }

  // 3. Hard: Required frontmatter on published blog posts
  const isBlog = relPath.startsWith('content/blog/');
  const isDraft = data.draft === 'true';
  if (isBlog && !isDraft) {
    for (const key of ['title', 'description', 'date', 'tags', 'readingTime']) {
      const val = data[key];
      const missing = val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
      if (missing) {
        errors.push(`Published blog post missing required frontmatter field: ${key}`);
      }
    }
  }

  // 4. Hard: Stale metric guard on email pipeline post
  if (basename(absPath) === 'ai-email-pipeline-manual-on-purpose.mdx') {
    if (/30 minutes of daily review|involves maybe 30 minutes/i.test(prose) || !/15 minutes/i.test(prose)) {
      errors.push('Email pipeline post must reflect updated ~15 minutes daily operator review metric');
    }
  }

  // 5. Hard: CourtMix red-line check (unless explicitly exempted)
  const isCourtmixDoc =
    relPath.includes('courtmix') ||
    /courtmix\.net/i.test(raw) ||
    /\bcourtmix\b/i.test(String(data.title || ''));
  const redLineAllowed = raw.includes('<!-- lint-allow: red-line -->');
  if (isCourtmixDoc && !redLineAllowed) {
    for (const { label, regex } of COURTMIX_REDLINES) {
      const hit = prose.match(regex);
      if (hit) {
        errors.push(`CourtMix red-line term (${label}): "${hit[0]}"`);
      }
    }
  }

  // 6. Voice warning: Banned cliches / AI buzzwords
  for (const phrase of BANNED_PHRASES) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = prose.match(regex);
    if (matches) {
      warnings.push(`Banned phrase "${phrase}" (${matches.length}x)`);
    }
  }

  // 7. Voice warning: Em dashes in prose body
  const emDashCount = (prose.match(/—/g) || []).length;
  const maxEmDashes = isBlog ? 2 : 0;
  if (emDashCount > maxEmDashes) {
    warnings.push(`Too many em dashes in prose (${emDashCount}; limit ${maxEmDashes})`);
  }

  // 8. Voice warning: Stacked negative parallelism
  const negParallelA =
    prose.match(/(?:it(?:'s| is)|that(?:'s| is)|this)\s+not\s+[^.!?\n]{2,60}[.!?;]\s*(?:it(?:'s| is)|that(?:'s| is)|this)/gi) || [];
  const negParallelB = prose.match(/\bisn't (?:just|only)\b/gi) || [];
  const negTotal = negParallelA.length + negParallelB.length;
  if (negTotal >= 3) {
    warnings.push(`Stacked "not X / it is Y" antithesis pattern (${negTotal}x)`);
  }

  // 9. Voice warning: Staccato 1-sentence paragraph streaks & question chains
  const blocks = prose.split(/\r?\n\s*\r?\n/);
  let singleStreak = 0;
  let maxSingleStreak = 0;
  let maxQuestionsInPara = 0;

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const qCount = (trimmed.match(/\?/g) || []).length;
    if (qCount > maxQuestionsInPara) {
      maxQuestionsInPara = qCount;
    }

    const isProseBlock =
      !/^(#{1,6}\s|[-*+]\s|\d+\.\s|>\s|<|```|\*\*How to read)/.test(trimmed);

    if (isProseBlock && countSentences(trimmed) === 1) {
      singleStreak += 1;
      if (singleStreak > maxSingleStreak) maxSingleStreak = singleStreak;
    } else {
      singleStreak = 0;
    }
  }

  if (maxSingleStreak >= 3) {
    warnings.push(`Staccato 1-sentence paragraph streak (${maxSingleStreak} in a row)`);
  }
  if (maxQuestionsInPara >= 3) {
    warnings.push(`Rhetorical question cluster (${maxQuestionsInPara} questions in one paragraph)`);
  }

  return { relPath, errors, warnings };
}

function main() {
  const { strict, files } = parseArgs(process.argv.slice(2));
  const targets =
    files.length > 0
      ? files.map((file) => resolve(ROOT, file))
      : collectDefaultFiles();

  if (targets.length === 0) {
    console.error('No content files found to lint.');
    process.exit(1);
  }

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const target of targets) {
    if (!existsSync(target)) {
      console.error(`File not found: ${target}`);
      totalErrors += 1;
      continue;
    }

    const { relPath, errors, warnings } = lintFile(target);
    totalErrors += errors.length;
    totalWarnings += warnings.length;

    if (errors.length === 0 && warnings.length === 0) {
      console.log(`PASS  ${relPath}`);
      continue;
    }

    const level = errors.length > 0 ? 'FAIL' : 'WARN';
    console.log(`${level}  ${relPath}`);
    for (const err of errors) {
      console.log(`  [error] ${err}`);
    }
    for (const warn of warnings) {
      console.log(`  [warn]  ${warn}`);
    }
  }

  console.log(`\nSummary: ${targets.length} file(s), ${totalErrors} error(s), ${totalWarnings} warning(s)`);

  if (totalErrors > 0 || (strict && totalWarnings > 0)) {
    process.exit(1);
  }
}

main();
