import { v4 as uuid4 } from "uuid";

export const geojson = (coords) => {
  return {
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
};

export const lineStyle = {
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

export const endPoint = (end) => {
  return {
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
};

export const layerEndPoint = (end) => {
  return {
    id: "end",
    type: "circle",
    source: {
      type: "geojson",
      data: end,
    },
    paint: {
      "circle-radius": 10,
      "circle-color": "#f43f5e",
    },
  };
};

export const pointLayer = {
  id: "point",
  type: "symbol",
  source: "point",
  layout: {
    "icon-image": "drone",
    "icon-size": 0.8,
  },
};

export function pointOnCircle({ lang, lat }) {
  return {
    type: "Point",
    coordinates: [lang, lat],
  };
}

export const getRoute = async (start, end) => {
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
  return data;
};

export const INITIAL_DATA = [
  {
    id: uuid4(),
    coordinates: "",
  },
  {
    id: uuid4(),
    coordinates: "",
  },
];
