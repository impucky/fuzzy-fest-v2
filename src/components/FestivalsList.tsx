import { useStore } from "@nanostores/react";
import { highlightAtom } from "../stores/highlightAtom";

import type { Festival } from "../content.config";

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $highlight = useStore(highlightAtom);

  return (
    <ul>
      {festivals.map((f) => {
        return (
          <li className="text-center text-white" key={f.slug}>
            <a
              className="text-md leading-snug font-black transition hover:text-[salmon] sm:text-xl md:text-2xl"
              href={`/${year}/${f.slug}`}
              onMouseEnter={() => highlightAtom.set(f.slug)}
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
