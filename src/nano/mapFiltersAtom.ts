import { atom } from "nanostores";
import { todayOutOf365 } from "../utils/dates";

const now = new Date();
const year = now.getFullYear();

export const defaultFilters = {
  query: "",
  dateRange: {
    from: new Date(year, 0, 1),
    to: new Date(year, 11, 31),
    range: [1, 365],
  },
  showIndoor: true,
  showOpenAir: true,
  showPast: true,
};

export const nowToEndOfYearRange = {
  from: now,
  to: new Date(year, 11, 31),
  range: [todayOutOf365(now), 365],
};

export const mapFiltersAtom = atom<MapFilters>(defaultFilters);

export type MapFilters = typeof defaultFilters;
