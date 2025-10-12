import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Festival } from "../content.config";

export async function getFestivalsByYear(year: number): Promise<Festival[]> {
  const collection: CollectionEntry<"festivals">[] = await getCollection(
    "festivals",
    ({ data }) => {
      return new Date(data.startDate).getFullYear() === year;
    },
  );

  return collection.map(({ data }) => data);
}

export async function getBandNamesFromSlugs(slugs: string[]): Promise<string[]> {
  const bands = await getCollection("bands");

  return slugs
    .map((slug) => bands.find((b) => b.data.slug === slug)?.data.name)
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b));
}
