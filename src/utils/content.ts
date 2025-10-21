import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { Festival } from "../content.config";

export async function getFestivalsByYear(year: number): Promise<Festival[]> {
  const collection: CollectionEntry<"festivals">[] = await getCollection("festivals", ({ data }) => {
    return new Date(data.startDate).getFullYear() === year;
  });

  return collection.map(({ data }) => data);
}

export async function getFestivalByYearAndKey(year: number, key: string): Promise<Festival> {
  const collection: CollectionEntry<"festivals">[] = await getCollection("festivals");

  return collection.find(({ data }) => key === data.key && year === new Date(data.startDate).getFullYear())!
    .data;
}
