import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load fonts once at build time
const fontDir = join(process.cwd(), 'public', 'fonts');
const plusJakartaBold = readFileSync(join(fontDir, 'plus-jakarta-sans-700.ttf'));
const dmSansRegular = readFileSync(join(fontDir, 'dm-sans-400.ttf'));

// Forge palette (dark theme)
const COLOR = {
  bg: '#0F1117',
  fg: '#E6EDF3',
  fg2: '#8B949E',
  fg3: '#7D8590',
  warm: '#E8913A',
  tick: '#3D444D',
  tagText: '#A8B0BA',
  tagBg: 'rgba(139, 148, 158, 0.12)',
  tagBorder: 'rgba(139, 148, 158, 0.28)',
};

interface OgImageOptions {
  title: string;
  subtitle?: string;
  tags?: string[];
  date?: string;
}

// A subtle technical-drawing corner tick (two 2px bars forming an L).
function cornerTick(pos: 'tl' | 'tr' | 'bl' | 'br') {
  const v = pos[0] === 't' ? { top: '0' } : { bottom: '0' };
  const h = pos[1] === 'l' ? { left: '0' } : { right: '0' };
  const place: Record<string, string> = {
    ...(pos[0] === 't' ? { top: '40px' } : { bottom: '40px' }),
    ...(pos[1] === 'l' ? { left: '46px' } : { right: '46px' }),
  };
  return {
    type: 'div',
    props: {
      style: { position: 'absolute', width: '22px', height: '22px', display: 'flex', ...place },
      children: [
        { type: 'div', props: { style: { position: 'absolute', width: '22px', height: '2px', background: COLOR.tick, ...v, ...h } } },
        { type: 'div', props: { style: { position: 'absolute', width: '2px', height: '22px', background: COLOR.tick, ...v, ...h } } },
      ],
    },
  };
}

export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const { title, subtitle, tags = [], date } = options;

  const titleSize = title.length > 60 ? '46px' : title.length > 40 ? '54px' : '62px';

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
          padding: '64px 72px',
          background: COLOR.bg,
          fontFamily: 'DM Sans',
          color: COLOR.fg,
        },
        children: [
          // Technical corner ticks
          cornerTick('tl'),
          cornerTick('tr'),
          cornerTick('bl'),
          cornerTick('br'),

          // Top: crosshair mark + tracked brand label
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '16px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { position: 'relative', width: '20px', height: '20px', display: 'flex' },
                    children: [
                      { type: 'div', props: { style: { position: 'absolute', left: '9px', top: '0', width: '2px', height: '20px', background: COLOR.warm } } },
                      { type: 'div', props: { style: { position: 'absolute', top: '9px', left: '0', width: '20px', height: '2px', background: COLOR.warm } } },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '22px', fontWeight: 400, color: COLOR.fg2, letterSpacing: '0.18em', textTransform: 'uppercase' },
                    children: 'joearmani.com',
                  },
                },
              ],
            },
          },

          // Middle: title + subtitle
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '20px', flex: '1', justifyContent: 'center' },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: titleSize,
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 700,
                      lineHeight: 1.05,
                      letterSpacing: '-0.02em',
                      margin: 0,
                      color: COLOR.fg,
                    },
                    children: title,
                  },
                },
                ...(subtitle ? [{
                  type: 'p',
                  props: {
                    style: { fontSize: '24px', color: COLOR.fg2, lineHeight: 1.45, margin: 0, maxWidth: '900px' },
                    children: subtitle,
                  },
                }] : []),
              ],
            },
          },

          // Bottom: neutral tags + date/brand, with a hairline above
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: `1px solid ${COLOR.tick}`,
                paddingTop: '28px',
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
                          fontSize: '17px',
                          color: COLOR.tagText,
                          background: COLOR.tagBg,
                          border: `1px solid ${COLOR.tagBorder}`,
                          padding: '5px 14px',
                          borderRadius: '20px',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '17px', color: COLOR.fg3, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '24px' },
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
        { name: 'Plus Jakarta Sans', data: plusJakartaBold, weight: 700, style: 'normal' },
        { name: 'DM Sans', data: dmSansRegular, weight: 400, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return resvg.render().asPng();
}
