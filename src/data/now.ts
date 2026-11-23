// Single source of truth for the "Now" snapshot.
//
// The /now page renders the full `items` for each section; the homepage Now
// section shows the one-line `summary`. Edit here and both stay in sync.
// Voice: no em-dashes, plain concrete language, no "Senior" in the short-form
// homepage summaries.

export interface NowItem {
  /** Bold lead shown on the /now page. */
  lead: string;
  /** The rest of the line on the /now page. */
  body: string;
}

export interface NowSection {
  /** Category label. Also the mono tag on the homepage. */
  kind: string;
  /** One-line snapshot shown on the homepage Now section. */
  summary: string;
  /** Full detail shown on the /now page. */
  items: NowItem[];
}

/** Human-readable last-updated label, shown on both the homepage and /now. */
export const nowUpdated = 'November 2026';

export const nowSections: NowSection[] = [
  {
    kind: 'Building',
    summary: 'CourtMix (5,000+ verified places across four states), multi-agent workflows, and writing more regularly.',
    items: [
      { lead: 'CourtMix', body: 'Live web directory at courtmix.net with 5,000+ verified places across four states, powered by AI extraction and independent verification with human approval on merges and hard-to-undo changes.' },
      { lead: 'Multi-agent workflows', body: 'Running Claude Code, Codex, and my personal OpenClaw setup across product builds, content workflows, and ops.' },
      { lead: 'Private systematic trading tooling', body: 'Continuing quiet work on ES futures execution and early options-selling tools.' },
      { lead: 'This website', body: 'Refreshing joearmani.com and tightening my publishing pipeline so writing ships alongside product work.' },
    ],
  },
  {
    kind: 'Working',
    summary: 'Software Engineer at NCI, building data tools for the Connect for Cancer Prevention Study.',
    items: [
      { lead: 'Senior Software Engineer at NCI', body: 'Building data tools for the Connect for Cancer Prevention Study (via Cirrus Lake Solutions). Three-plus years in and the work still feels meaningful.' },
    ],
  },
  {
    kind: 'Learning',
    summary: 'Verification pipelines, deterministic guardrails around LLMs, and visual technical storytelling.',
    items: [
      { lead: 'Applied AI reliability', body: 'Testing where AI extraction and independent verification hold up against messy real-world data, and where deterministic checks have to own the math.' },
      { lead: 'Short-form technical content', body: 'Experimenting with diagrams, visual explanations, and short-form video formats around real AI/ML and engineering topics.' },
    ],
  },
  {
    kind: 'Training',
    summary: "CorePower yoga and sculpt, plus early prep for Colorado's Triple Bypass next summer.",
    items: [
      { lead: 'Hot yoga and sculpt', body: 'Regular classes at CorePower. Still a non-negotiable part of the week.' },
      { lead: 'Triple Bypass prep', body: "Finished the full Enchanted Circle century ride in Taos this past summer, and now planning and training for Colorado's Triple Bypass next summer." },
    ],
  },
];
