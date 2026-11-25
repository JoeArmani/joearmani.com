import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load fonts once at build time
const fontDir = join(process.cwd(), 'public', 'fonts');
const newsreaderSemibold = readFileSync(join(fontDir, 'newsreader-600.ttf'));
const dmSansRegular = readFileSync(join(fontDir, 'dm-sans-400.ttf'));

// Warm obsidian & parchment publication palette
const COLOR = {
  bg: '#141311',
  fg: '#EDE9E1',
  fg2: '#ABA49A',
  fg3: '#8E877D',
  warm: '#E27D4B',
  rule: '#2B2823',
  tagText: '#ABA49A',
  tagBg: 'rgba(237, 233, 225, 0.06)',
  tagBorder: 'rgba(237, 233, 225, 0.16)',
};

interface OgImageOptions {
  title: string;
  subtitle?: string;
  tags?: string[];
  date?: string;
}

export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const { title, subtitle, tags = [], date } = options;

  const titleSize = title.length > 60 ? '48px' : title.length > 40 ? '56px' : '66px';

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 76px',
          background: COLOR.bg,
          borderTop: `6px solid ${COLOR.warm}`,
          fontFamily: 'DM Sans',
          color: COLOR.fg,
        },
        children: [
          // Top: editorial wordmark + domain
          {
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontFamily: 'Newsreader',
                      fontSize: '28px',
                      fontWeight: 600,
                      color: COLOR.fg,
                      letterSpacing: '-0.02em',
                    },
                    children: 'Joe Armani',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 400,
                      color: COLOR.warm,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                    },
                    children: 'joearmani.com',
                  },
                },
              ],
            },
          },

          // Middle: Newsreader title + DM Sans subtitle
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '22px', flex: '1', justifyContent: 'center' },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: titleSize,
                      fontFamily: 'Newsreader',
                      fontWeight: 600,
                      lineHeight: 1.08,
                      letterSpacing: '-0.025em',
                      margin: 0,
                      color: COLOR.fg,
                    },
                    children: title,
                  },
                },
                ...(subtitle ? [{
                  type: 'p',
                  props: {
                    style: { fontSize: '24px', color: COLOR.fg2, lineHeight: 1.48, margin: 0, maxWidth: '920px' },
                    children: subtitle,
                  },
                }] : []),
              ],
            },
          },

          // Bottom: neutral tags + date, with subtle hairline above
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${COLOR.rule}`,
                paddingTop: '26px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '10px' },
                    children: tags.slice(0, 4).map((tag) => ({
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          color: COLOR.tagText,
                          background: COLOR.tagBg,
                          border: `1px solid ${COLOR.tagBorder}`,
                          padding: '5px 12px',
                          borderRadius: '4px',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: COLOR.fg3,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      marginLeft: '24px',
                    },
                    children: date || 'Building with AI',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Newsreader', data: newsreaderSemibold, weight: 600, style: 'normal' },
        { name: 'DM Sans', data: dmSansRegular, weight: 400, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return resvg.render().asPng();
}
