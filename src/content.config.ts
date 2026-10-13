import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const clearedMedia = z.object({
  alt: z.string().min(1),
  focalPoint: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }),
  source: z.string().regex(/^src\/assets\/(?:print|work|hero)\/[a-z0-9-]+\.(?:png|jpe?g|webp|avif)$/),
  filename: z.string().regex(/^[a-z0-9-]+\.(?:png|jpe?g|webp|avif)$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  sourceNote: z.literal('privacy-reviewed export'),
  clearance: z.literal('approved'),
  clearanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
}).refine((media) => media.source.endsWith(`/${media.filename}`), {
  message: 'Media filename must match its local source',
  path: ['filename'],
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
    status: z.enum(['Pending clearance', 'Approved for display']),
    medium: z.string().min(1),
    spec: z.string().min(1),
    attribution: z.literal('Designed by Kavish Singh while employed at The UPS Store.'),
    privacyCondition: z.string().min(1),
    clearance: z.enum(['pending', 'approved']),
    secondaryMedia: clearedMedia.optional(),
    viewer: z.object({
      kind: z.enum(['card', 'brochure', 'sticker', 'sheet', 'sign']),
      faces: z.array(z.object({
        image: clearedMedia,
        alt: z.string().min(1),
      })).max(4),
    }),
  }).refine((entry) => entry.viewer.faces.every((face) => face.alt === face.image.alt), {
    message: 'Viewer face alt must match its cleared image metadata',
    path: ['viewer', 'faces'],
  }).refine((entry) => entry.clearance === 'approved' || entry.viewer.faces.length === 0, {
    message: 'Pending print entries cannot include viewer faces',
    path: ['viewer', 'faces'],
  }).refine((entry) => entry.clearance !== 'approved' || entry.viewer.faces.length > 0, {
    message: 'Approved print entries need at least one viewer face',
    path: ['viewer', 'faces'],
  }).refine((entry) => entry.clearance === 'approved' || entry.media === undefined, {
    message: 'Pending print entries cannot include media',
    path: ['media'],
  }).refine((entry) => entry.clearance === 'approved' || entry.secondaryMedia === undefined, {
    message: 'Pending print entries cannot include secondary media',
    path: ['secondaryMedia'],
  }).refine((entry) => entry.clearance !== 'approved' || (entry.status === 'Approved for display' && entry.media !== undefined), {
    message: 'Approved print entries need approved media and status',
    path: ['media'],
  }),
});

export const collections = { work, print };
