import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const clearedMedia = z.object({
  alt: z.string().min(1),
  focalPoint: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }),
  source: z.string().regex(/^src\/assets\//),
  clearance: z.literal('approved'),
});

const common = {
  slug,
  order: z.number().int().positive(),
  owner: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  proofPolicy: z.string().min(1),
  media: clearedMedia.optional(),
};

const work = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/work' }),
  schema: z.object({
    ...common,
    kind: z.enum(['Client work', 'Studio product']),
    status: z.enum(['Live', 'In progress', 'Studio tool']),
    publicUrl: z.string().url().startsWith('https://').optional(),
  }),
});

const print = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/print' }),
  schema: z.object({
    ...common,
    kind: z.literal('Print work'),
    status: z.literal('Pending clearance'),
    medium: z.string().min(1),
    attribution: z.literal('Designed by Kavish Singh while employed at The UPS Store.'),
    privacyCondition: z.string().min(1),
    clearance: z.enum(['pending', 'approved']),
  }).refine((entry) => entry.clearance === 'approved' || entry.media === undefined, {
    message: 'Pending print entries cannot include media',
    path: ['media'],
  }),
});

export const collections = { work, print };
