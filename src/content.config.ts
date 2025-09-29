import { defineCollection, z } from "astro:content";

import { glob, file } from "astro/loaders";

const bands = defineCollection({
  loader: file("src/content/bands.json"),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
  }),
});

const festivalSchema = z.object({
  name: z.string(),
  slug: z.string(),
  website: z.string(),
  country: z.string(),
  city: z.string(),
  lat: z.number(),
  lng: z.number(),
  indoor: z.boolean(),
  startDate: z.string(),
  endDate: z.string(),
  provisionalDate: z.boolean().optional(),
  playlistId: z.string().optional(),
  note: z.string().optional(),
  lineup: z.array(z.string()).optional(),
});

const festivals = defineCollection({
  loader: glob({ pattern: "src/content/festivals/*/*.json" }),
  schema: festivalSchema,
});

export const collections = { bands, festivals };

export type Festival = z.infer<typeof festivalSchema>;
