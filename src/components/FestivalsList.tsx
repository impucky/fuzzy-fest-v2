import { useStore } from "@nanostores/react";
import { highlightAtom } from "../stores/highlightAtom";

import type { Festival } from "../content.config";

export default function FestivalsList({ festivals, year }: { festivals: Festival[]; year: number }) {
  const $highlight = useStore(highlightAtom);

  return (
    <ul>
      {$highlight ?? "No highlight"}
      {festivals.map((f) => {
        return (
          <li className="p-1 text-center text-white" key={f.slug}>
            <a
              className="text-xl transition hover:text-[salmon]"
              href={`/${year}/${f.slug}`}
              onMouseEnter={() => highlightAtom.set(f.slug)}
              onMouseLeave={() => highlightAtom.set(null)}
            >
              {f.name}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
