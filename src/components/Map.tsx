import { Map as MapPane, Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";

import { findCoordsCenter } from "../utils/map";
import { formatFestivalDates, formatProvisionalDate } from "../utils/dates";
import { useStore } from "@nanostores/react";
import { highlightAtom } from "../stores/highlightAtom";

import type { Festival } from "../content.config";
import type { StyleSpecification } from "maplibre-gl";
import type { ViewState, MapRef } from "@vis.gl/react-maplibre";
import Pin from "../icons/pin-fill.svg?react";

import darkmatter from "../darkmatter.json";
import "maplibre-gl/dist/maplibre-gl.css";
import "../global.css";

function sortFestivalMarkers(festivals: Festival[]): Festival[] {
  return [...festivals].sort((a, b) => {
    const aPast = new Date(a.startDate) < new Date();
    const bPast = new Date(b.startDate) < new Date();

    if (aPast !== bPast) return aPast ? -1 : 1;

    return a.lat - b.lat;
  });
}

export default function Map({ festivals, path }: { festivals: Festival[]; path: string }) {
  const [activeFestival, setActiveFestival] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lng: number; lat: number; zoom: number }>({
    lng: 0,
    lat: 0,
    zoom: 0,
  });

  const firstLoadRef = useRef(true);
  const yearCenter = findCoordsCenter(festivals.map((f) => [f.lng, f.lat]));
  const currentFestival: Festival | undefined = festivals.find((f) => path.includes(f.key));
  const $highlight = useStore(highlightAtom);

  const initialViewState: Partial<ViewState> = currentFestival
    ? { longitude: currentFestival.lng, latitude: currentFestival.lat, zoom: 5 }
    : { longitude: yearCenter[0], latitude: yearCenter[1], zoom: 4 };

  const mapRef = useRef<MapRef>();

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
      setFlyTarget({ lng, lat, zoom: 4 });
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
          href={`/${new Date(festival.startDate).getFullYear()}/${festival.key}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <Pin
            className={`relative size-8 cursor-pointer text-[salmon] transition hover:brightness-200 ${pastFestival ? "text-neutral-500 opacity-60" : ""}`}
          />
        </a>
        {showPopup && <FestivalTooltip festival={festival} />}
      </>
    );
  });

  const markers = useMemo(() => {
    return sortFestivalMarkers(festivals).map((f) => (
      <Marker key={f.key} latitude={f.lat} longitude={f.lng} anchor="bottom" offset={[0, -2]}>
        <MarkerButton festival={f} isActive={activeFestival === f.key || $highlight === f.key} />
      </Marker>
    ));
  }, [festivals, activeFestival, $highlight]);

  return (
    <>
      <div className="pointer-events-none absolute z-[450] h-full w-full shadow-[inset_0_0_64px_rgba(0,0,0,0.9)]"></div>
      {festivals && (
        <MapPane
          initialViewState={initialViewState}
          mapStyle={darkmatter as StyleSpecification}
          attributionControl={false}
          ref={mapRef}
        >
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
      className="pointer-events-none text-center text-white"
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
