import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load fonts once at build time
const fontDir = join(process.cwd(), 'public', 'fonts');
const plusJakartaBold = readFileSync(join(fontDir, 'plus-jakarta-sans-700.ttf'));
const dmSansRegular = readFileSync(join(fontDir, 'dm-sans-400.ttf'));

interface OgImageOptions {
  title: string;
  subtitle?: string;
  tags?: string[];
  date?: string;
}

export async function generateOgImage(options: OgImageOptions): Promise<Buffer> {
  const { title, subtitle, tags = [], date } = options;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          background: 'linear-gradient(135deg, #0F1117 0%, #161B22 50%, #1C2333 100%)',
          fontFamily: 'DM Sans',
          color: '#E6EDF3',
        },
        children: [
          // Top: Name + accent line
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '40px',
                            height: '3px',
                            background: '#E8913A',
                            borderRadius: '2px',
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 400,
                            color: '#8B949E',
                            letterSpacing: '0.05em',
                          },
                          children: 'joearmani.com',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Middle: Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                flex: '1',
                justifyContent: 'center',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: title.length > 60 ? '42px' : title.length > 40 ? '48px' : '56px',
                      fontFamily: 'Plus Jakarta Sans',
                      fontWeight: 700,
                      lineHeight: 1.2,
                      margin: 0,
                      color: '#E6EDF3',
                    },
                    children: title,
                  },
                },
                ...(subtitle ? [{
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '22px',
                      color: '#8B949E',
                      lineHeight: 1.5,
                      margin: 0,
                    },
                    children: subtitle,
                  },
                }] : []),
              ],
            },
          },
          // Bottom: Tags + Date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              children: [
                // Tags
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '10px',
                    },
                    children: tags.map((tag) => ({
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          color: '#3B82F6',
                          background: 'rgba(59, 130, 246, 0.1)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          padding: '4px 12px',
                          borderRadius: '20px',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
                // Date or brand
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#7D8590',
                    },
                    children: date || 'Builder · Engineer · AI Practitioner',
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
        {
          name: 'Plus Jakarta Sans',
          data: plusJakartaBold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'DM Sans',
          data: dmSansRegular,
          weight: 400,
          style: 'normal',
        },
      ],
    }
  );

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  return resvg.render().asPng();
}
