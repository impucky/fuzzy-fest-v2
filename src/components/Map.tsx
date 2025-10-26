import { Map as MapPane, Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import Pin from "../icons/pin-fill.svg?react";
import Attribution from "./Attribution";
import MapFilters from "./MapFilters";

import { useState, useEffect, useRef, useMemo, memo } from "react";
import { findCoordsCenter, filterFestivals } from "../utils/map";
import { formatFestivalDates, formatProvisionalDate } from "../utils/dates";
import { useStore } from "@nanostores/react";
import { highlightAtom } from "../nano/highlightAtom";
import { mapFiltersAtom } from "../nano/mapFiltersAtom";

import type { Festival } from "../content.config";
import type { StyleSpecification } from "maplibre-gl";
import type { ViewState, MapRef } from "@vis.gl/react-maplibre";

import darkmatter from "../darkmatter.json";
import "maplibre-gl/dist/maplibre-gl.css";
import "../global.css";

export default function Map({
  festivals,
  path,
  year,
}: {
  festivals: Festival[];
  path: string;
  year: number;
}) {
  const [activeFestival, setActiveFestival] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lng: number; lat: number; zoom: number }>({
    lng: 0,
    lat: 0,
    zoom: 0,
  });

  const firstLoadRef = useRef(true);
  const centerForCurrentYear = findCoordsCenter(festivals.map((f) => [f.lng, f.lat]));
  const currentFestival: Festival | undefined = festivals.find((f) => path.includes(f.key));
  const $highlight = useStore(highlightAtom);
  const $filters = useStore(mapFiltersAtom);

  const initialViewState: Partial<ViewState> = currentFestival
    ? { longitude: currentFestival.lng, latitude: currentFestival.lat, zoom: 5 }
    : { longitude: centerForCurrentYear[0], latitude: centerForCurrentYear[1], zoom: 3.5 };

  const mapRef = useRef<MapRef>(null);

  // Initial centering
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;

      if (currentFestival) {
        setActiveFestival(currentFestival.key);
      }

      return;
    }

    // Subsequent navigation
    if (currentFestival) {
      const currentZoom = mapRef.current?.getZoom() ?? 0;
      const targetZoom = Math.max(currentZoom, 6);

      setFlyTarget({ lng: currentFestival.lng, lat: currentFestival.lat, zoom: targetZoom });
      setActiveFestival(currentFestival.key);
    } else {
      const [lng, lat] = findCoordsCenter(festivals.map((f) => [f.lng, f.lat]));
      setFlyTarget({ lng, lat, zoom: 3.5 });
      highlightAtom.set(null);
      setActiveFestival(null);
    }
  }, [festivals]);

  const MarkerButton = memo(function MarkerButton({
    festival,
    isActive,
  }: {
    festival: Festival;
    isActive: boolean;
  }) {
    const [hovered, setHovered] = useState(false);
    const showPopup = hovered || isActive;
    const pastFestival = new Date(festival.startDate) < new Date();

    return (
      <>
        <a
          className="drop-shadow-[0_0_4px_rgba(0,0,0,0.4)] transition hover:drop-shadow-[0_0_4px_rgba(0,0,0,0.8)]"
          href={`/${new Date(festival.startDate).getFullYear()}/${festival.key}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => highlightAtom.set(festival.key)}
        >
          <Pin
            className={`relative size-8 cursor-pointer text-[salmon] transition hover:opacity-100! hover:brightness-200 ${pastFestival ? "text-neutral-500 opacity-60" : ""}`}
          />
        </a>
        {showPopup && <FestivalTooltip festival={festival} />}
      </>
    );
  });

  const markers = useMemo(() => {
    const filtered = filterFestivals(festivals, $filters, activeFestival);
    const sorted = sortFestivalMarkers(filtered);

    return sorted.map((f, i) => (
      <Marker key={`${f.key}-${i}`} latitude={f.lat} longitude={f.lng} anchor="bottom" offset={[0, -2]}>
        <MarkerButton festival={f} isActive={activeFestival === f.key || $highlight === f.key} />
      </Marker>
    ));
  }, [festivals, activeFestival, $highlight, $filters]);

  return (
    <>
      <div className="pointer-events-none absolute z-[450] h-full w-full shadow-[inset_0_0_64px_rgba(0,0,0,0.9)]"></div>
      <MapFilters year={year} />
      {festivals && (
        <MapPane
          initialViewState={initialViewState}
          mapStyle={darkmatter as StyleSpecification}
          ref={mapRef}
          attributionControl={false}
        >
          <Attribution />
          <MapNavigation target={flyTarget} />
          {markers}
        </MapPane>
      )}
    </>
  );
}

function FestivalTooltip({ festival }: { festival: Festival }) {
  return (
    <Popup
      longitude={festival.lng ?? 0}
      latitude={festival.lat ?? 0}
      offset={[0, -35]}
      closeButton={false}
      closeOnClick={false}
      anchor="bottom"
      className="pointer-events-none text-center text-white text-shadow-lg"
    >
      <span className="text-[1rem] font-black">{festival.name.toUpperCase()}</span>
      <br />
      {festival.provisionalDate ? (
        <span>{formatProvisionalDate(festival.startDate)}</span>
      ) : (
        <span className="text-xs">{formatFestivalDates(festival.startDate, festival.endDate)}</span>
      )}
    </Popup>
  );
}

function MapNavigation({ target }: { target: { lng: number; lat: number; zoom: number } }) {
  const { current: map } = useMap();
  const lastTarget = useRef(target);

  useEffect(() => {
    if (!target || (lastTarget.current.lng === target.lng && lastTarget.current.lat === target.lat)) {
      return;
    }

    map?.easeTo({ center: [target.lng, target.lat], zoom: target.zoom });
    lastTarget.current = target;
  }, [target, map]);

  return null;
}

function sortFestivalMarkers(festivals: Festival[]): Festival[] {
  const now = Date.now();
  return [...festivals].sort((a, b) => {
    const aPast = new Date(a.startDate).getTime() < now;
    const bPast = new Date(b.startDate).getTime() < now;

    if (aPast !== bPast) return aPast ? -1 : 1;

    if (a.lat !== b.lat) return b.lat - a.lat;

    return a.key.localeCompare(b.key);
  });
}
