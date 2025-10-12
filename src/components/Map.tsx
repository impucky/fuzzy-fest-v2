import { Map as MapPane, Marker, Popup, useMap } from "@vis.gl/react-maplibre";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";

import { findCoordsCenter } from "../utils/map";
import { formatFestivalDates } from "../utils/dates";
import { useStore } from "@nanostores/react";
import { highlightAtom } from "../stores/highlightAtom";

import type { Festival } from "../content.config";
import type { StyleSpecification } from "maplibre-gl";
import type { ViewState } from "@vis.gl/react-maplibre";

import darkmatter from "../darkmatter.json";
import "maplibre-gl/dist/maplibre-gl.css";
import "../global.css";

export default function Map({ festivals, path }: { festivals: Festival[]; path: string }) {
  const [activeFestival, setActiveFestival] = useState<string | null>(null);
  const [flyTarget, setFlyTarget] = useState<{ lng: number; lat: number; zoom: number }>({
    lng: 0,
    lat: 0,
    zoom: 0,
  });

  const firstLoadRef = useRef(true);
  const yearCenter = findCoordsCenter(festivals.map((f) => [f.lng, f.lat]));
  const currentFestival: Festival | undefined = festivals.find((f) => path.includes(f.slug));
  const $highlight = useStore(highlightAtom);

  const initialViewState: Partial<ViewState> = currentFestival
    ? { longitude: currentFestival.lng, latitude: currentFestival.lat, zoom: 5 }
    : { longitude: yearCenter[0], latitude: yearCenter[1], zoom: 4 };

  // Initial centering
  useEffect(() => {
    if (firstLoadRef.current) {
      firstLoadRef.current = false;

      if (currentFestival) {
        setActiveFestival(currentFestival.slug);
      }

      return;
    }

    // Subsequent navigation
    if (currentFestival) {
      setFlyTarget({ lng: currentFestival.lng, lat: currentFestival.lat, zoom: 6 });
      setActiveFestival(currentFestival.slug);
    } else {
      const [lng, lat] = findCoordsCenter(festivals.map((f) => [f.lng, f.lat]));
      setFlyTarget({ lng, lat, zoom: 4 });
      setActiveFestival(null);
    }
  }, [festivals]);

  const onMarkerClick = useCallback((f: Festival) => {
    setActiveFestival(f.slug);
    setFlyTarget({ lng: f.lng, lat: f.lat, zoom: 6 });
    highlightAtom.set(null);
  }, []);

  const MarkerButton = memo(function MarkerButton({
    festival,
    isActive,
    onClick,
  }: {
    festival: Festival;
    isActive: boolean;
    onClick: (f: Festival) => void;
  }) {
    const [hovered, setHovered] = useState(false);
    const showPopup = hovered || isActive;

    return (
      <>
        <a
          className="block size-4 cursor-pointer rounded-xl bg-[salmon]"
          href={`/${new Date(festival.startDate).getFullYear()}/${festival.slug}`}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => onClick(festival)}
        ></a>
        {showPopup && <FestivalPopup festival={festival} />}
      </>
    );
  });

  const markers = useMemo(
    () =>
      festivals.map((f) => (
        <Marker key={f.slug} latitude={f.lat} longitude={f.lng}>
          <MarkerButton
            festival={f}
            isActive={activeFestival === f.slug || $highlight === f.slug}
            onClick={onMarkerClick}
          />
        </Marker>
      )),
    [festivals, activeFestival, onMarkerClick, $highlight],
  );

  return (
    <div className="relative h-3/5 w-full flex-grow lg:h-full lg:w-3/5">
      {festivals && (
        <MapPane
          initialViewState={initialViewState}
          mapStyle={darkmatter as StyleSpecification}
          attributionControl={false}
        >
          <MapNavigation target={flyTarget} />
          {markers}
        </MapPane>
      )}
    </div>
  );
}

function FestivalPopup({ festival }: { festival: Festival }) {
  return (
    <Popup
      longitude={festival.lng ?? 0}
      latitude={festival.lat ?? 0}
      offset={[0, -20]}
      closeButton={false}
      closeOnClick={false}
      anchor="bottom"
      className="pointer-events-none text-center text-white"
    >
      <span className="text-[1rem] font-black">{festival.name.toUpperCase()}</span>
      <br />
      {festival.provisionalDate ? (
        <span>{`${festival.startDate} (TBA)`}</span>
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
