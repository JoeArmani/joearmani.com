import type { APIRoute } from 'astro';
import { generateOgImage } from '../../utils/og-image';

export const GET: APIRoute = async () => {
  const png = await generateOgImage({
    title: 'Joe Armani',
    subtitle: 'I build with AI and write about what actually works.',
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
