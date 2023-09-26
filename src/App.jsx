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
  INITIAL_DATA,
} from "./utils";
import { useMapImage } from "./hooks";
import CoordinatesCard from "./components/CoordinatesCard";

const App = () => {
  const [viewState, setViewState] = useState({
    longitude: -73,
    latitude: 42,
    zoom: 7,
  });
  const [coords, setCoords] = useState([]);
  const [start, setStart] = useState([]);
  const [end, setEnd] = useState([]);
  const [pointData, setPointData] = useState(null);
  const [index, setIndex] = useState(0);
  const [resume, setResume] = useState(false);
  const [mapState, setMapState] = useState();
  const [numberOfList, setNumberOfList] = useState(INITIAL_DATA);
  const [error, setError] = useState(null);
  const image = useMapImage({
    mapState,
    url: "/assets/drone.png",
    name: "drone",
  });

  useEffect(() => {
    setError("");
    if (start.length && end.length) {
      getRoute(start, end)
        .then((data) => {
          if (data.code === "NoSegment") {
            setError(data);
          } else {
            setCoords(data.routes[0].geometry.coordinates);
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, [end]);

  useEffect(() => {
    if (index === coords.length) return;

    let animation;

    if (resume) {
      animation = window.requestAnimationFrame(() =>
        setPointData(
          pointOnCircle({
            lang: coords[index][0],
            lat: coords[index][1],
          })
        )
      );
      setIndex((prev) => prev + 1);
    }

    return () => cancelAnimationFrame(animation);
  }, [index, resume]);

  const handleClick = (e) => {
    const { lng, lat } = e.lngLat;
    setEnd([lng, lat]);
  };

  const handleResume = () => {
    setResume((prev) => !prev);
  };

  const handleGetDirection = () => {
    setStart(numberOfList[0].coordinates.split(",").map((item) => +item));
    setEnd(
      numberOfList[numberOfList.length - 1].coordinates
        .split(",")
        .map((item) => +item)
    );
    setCoords(numberOfList);
  };

  return (
    <div>
      <button className="bg-red-500" onClick={handleResume}>
        Resume
      </button>
      <Map
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        mapStyle="mapbox://styles/suthargk/clmyuah7g02vd01pf6hong3ux"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        style={{ height: "100vh", width: "100wv" }}
        onClick={handleClick}
        ref={setMapState}
        className="relative"
      >
        <CoordinatesCard
          error={error}
          numberOfList={numberOfList}
          setNumberOfList={setNumberOfList}
          handleGetDirection={handleGetDirection}
        />

        {start.length ? (
          <Marker longitude={start[0]} latitude={start[1]} />
        ) : null}

        <Source id="routeSource" type="geojson" data={geojson(coords)}>
          <Layer {...lineStyle} />
        </Source>

        {end.length ? (
          <Source id="endSource" type="geojson" data={endPoint(end)}>
            <Layer {...layerEndPoint(end)} />
          </Source>
        ) : null}

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
