import { useEffect } from "react";
import Sun from "../icons/sun.svg?react";
import Moon from "../icons/moon.svg?react";
import { schemeAtom } from "../nano/schemeAtom";
import { useStore } from "@nanostores/react";

export default function SchemeToggle() {
  const $scheme = useStore(schemeAtom);

  useEffect(() => {
    let scheme = window.localStorage.getItem("color-scheme");

    if (!scheme) {
      scheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
      window.localStorage.setItem("color-scheme", scheme);
    }

    schemeAtom.set(scheme);
  }, []);

  const toggle = () => {
    const next = $scheme === "light" ? "dark" : "light";
    schemeAtom.set(next);
    window.localStorage.setItem("color-scheme", next);
  };

  const iconStyle =
    "bgnoise size-8 cursor-pointer rounded-full bg-neutral-900 p-1 font-bold text-neutral-300 shadow-[0_0_8px_rgba(0,0,0,0.7)] transition hover:bg-neutral-800 hover:text-[lightcoral]";

  return (
    <div
      className="absolute right-2 bottom-12 z-999 cursor-pointer text-neutral-500 transition hover:text-white"
      onClick={toggle}
    >
      {$scheme === "light" ? <Sun className={iconStyle} /> : <Moon className={iconStyle} />}
    </div>
  );
}
