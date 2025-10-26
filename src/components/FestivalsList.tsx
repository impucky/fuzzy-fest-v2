import Spacer from "./Spacer";

import { useStore } from "@nanostores/react";
import { highlightAtom } from "../nano/highlightAtom";
import { mapFiltersAtom } from "../nano/mapFiltersAtom";
import { filterFestivals } from "../utils/map";
import { useMemo } from "react";

import type { Festival } from "../content.config";

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $highlight = useStore(highlightAtom);
  const $filters = useStore(mapFiltersAtom);

  const festivalsByMonth = useMemo(() => {
    const filtered = filterFestivals(festivals, $filters, null);
    const sorted = [...filtered].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    const grouped = new Map<string, Festival[]>();
    for (const f of sorted) {
      const month = new Date(f.startDate).toLocaleString("en-US", { month: "long" }).toUpperCase();
      if (!grouped.has(month)) grouped.set(month, []);
      grouped.get(month)!.push(f);
    }
    return grouped;
  }, [festivals, $filters]);

  return (
    <div className="overflow-auto pb-8">
      {[...festivalsByMonth.entries()].map(([month, monthFestivals]) => (
        <div key={month}>
          <Spacer label={month} />
          <ul>
            {monthFestivals.map((f) => {
              const pastFestival = new Date(f.startDate) < new Date();
              return (
                <li className="text-center" key={f.key}>
                  <a
                    className={`text-lg leading-snug font-black transition hover:text-[salmon] hover:underline md:text-xl ${
                      pastFestival ? "text-neutral-400 line-through" : "text-white"
                    }`}
                    href={`/${year}/${f.key}`}
                    onMouseEnter={() => highlightAtom.set(f.key)}
                    onMouseLeave={() => highlightAtom.set(null)}
                  >
                    {f.name.toUpperCase()}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
