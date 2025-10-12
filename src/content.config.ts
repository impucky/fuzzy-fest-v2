import { defineCollection, z } from "astro:content";
import type { InferEntrySchema } from "astro:content";
import { glob, file } from "astro/loaders";

const bands = defineCollection({
  loader: file("src/_content/bands.json"),
  schema: z.object({
    slug: z.string(),
    name: z.string(),
  }),
});

const festivals = defineCollection({
  loader: glob({ pattern: "src/_content/festivals/*/*.json" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      slug: z.string(),
      img: image().optional(),
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
    }),
});

export const collections = { bands, festivals };

export type Festival = InferEntrySchema<"festivals">;
