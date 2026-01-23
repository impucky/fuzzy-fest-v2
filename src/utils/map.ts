import type { Festival } from "../content.config";
import type { MapFilters } from "../nano/mapFiltersAtom";

export function findCoordsCenter(coords: [number, number][]): [number, number] {
  const [sumLng, sumLat] = coords.reduce(
    ([accLng, accLat], [lng, lat]) => [accLng + lng, accLat + lat],
    [0, 0],
  );
  return [sumLng / coords.length, sumLat / coords.length];
}

export function filterFestivals(festivals: Festival[], filters: MapFilters, activeFestival: string | null) {
  return festivals.filter((f) => {
    const query = filters.query.toLowerCase().trim();
    const startDate = new Date(f.startDate);
    const startFilter = new Date(filters.dateRange.from);
    const endFilter = new Date(filters.dateRange.to);
    // Always show if currently viewing and there's no query
    if (activeFestival && activeFestival === f.key && !query) return true;
    // Locale
    if (f.indoor && !filters.showIndoor) return false;
    if (!f.indoor && !filters.showOpenAir) return false;
    if (!filters.showIndoor && !filters.showOpenAir) return false;
    // Date range
    if (startDate < startFilter || startDate > endFilter) return false;
    // Search
    if (filters.query) {
      const festivalMatch = f.name.toLowerCase().includes(query);
      const bandMatch =
        f.lineup &&
        f.lineup.some((slug) => {
          return slug.split("-").join(" ").toLowerCase().includes(query);
        });
      return festivalMatch || bandMatch;
    }
    return true;
  });
}
