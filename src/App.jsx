import { useEffect, useState } from "react";
import { v4 as uuid4 } from "uuid";
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
  const [mapState, setMapState] = useState();
  const [numberOfList, setNumberOfList] = useState(INITIAL_DATA);
  const [error, setError] = useState(null);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [play, setPlay] = useState(false);
  const image = useMapImage({
    mapState,
    url: "/assets/drone.png",
    name: "drone",
  });

  useEffect(() => {
    if (index === coords.length) return;

    let animation;

    if (play) {
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
  }, [index, play]);

  const handleClick = (e) => {
    const { lng, lat } = e.lngLat;
    setEnd([lng, lat]);
  };

  const handlePlay = () => {
    setPlay((prev) => !prev);
  };

  const handleGetDirection = (isListEmpty) => {
    if (isListEmpty.length > 1) {
      setError("");
      setIsButtonLoading(true);

      getRoute(start, end, numberOfList)
        .then((data) => {
          if (data.code === "NoSegment") {
            setError(data);
            setIsButtonLoading(false);
          } else {
            setCoords(data.routes[0].geometry.coordinates);
            setIsButtonLoading(false);
          }
        })
        .catch((err) => {
          setError(err);
          setIsButtonLoading(false);
        });
    }

    const startPoints = numberOfList[0].coordinates
      .split(",")
      .map((item) => +item);

    setStart(startPoints);

    setEnd(
      numberOfList[numberOfList.length - 1].coordinates
        .split(",")
        .map((item) => +item)
    );

    mapState.flyTo({
      center: startPoints,
      zoom: 8,
    });

    setCoords(numberOfList);
  };

  const handleFile = (e) => {
    setError("");
    const file = e.target.files[0];
    setSelectedFile(file.name);
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          const coordinateData = data.map(({ lng, lat }) => {
            return { id: uuid4(), coordinates: [lng, lat].join(",") };
          });
          setNumberOfList(coordinateData);
        } catch (error) {
          setError(error);
        }
      };
    }
  };

  return (
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
        coords={coords}
        handlePlay={handlePlay}
        play={play}
        numberOfList={numberOfList}
        setNumberOfList={setNumberOfList}
        handleGetDirection={handleGetDirection}
        isButtonLoading={isButtonLoading}
        selectedFile={selectedFile}
        handleFile={handleFile}
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
  );
};

export default App;
