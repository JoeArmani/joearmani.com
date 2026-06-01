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
export const nowUpdated = 'May 2026';

export const nowSections: NowSection[] = [
  {
    kind: 'Building',
    summary: 'CourtMix, the ground-up rebuild of Racquet Rivalry, on the agentic dev system.',
    items: [
      { lead: 'CourtMix', body: 'Ground-up Racquet Rivalry rebuild using the agentic development system. Moving significantly faster than the original build.' },
      { lead: 'Custom email system', body: 'A Claude + SendGrid pipeline for automated, personalized outbound email.' },
      { lead: 'This website', body: 'joearmani.com is always in progress. Always something to ship.' },
      { lead: 'Agentic development system', body: 'Refining the spec/test-driven workflow that runs all the projects above.' },
    ],
  },
  {
    kind: 'Working',
    summary: 'Software Engineer at NCI, building data tools for the Connect for Cancer Prevention Study.',
    items: [
      { lead: 'Senior Software Engineer at NCI', body: 'Building data tools for the Connect for Cancer Prevention Study. Three years in and the work still feels meaningful.' },
    ],
  },
  {
    kind: 'Learning',
    summary: 'AI tooling and agentic workflows. The pace right now is hard to overstate.',
    items: [
      { lead: 'AI tooling and agentic workflows', body: 'Following closely. The pace right now is hard to overstate.' },
      { lead: 'Anthropic, OpenAI, and the broader ecosystem', body: "Keeping tabs on what's shipping and what's worth testing." },
    ],
  },
  {
    kind: 'Training',
    summary: 'Century ride prep: a 100-mile ride in the Taos mountains this summer.',
    items: [
      { lead: 'Hot yoga and sculpt', body: 'Regular classes at CorePower. Non-negotiable part of the week.' },
      { lead: 'Century ride prep', body: 'Training for a 100-mile ride in the Taos mountains this summer.' },
    ],
  },
];
