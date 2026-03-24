import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { compareEditorialDatesDesc, toRssPublicationDate } from '../utils/dates';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  return rss({
    title: 'Joe Armani',
    description: 'I build AI-powered systems and write about what actually works.',
    site: context.site,
    items: posts
      .sort((a, b) => compareEditorialDatesDesc(a.data.date, b.data.date))
      .map((post) => ({
        title: post.data.title,
        pubDate: toRssPublicationDate(post.data.date),
        description: post.data.description,
        link: `/blog/${post.id}/`,
      })),
  });
}
