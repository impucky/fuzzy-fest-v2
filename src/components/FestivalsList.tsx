import Spacer from "./Spacer";

import { filterLineups } from "../utils/list";
import { useStore } from "@nanostores/react";
import { highlightAtom } from "../nano/highlightAtom";
import { mapFiltersAtom } from "../nano/mapFiltersAtom";
import { filterFestivals } from "../utils/map";

import type { Festival } from "../content.config";

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $filters = useStore(mapFiltersAtom);

  const filteredFestivals = filterFestivals(festivals, $filters, null);

  const sortedFestivals = [...filteredFestivals].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  const festivalsByMonth = new Map<string, Festival[]>();

  for (const festival of sortedFestivals) {
    const month = new Date(festival.startDate).toLocaleString("en-US", { month: "long" }).toUpperCase();
    if (!festivalsByMonth.has(month)) festivalsByMonth.set(month, []);
    festivalsByMonth.get(month)!.push(festival);
  }

  const matchingBands = filterLineups($filters.query, filteredFestivals);

  return (
    <div className="overflow-auto pb-8">
      {[...festivalsByMonth.entries()].map(([month, festivals]) => (
        <div key={month}>
          <Spacer label={month} />
          <ul>
            {festivals.map((festival) => {
              const bands = matchingBands[festival.key] && matchingBands[festival.key].join(", ");
              const route = `/${year}/${festival.key}`;
              return <ListEntry key={festival.key} festival={festival} bands={bands} route={route} />;
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ListEntry({ festival, route, bands }: { festival: Festival; route: string; bands?: string }) {
  const $highlight = useStore(highlightAtom);
  const pastFestival = new Date(festival.startDate) < new Date();
  const color =
    $highlight === festival.key ? "text-[lightcoral]" : pastFestival ? "text-neutral-400" : "text-neutral-50";

  return (
    <li className="text-center">
      <a
        className={`text-md leading-snug font-black tracking-wide transition hover:text-[lightcoral] hover:underline md:text-lg ${pastFestival ? "line-through" : ""} ${color}`}
        href={route}
        onMouseEnter={() => highlightAtom.set(festival.key)}
        onMouseLeave={() => highlightAtom.set(null)}
        data-astro-prefetch
      >
        {festival.name.toUpperCase()}
      </a>
      {bands && <p className="mb-2 text-sm text-neutral-500">{bands}</p>}
    </li>
  );
}
