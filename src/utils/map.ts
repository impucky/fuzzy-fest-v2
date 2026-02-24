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
  return festivals.filter((festival) => {
    const query = filters.query.toLowerCase().trim();
    const startDate = new Date(festival.startDate);
    const startFilter = new Date(filters.dateRange.from);
    const endFilter = new Date(filters.dateRange.to);
    // Always show if currently viewing and there's no query
    if (activeFestival && activeFestival === festival.key && !query) {
      return true;
    }
    // Locale
    if (festival.indoor && !filters.showIndoor) {
      return false;
    }
    if (!festival.indoor && !filters.showOpenAir) {
      return false;
    }
    if (!filters.showIndoor && !filters.showOpenAir) {
      return false;
    }
    // Date range
    if (startDate < startFilter || startDate > endFilter) {
      return false;
    }
    // Search
    if (filters.query) {
      const festivalMatch = festival.name.toLowerCase().includes(query);
      const bandMatch =
        festival.lineup &&
        festival.lineup.some((slug: string) => {
          return slug.split("-").join(" ").includes(query);
        });
      return festivalMatch || bandMatch;
    }
    return true;
  });
}

export function sortFestivalMarkers(festivals: Festival[]): Festival[] {
  const now = Date.now();
  return [...festivals].sort((a, b) => {
    const aPast = new Date(a.startDate).getTime() < now;
    const bPast = new Date(b.startDate).getTime() < now;

    if (aPast !== bPast) {
      return aPast ? -1 : 1;
    }

    if (a.lat !== b.lat) {
      return b.lat - a.lat;
    }

    return a.key.localeCompare(b.key);
  });
}
