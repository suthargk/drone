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
      "circle-color": "red",
    },
  };
};

export const pointLayer = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 10,
    "circle-color": "#007cbf",
  },
};

export function pointOnCircle(startCoords, endCoords, progress) {
  const x = startCoords.lang + (endCoords.lang - startCoords.lang) * progress;
  const y = startCoords.lat + (endCoords.lat - startCoords.lat) * progress;
  return {
    type: "Point",
    coordinates: [x, y],
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
