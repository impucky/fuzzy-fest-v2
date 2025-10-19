import { useStore } from "@nanostores/react";
import { highlightAtom } from "../stores/highlightAtom";

import type { Festival } from "../content.config";

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $highlight = useStore(highlightAtom);

  return (
    <ul>
      {festivals.map((f) => {
        const pastFestival = new Date(f.startDate) < new Date();
        return (
          <li className="text-center" key={f.key}>
            <a
              className={`text-lg leading-snug font-black transition hover:text-[salmon] md:text-xl ${pastFestival ? "text-neutral-400 line-through" : "text-white"}`}
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
  );
}
