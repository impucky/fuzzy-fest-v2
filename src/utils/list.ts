import bandsFile from "../../content/bands.json";
import type { Festival } from "../content.config";

export function filterLineups(query: string, festivals: Festival[]): Record<string, string[]> {
  if (!query) return {};

  const bands = bandsFile as Record<string, string>;
  const matchesByFest: Record<string, string[]> = {};

  festivals
    .filter((festival) => festival.lineup && festival.lineup.length > 0)
    .forEach((festival) => {
      const lineup = festival.lineup!;
      const matchingBands = lineup.filter((slug) => slug.split("-").join(" ").includes(query.toLowerCase()));
      matchesByFest[festival.key] = matchingBands.map((slug) => bands[slug]);
    });

  return matchesByFest;
}
