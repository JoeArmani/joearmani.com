import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['Active', 'Shipped', 'Rebuilding', 'Research', 'Ongoing']),
    tags: z.array(z.string()),
    order: z.number(),
    featured: z.boolean().default(false),
    links: z.object({
      github: z.string().optional(),
      live: z.string().optional(),
      appStore: z.string().optional(),
      playStore: z.string().optional(),
    }).optional(),
  }),
});

export const collections = { blog, projects };
