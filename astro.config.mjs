import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://joearmani.com',
  integrations: [mdx(), sitemap()],
  redirects: {
    // Racquet Rivalry was rebuilt and rebranded as CourtMix.
    '/projects/racquet-rivalry/': '/projects/courtmix/',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
    },
  },
});
