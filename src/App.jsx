import { useEffect, useState } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Layer,
  Map,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import { data } from "../data";

const pointLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

function pointOnCircle({ lang, lat }) {
  return {
    type: "Point",
    coordinates: [lang, lat],
  };
}

const App = () => {
  const [viewState, setViewState] = useState({
    longitude: -73,
    latitude: 42,
    zoom: 7,
  });

  const [start, setStart] = useState([-73, 42]);
  const [end, setEnd] = useState([-73, 42.2]);
  const [coords, setCoords] = useState(data);
  const [pointData, setPointData] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getRoute();
  }, [end]);

  useEffect(() => {
    if (index === coords.length) return;
    const animation = window.requestAnimationFrame(() =>
      setPointData(
        pointOnCircle({
          lang: coords[index][0],
          lat: coords[index][1],
        })
      )
    );

    setIndex((prev) => prev + 1);
    return () => window.cancelAnimationFrame(animation);
  }, [end, index]);

  const getRoute = async () => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${
        start[1]
      };${end[0]},${
        end[1]
      }?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${
        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN
      }`
    );

    const data = await response.json();
    setCoords(data.routes[0].geometry.coordinates);
  };

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "LineString",
          coordinates: [...coords],
        },
      },
    ],
  };

  const lineStyle = {
    id: "roadLayer",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "blue",
      "line-width": 4,
      "line-opacity": 0.75,
    },
  };

  const endPoint = {
    type: "FeatureCollection",
    features: [
      {
        type: "feature",
        geometry: {
          type: "Point",
          coordinates: [...end],
        },
      },
    ],
  };

  const layerEndPoint = {
    id: "end",
    type: "circle",
    source: {
      type: "geojson",
      data: end,
    },
    paint: {
      "circle-radius": 10,
      "circle-color": "red",
    },
  };

  const handleClick = (e) => {
    const newEnd = e.lngLat;
    const endPoint = Object.keys(newEnd).map((item) => newEnd[item]);

    setEnd(endPoint);
  };

  const handleResume = () => {};

  return (
    <div>
      <button onClick={handleResume}>Resume</button>
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapStyle="mapbox://styles/suthargk/clmyuah7g02vd01pf6hong3ux"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        style={{ height: "100vh", width: "100wv" }}
        onClick={handleClick}
      >
        <Marker longitude={start[0]} latitude={start[1]} />
        <Source id="routeSource" type="geojson" data={geojson}>
          <Layer {...lineStyle} />
        </Source>

        <Source id="endSource" type="geojson" data={endPoint}>
          <Layer {...layerEndPoint} />
        </Source>

        {pointData && (
          <Source type="geojson" data={pointData}>
            <Layer {...pointLayer} />
          </Source>
        )}
        <GeolocateControl />
        <FullscreenControl />
        <NavigationControl />
      </Map>
    </div>
  );
};

export default App;
