import { Map as MapPane } from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map() {
  return (
    <div className="relative h-3/5 w-full flex-grow lg:h-full lg:w-3/5">
      <MapPane
        initialViewState={{
          longitude: -100,
          latitude: 40,
          zoom: 2,
        }}
        mapStyle="https://tiles.openfreemap.org/styles/positron"
        attributionControl={false}
      />
    </div>
  );
}
