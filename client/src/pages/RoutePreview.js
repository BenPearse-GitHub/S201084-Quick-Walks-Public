import { React, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";
import * as turf from "@turf/turf";
import { useNavigate } from "react-router-dom";
import "leaflet-arrowheads";
import startMarkerIcon from "../mapIcons/startMarkerIcon";
import finishMarkerIcon from "../mapIcons/finishMarkerIcon";
import { getRouteById } from "../api/route.api";

const UpdateView = ({ route }) => {
  const map = useMap();

  // Zoom map to bounds of route
  if (route) {
    const bounds = turf.bbox(route.geoJSON);
    map.fitBounds([
      [bounds[1], bounds[0]],
      [bounds[3], bounds[2]],
    ]);
  }
};

const RoutePreview = () => {
  const id = useParams().id;
  const [route, setRoute] = useState(null);

  const navigate = useNavigate();

  const fetchCurrentRoute = async () => {
    const response = await getRouteById(id);
    const data = await response.json();
    // if request successful
    if (data.success) {
      // set route
      setRoute(data.route);
      const startLocation = [
        data.route.geoJSON.coordinates[0][0],
        data.route.geoJSON.coordinates[0][1],
      ];
    } else {
      alert("Error", data.error);
      navigate("/routes");
    }
  };

  useEffect(() => {
    if (id) {
      fetchCurrentRoute();
    } else {
      navigate("/routes");
    }
  }, []);

  if (!route) {
    return (
      <Box
        id="home"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  } else {
    return (
      <>
        <MapContainer
          style={{ height: "100%" }}
          center={[0, 0]}
          zoom={13}
          zoomControl={false}
        >
          <ZoomControl position="bottomright" />
          <UpdateView route={route} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_API_KEY_HERE"
          />
          <GeoJSON
            data={route.geoJSON}
            pathOptions={{ color: "red" }}
            arrowheads={{
              frequency: "50px",
              size: "12px",
              color: "blue",
              offsets: { end: "15px" },
            }}
          />
          <Marker
            position={[
              route.geoJSON.coordinates[0][1],
              route.geoJSON.coordinates[0][0],
            ]}
            icon={startMarkerIcon}
          >
            <Popup>
              <Typography variant="h5">Start</Typography>
            </Popup>
          </Marker>
          <Marker
            position={[
              route.geoJSON.coordinates[
                route.geoJSON.coordinates.length - 1
              ][1],
              route.geoJSON.coordinates[
                route.geoJSON.coordinates.length - 1
              ][0],
            ]}
            icon={finishMarkerIcon}
          >
            <Popup>
              <Typography variant="h5">Finish</Typography>
            </Popup>
          </Marker>
        </MapContainer>
      </>
    );
  }
};

export default RoutePreview;
