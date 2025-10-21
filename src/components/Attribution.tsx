import Info from "../icons/info.svg?react";
import { useState } from "react";

export default function Attribution() {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="absolute right-2 bottom-2 z-[999] flex text-xs">
        {show && (
          <div className="bgnoise mr-1 flex items-center gap-1 rounded-xl bg-neutral-900 px-3 py-1 text-neutral-300 shadow-[0_0_8px_rgba(0,0,0,0.7)]">
            <a
              href="https://maplibre.org/"
              target="_blank"
              className="text-[salmon] underline transition hover:text-white"
            >
              MapLibre
            </a>
            |
            <a
              href="https://openfreemap.org"
              target="_blank"
              className="text-[salmon] underline transition hover:text-white"
            >
              OpenFreeMap
            </a>
            <a
              href="https://www.openmaptiles.org/"
              target="_blank"
              className="text-[salmon] underline transition hover:text-white"
            >
              © OpenMapTiles
            </a>
            Data from
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              className="text-[salmon] underline transition hover:text-white"
            >
              OpenStreetMap
            </a>
          </div>
        )}
        <Info
          className="bgnoise size-8 cursor-pointer rounded-full bg-neutral-900 p-1 font-bold text-neutral-300 shadow-[0_0_8px_rgba(0,0,0,0.7)] transition hover:bg-neutral-800 hover:text-[salmon]"
          onClick={() => setShow(!show)}
        />
      </div>
    </>
  );
}
