import { React, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Circle,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import * as turf from "@turf/turf";
import { useNavigate } from "react-router-dom";
import { CircleMarker } from "react-leaflet/CircleMarker";
import { useStopwatch } from "react-timer-hook";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import startMarkerIcon from "../mapIcons/startMarkerIcon";
import finishMarkerIcon from "../mapIcons/finishMarkerIcon";
import "leaflet-arrowheads";
import { getRouteById } from "../api/route.api";

// LocationMarker component
function LocationMarker(props) {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const map = useMap();

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position.coords);
        setAccuracy(position.coords.accuracy);
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: Infinity,
      }
    );
  }

  useEffect(() => {
    if (position) {
      props.callback([position.latitude, position.longitude]);

      if (props.followLocation) {
        map.setView([position.latitude, position.longitude], map.getZoom());
      }
    }
  }, [position]);

  return position === null ? null : (
    <>
      <CircleMarker
        center={[position.latitude, position.longitude]}
        radius={5}
        pathOptions={{ color: "blue" }}
      />
      {props.showAccuracy && (
        <Circle
          center={[position.latitude, position.longitude]}
          pathOptions={{ color: "blue" }}
          radius={accuracy}
        />
      )}
    </>
  );
}

function padLeadingZeros(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

function RecentreView(props) {
  const map = useMap();
  useEffect(() => {
    if (props.position) {
      map.setView(props.position, map.getZoom());
      props.callback(null);
    }
  }, [props.position]);
}

const RouteNavigation = () => {
  const id = useParams().id;
  const [route, setRoute] = useState(null);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [follow, setFollow] = useState(true);
  const [lastUserPosition, setLastUserPosition] = useState(null);
  const [recentrePosition, setRecentrePosition] = useState(null);
  const [distanceCovered, setDistanceCovered] = useState(0);
  const [completionConfirmationModalOpen, setCompletionConfirmationModalOpen] =
    useState(false);
  const navigate = useNavigate();
  const { seconds, minutes, hours } = useStopwatch({ autoStart: true });

  const fetchCurrentRoute = async () => {
    const response = await getRouteById(id);
    const data = await response.json();
    // if request successful
    if (data.success) {
      // set route
      setRoute(data.route);
    } else {
      alert("Error", data.error);
      navigate("/routes");
    }
  };

  // Calculate distance walked by user based on change in user position
  const calculateDistanceWalked = (newPosition) => {
    let tempDistance = 0;
    if (lastUserPosition == null) {
      setLastUserPosition(newPosition);
    } else if (newPosition !== lastUserPosition) {
      tempDistance = turf.distance(lastUserPosition, newPosition);
      setDistanceCovered(distanceCovered + tempDistance * 1000);
      setLastUserPosition(newPosition);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCurrentRoute();
    } else {
      navigate("/routes");
    }
  }, []);

  const handleConfirmationClickOpen = () => {
    setCompletionConfirmationModalOpen(true);
  };

  const handleConfirmationClickClose = () => {
    setCompletionConfirmationModalOpen(false);
  };

  const handleRouteCompletion = () => {
    // Navigate to route completion page and pass along completion time and distance walked
    navigate(`/routes/${id}/complete`, {
      state: {
        time: `${padLeadingZeros(hours, 2)}:${padLeadingZeros(
          minutes,
          2
        )}:${padLeadingZeros(seconds, 2)}`,
        distance: distanceCovered,
      },
    });
  };

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
  } else if (navigator.geolocation) {
    return (
      <Box sx={{ display: "flex", flexFlow: "column", height: "100%" }}>
        <Box sx={{ flex: "auto" }}>
          <MapContainer
            style={{ height: "100%" }}
            center={[0, 0]}
            zoom={16}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
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
            <LocationMarker
              showAccuracy={showAccuracy}
              followLocation={follow}
              callback={calculateDistanceWalked}
            />
            <RecentreView
              position={recentrePosition}
              callback={setRecentrePosition}
            />
          </MapContainer>
        </Box>
        <Box>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
            <Box>
              <Typography style={{ textAlign: "center" }} variant="h6">
                {padLeadingZeros(hours, 2)}:{padLeadingZeros(minutes, 2)}:
                {padLeadingZeros(seconds, 2)}
              </Typography>
              <Typography variant="subtitle1">Stopwatch</Typography>
            </Box>
            <Box>
              <Typography style={{ textAlign: "center" }} variant="h6">
                {distanceCovered.toPrecision(4)} m
              </Typography>
              <Typography style={{ textAlign: "center" }} variant="subtitle1">
                Walked
              </Typography>
            </Box>
            <Box>
              <Typography style={{ textAlign: "center" }} variant="h6">
                {Math.round((distanceCovered / route.length) * 100)}%
              </Typography>
              <Typography style={{ textAlign: "center" }} variant="subtitle1">
                Completion
              </Typography>
            </Box>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            spacing={2}
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
          >
            <Button
              variant="contained"
              color="primary"
              endIcon={<MyLocationIcon />}
              onClick={() => {
                setRecentrePosition(lastUserPosition);
              }}
            >
              Recentre
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmationClickOpen}
              endIcon={<SportsScoreIcon />}
            >
              Finished!
            </Button>
          </Stack>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Settings</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                <FormControlLabel
                  checked={showAccuracy}
                  onChange={(event) => setShowAccuracy(event.target.checked)}
                  control={<Switch />}
                  label="Show location accuracy"
                />
                <FormControlLabel
                  checked={follow}
                  defaultChecked
                  onChange={(event) => setFollow(event.target.checked)}
                  control={<Switch />}
                  label="Follow my location"
                />
              </FormGroup>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Dialog
          open={completionConfirmationModalOpen}
          onClose={handleConfirmationClickClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you're finished walking?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmationClickClose}>No</Button>
            <Button onClick={handleRouteCompletion} autoFocus>
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  } else {
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
        <Typography variant="h6">
          Sorry, your browser does not support geolocation.
        </Typography>
      </Box>
    );
  }
};

export default RouteNavigation;
