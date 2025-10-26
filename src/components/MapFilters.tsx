import * as Slider from "@radix-ui/react-slider";
import * as Checkbox from "@radix-ui/react-checkbox";
import SearchIcon from "../icons/search.svg?react";
import CloseIcon from "../icons/close.svg?react";
import TentIcon from "../icons/tent.svg?react";
import BuildingIcon from "../icons/building.svg?react";
import CalendarIcon from "../icons/calendar.svg?react";

import { useStore } from "@nanostores/react";
import { defaultFilters, mapFiltersAtom, nowToEndOfYearRange } from "../nano/mapFiltersAtom";
import { dateString } from "../utils/dates";
import { useEffect } from "react";

export default function MapFilters({ year }: { year: number }) {
  const $filters = useStore(mapFiltersAtom);

  useEffect(() => {
    mapFiltersAtom.set({
      ...defaultFilters,
      dateRange: {
        from: new Date(year, 0, 1),
        to: new Date(year, 11, 31),
        range: [1, 365],
      },
    });
  }, [year]);

  return (
    <div className="absolute top-0 right-0 z-[500] m-1 flex flex-col items-end gap-0.5 text-neutral-400 sm:m-2 sm:gap-1">
      <SearchBar />
      <div className="flex w-min flex-col items-end gap-0.5 transition duration-300 sm:gap-1">
        <DateRange year={year} />
        <Toggles year={year} />
      </div>
    </div>
  );
}

function SearchBar() {
  const $filters = useStore(mapFiltersAtom);

  return (
    <div className="relative flex h-8 w-52 items-center sm:h-10 sm:w-60 md:w-64">
      <input
        className="bgnoise absolute h-full w-full rounded-3xl bg-[#15191d] pl-3 text-sm shadow-[0_0_6px_rgba(0,0,0,0.6)] transition-all duration-200 outline-none hover:shadow-[0_0_0_2px_#555] focus:text-white focus:shadow-[0_0_0_2px_#f87171] sm:pl-4 sm:text-base"
        type="text"
        placeholder="Search festivals or bands"
        value={$filters.query}
        onChange={(e) => mapFiltersAtom.set({ ...$filters, query: e.target.value })}
      />
      {!$filters.query.length ? (
        <SearchIcon className="pointer-events-none absolute right-3 size-5 sm:size-6" />
      ) : (
        <button
          className="absolute right-3"
          onClick={() => mapFiltersAtom.set({ ...$filters, query: "" })}
          disabled={!$filters.query.length}
        >
          <CloseIcon
            className={`size-5 cursor-pointer text-neutral-500 transition hover:text-white sm:size-6`}
          />
        </button>
      )}
    </div>
  );
}

function DateRange({ year }: { year: number }) {
  const $filters = useStore(mapFiltersAtom);

  function from365(day: number) {
    const date = new Date(year, 0);
    date.setDate(day);
    return date;
  }

  function onDateChange(range: number[]) {
    mapFiltersAtom.set({
      ...$filters,
      dateRange: {
        from: from365(range[0]),
        to: from365(range[1]),
        range: range,
      },
      showPast: range[0] === 1,
    });
  }

  return (
    <div className="bgnoise w-52 rounded-xl bg-[#15191d] px-2 py-1 shadow-[0_0_6px_rgba(0,0,0,0.6)] sm:w-64 sm:py-2">
      <div className="flex w-full justify-between px-0 text-xs font-bold text-neutral-300 sm:px-2 sm:text-sm">
        <span className="w-1/2 text-left">{dateString(from365($filters.dateRange.range[0]))}</span>
        <span className="text-neutral-400">|</span>
        <span className="w-1/2 text-right">{dateString(from365($filters.dateRange.range[1]))}</span>
      </div>
      <Slider.Root
        value={$filters.dateRange.range}
        className="relative my-1 flex h-6 w-full items-center p-1"
        min={1}
        max={365}
        minStepsBetweenThumbs={1}
        onValueChange={(range: number[]) => onDateChange(range)}
      >
        <Slider.Track className="relative h-full grow rounded-lg bg-[#182129] shadow-[inset_0_0_6px_rgba(0,0,0,0.6)]">
          <Slider.Range className="absolute h-full bg-red-400 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]" />
        </Slider.Track>
        <Slider.Thumb className="block h-6 w-6 cursor-pointer rounded-full bg-[url('/favicon.png')] bg-cover shadow-[2px_2px_3px_rgba(0,0,0,0.6)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5)]" />
        <Slider.Thumb className="block h-6 w-6 cursor-pointer rounded-full bg-[url('/favicon.png')] bg-cover shadow-[2px_2px_3px_rgba(0,0,0,0.6)] hover:shadow-[2px_2px_6px_rgba(0,0,0,0.5)]" />
      </Slider.Root>
    </div>
  );
}

export function Toggles({ year }: { year: number }) {
  const $filters = useStore(mapFiltersAtom);
  const { showIndoor, showOpenAir, showPast } = $filters;
  const isCurrentYear = year === new Date().getFullYear();

  const togglePast = () =>
    mapFiltersAtom.set({
      ...$filters,
      showPast: !showPast,
      dateRange: showPast ? nowToEndOfYearRange : defaultFilters.dateRange,
    });

  const toggle = (key: "showIndoor" | "showOpenAir") =>
    mapFiltersAtom.set({ ...$filters, [key]: !$filters[key] });

  return (
    <div className="flex w-fit flex-col items-end gap-0.5 text-xs leading-tight font-bold sm:gap-1 sm:text-sm">
      {isCurrentYear && (
        <ToggleItem icon={CalendarIcon} label="Show past festivals" active={showPast} onToggle={togglePast} />
      )}
      <ToggleItem
        icon={TentIcon}
        label="Show Open-air"
        active={showOpenAir}
        onToggle={() => toggle("showOpenAir")}
      />
      <ToggleItem
        icon={BuildingIcon}
        label="Show Indoor"
        active={showIndoor}
        onToggle={() => toggle("showIndoor")}
      />
    </div>
  );
}

function ToggleItem({
  icon: Icon,
  label,
  active,
  onToggle,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <Checkbox.Root
      className="bgnoise flex w-fit cursor-pointer items-center justify-center gap-1 rounded-xl bg-[#15191d] p-1 transition hover:bg-neutral-700 sm:p-2"
      checked={active}
      onCheckedChange={onToggle}
    >
      <Icon className={`w-6 transition ${active ? "text-red-400" : "text-neutral-500"}`} />
      <span className={`transition ${active ? "text-neutral-200" : "line-through"}`}>{label}</span>
    </Checkbox.Root>
  );
}
