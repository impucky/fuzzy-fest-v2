import Spacer from "./Spacer";

import bandsFile from "../../content/bands.json";

import { useStore } from "@nanostores/react";
import { highlightAtom } from "../nano/highlightAtom";
import { mapFiltersAtom } from "../nano/mapFiltersAtom";
import { filterFestivals } from "../utils/map";
import { useMemo } from "react";

import type { Festival } from "../content.config";

function filterLineups(query: string, festivals: Festival[]): Record<string, string[]> {
  if (!query) return {};

  const bands = bandsFile as Record<string, string>;
  const matchesByFest: Record<string, string[]> = {};

  festivals
    .filter((festival) => festival.lineup && festival.lineup.length > 0)
    .forEach((festival) => {
      const lineup = festival.lineup!;
      const matchingBands = lineup.filter((slug) => bands[slug].toLowerCase().includes(query.toLowerCase()));
      matchesByFest[festival.key] = matchingBands.map((slug) => bands[slug]);
    });

  return matchesByFest;
}

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $filters = useStore(mapFiltersAtom);

  const filteredFestivals = useMemo(() => {
    return filterFestivals(festivals, $filters, null);
  }, [festivals, $filters]);

  const festivalsByMonth = useMemo(() => {
    const sorted = [...filteredFestivals].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    const grouped = new Map<string, Festival[]>();
    for (const f of sorted) {
      const month = new Date(f.startDate).toLocaleString("en-US", { month: "long" }).toUpperCase();
      if (!grouped.has(month)) grouped.set(month, []);
      grouped.get(month)!.push(f);
    }
    return grouped;
  }, [filteredFestivals]);

  const matchingBands = useMemo(() => {
    return filterLineups($filters.query, filteredFestivals);
  }, [filteredFestivals]);

  return (
    <div className="overflow-auto pb-8">
      {[...festivalsByMonth.entries()].map(([month, monthFestivals]) => (
        <div key={month}>
          <Spacer label={month} />
          <ul>
            {monthFestivals.map((f) => {
              const pastFestival = new Date(f.startDate) < new Date();
              const bands = matchingBands[f.key] && matchingBands[f.key].join(", ");
              return (
                <li className="text-center" key={f.key}>
                  <a
                    className={`text-md leading-snug font-black transition hover:text-[salmon] hover:underline md:text-lg ${
                      pastFestival ? "text-neutral-400 line-through" : "text-white"
                    }`}
                    href={`/${year}/${f.key}`}
                    onMouseEnter={() => highlightAtom.set(f.key)}
                    onMouseLeave={() => highlightAtom.set(null)}
                  >
                    {f.name.toUpperCase()}
                  </a>
                  {bands && <p className="mb-2 text-sm text-neutral-500">{bands}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
