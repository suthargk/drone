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
import {
  geojson,
  endPoint,
  pointLayer,
  layerEndPoint,
  lineStyle,
  pointOnCircle,
  getRoute,
} from "./utils";

const App = () => {
  const [viewState, setViewState] = useState({
    longitude: -73,
    latitude: 42,
    zoom: 7,
  });

  const [start, setStart] = useState([-73, 42]);
  const [end, setEnd] = useState([-73, 42.2]);
  const [coords, setCoords] = useState([]);
  const [pointData, setPointData] = useState(null);
  const [resume, setResume] = useState(false);
  const animationDuration = 300; //
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getRoute(start, end).then((data) => {
      setCoords(data.routes[0].geometry.coordinates);
    });
  }, [end]);

  useEffect(() => {
    let animationFrameId;
    // if (index === coords.length) return;

    // const animate = () => {
    //   for (let i = 0; i < coords.length - 1; i++) {
    //     const startCoords = { lang: coords[i][0], lat: coords[i][1] };
    //     const endCoords = { lang: coords[i + 1][0], lat: coords[i + 1][1] };
    //     const points = pointOnCircle(startCoords, endCoords, progress);
    //     setPointData(points);
    //   }

    // if (resume) {
    //   animation = window.requestAnimationFrame(() =>
    //     setPointData(
    //       pointOnCircle({
    //         lang: coords[index][0],
    //         lat: coords[index][1],
    //       })
    //     )
    //   );
    //   setIndex((prev) => prev + 1);
    // }

    const animate = () => {
      animation = window.requestAnimationFrame(() =>
        setPointData(
          pointOnCircle({
            lang: coords[index][0],
            lat: coords[index][1],
          })
        )
      );
      setIndex((prev) => prev + 1);
    };

    setProgress((prevProgress) => {
      const newProgress = prevProgress + 1 / (animationDuration / 16); // 16ms per frame for 60fps
      if (newProgress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
      return newProgress;
    });

    // animate();
    return () => window.cancelAnimationFrame(animation);
  }, [end, index, resume]);

  console.log(pointData);

  const handleClick = (e) => {
    const { lng, lat } = e.lngLat;
    setEnd([lng, lat]);
  };

  const handleResume = () => {
    // for (let i = 0; i < coords.length; i++) {
    // }
    setResume((prev) => !prev);
  };

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
        <Source id="routeSource" type="geojson" data={geojson(coords)}>
          <Layer {...lineStyle} />
        </Source>

        <Source id="endSource" type="geojson" data={endPoint(end)}>
          <Layer {...layerEndPoint(end)} />
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
