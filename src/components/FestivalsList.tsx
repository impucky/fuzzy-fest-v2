import { useStore } from "@nanostores/react";
import { highlightAtom } from "../stores/highlightAtom";
import { useMemo } from "react";

import type { Festival } from "../content.config";

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $highlight = useStore(highlightAtom);

  const festivalsByMonth = useMemo(() => {
    const sorted = [...festivals].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

    const grouped = new Map<string, Festival[]>();
    for (const f of sorted) {
      const month = new Date(f.startDate).toLocaleString("en-US", { month: "long" }).toUpperCase();
      if (!grouped.has(month)) grouped.set(month, []);
      grouped.get(month)!.push(f);
    }
    return grouped;
  }, [festivals]);

  return (
    <div className="pb-8">
      {[...festivalsByMonth.entries()].map(([month, monthFestivals]) => (
        <div key={month}>
          <div className="mt-5 flex items-center justify-center px-4 opacity-80">
            <div className="flex-1 border-t border-[salmon]"></div>
            <span className="mx-4 text-xl font-bold text-[salmon]">{month}</span>
            <div className="flex-1 border-t border-[salmon]"></div>
          </div>
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
