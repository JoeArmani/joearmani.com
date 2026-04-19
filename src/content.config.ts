import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { NEVER, z } from 'astro/zod';
import { normalizeEditorialDate } from './utils/dates';

const editorialDate = z.union([z.string(), z.date()]).transform((value, ctx) => {
  try {
    return normalizeEditorialDate(value);
  } catch {
    ctx.addIssue({
      code: 'custom',
      message: 'Expected a valid editorial date like YYYY-MM-DD.',
    });

    return NEVER;
  }
});

const optionalHttpsUrl = z.preprocess(
  (value) => {
    if (typeof value !== 'string') {
      return value;
    }

    const trimmedValue = value.trim();
    return trimmedValue === '' ? undefined : trimmedValue;
  },
  z
    .url()
    .refine((value) => new URL(value).protocol === 'https:', {
      message: 'Expected an https URL.',
    })
    .optional()
);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: editorialDate,
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
    lastModified: editorialDate.optional(),
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
      github: optionalHttpsUrl,
      live: optionalHttpsUrl,
      appStore: optionalHttpsUrl,
      playStore: optionalHttpsUrl,
    }).optional(),
  }),
});

export const collections = { blog, projects };
