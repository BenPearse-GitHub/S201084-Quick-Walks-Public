import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import startMarkerIcon from "../mapIcons/startMarkerIcon";
import finishMarkerIcon from "../mapIcons/finishMarkerIcon";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { gpx } from "@tmcw/togeojson";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import jwtDecode from "jwt-decode";
import { postNewRoute } from "../api/route.api";

import * as turf from "@turf/turf";
import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";

const Input = styled("input")({
  display: "none",
});

const UpdateView = ({ route }) => {
  const map = useMap();

  // Zoom map to bounds of route
  if (route) {
    const bounds = turf.bbox(route);
    map.fitBounds(
      [
        [bounds[1], bounds[0]],
        [bounds[3], bounds[2]],
      ],
      { padding: [25, 25] }
    );
  }
};

const RouteUpload = () => {
  const theme = useTheme();
  const [token, setToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [loadedGeoJson, setLoadedGeoJson] = useState(null);
  const [routeLength, setRouteLength] = useState(0);
  const [newRouteName, setNewRouteName] = useState("");
  const [newRouteDescription, setNewRouteDescription] = useState("");
  const [includesPrivateLand, setIncludesPrivateLand] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileUploadChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const calculateRoutelength = () => {
    if (loadedGeoJson) {
      const route = loadedGeoJson.features[0].geometry;
      const routeLength = turf.length(route);
      setRouteLength(routeLength);
    }
  };

  const checkFileExtension = () => {
    const fileName = selectedFile.name;
    const substring =
      fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length) ||
      fileName;
    if (substring !== "gpx") {
      alert("Please upload a GPX file");
      setIsFilePicked(false);
      return false;
    } else {
      return true;
    }
  };

  const handlePrivateLandChange = (event) => {
    setIncludesPrivateLand(event.target.checked);
  };

  const handleSubmit = async () => {
    if (token) {
      const user = jwtDecode(token);
      const body = {
        name: newRouteName,
        author: user._id,
        geoJSON: loadedGeoJson.features[0].geometry,
        privateLand: includesPrivateLand,
      };

      if (newRouteDescription) {
        body.description = newRouteDescription;
      }

      const response = await postNewRoute({
        token: token,
        body: body,
      });

      const data = await response.json();

      if (data.success) {
        alert("Route successfully uploaded");
        navigate("/");
      } else {
        alert("Error uploading route");
      }
    }
  };

  useEffect(() => {
    if (selectedFile) {
      if (checkFileExtension()) {
        // convert gpx file to geojson
        const reader = new FileReader();
        reader.onload = (e) => {
          const gpxData = e.target.result;
          const newGeoJson = gpx(
            new DOMParser().parseFromString(gpxData, "text/xml")
          );
          setLoadedGeoJson(newGeoJson);
        };

        reader.readAsText(selectedFile);
      }
    }
  }, [selectedFile]);

  useEffect(() => {
    if (loadedGeoJson) {
      calculateRoutelength();
    }
  }, [loadedGeoJson]);

  // Check user is logged in
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      alert("You must be logged in to upload a route");
      navigate("/signIn");
    } else {
      setToken(sessionStorage.getItem("token"));
    }
  }, []);

  return (
    <Box sx={{ height: "100%" }}>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={activeStep}
        sx={{ flexGrow: 1 }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === 2 || !isFilePicked}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
      <Box
        sx={{
          display: "flex",
          flexFlow: "column",
          height: "calc(100% - 48px)",
        }}
      >
        {activeStep === 0 && (
          <>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Route Upload
            </Typography>
            <Typography variant="body1" textAlign="center" gutterBottom>
              Upload a GPX file of an existing route.
            </Typography>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ flex: "auto" }}
            >
              <label htmlFor="contained-button-file">
                <Input
                  accept=".gpx"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileUploadChange}
                />
                <Button variant="contained" component="span">
                  Select GPX File
                </Button>
              </label>
              <Box>
                {isFilePicked ? (
                  <>
                    <Typography variant="body1" textAlign="center" gutterBottom>
                      Selected file:
                    </Typography>
                    <Typography variant="body2" textAlign="center" gutterBottom>
                      {selectedFile.name}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body1" textAlign="center" gutterBottom>
                    No file selected
                  </Typography>
                )}
              </Box>
            </Stack>
          </>
        )}
        {activeStep === 1 && (
          <>
            {loadedGeoJson ? (
              <>
                <Typography variant="h6" textAlign="center" gutterBottom>
                  Route Preview
                </Typography>
                <Typography variant="body1" textAlign="center">
                  Please check that the below details look correct before
                  proceeding.
                </Typography>
                <Box sx={{ height: "100%" }}>
                  <MapContainer
                    style={{ height: "70%", marginTop: "20px" }}
                    center={[0, 0]}
                    zoom={13}
                    zoomControl={false}
                  >
                    <ZoomControl position="bottomright" />
                    <UpdateView route={loadedGeoJson.features[0].geometry} />
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_API_KEY_HERE"
                    />
                    <GeoJSON
                      data={loadedGeoJson}
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
                        loadedGeoJson.features[0].geometry.coordinates[0][1],
                        loadedGeoJson.features[0].geometry.coordinates[0][0],
                      ]}
                      icon={startMarkerIcon}
                    >
                      <Popup>
                        <Typography variant="h5">Start</Typography>
                      </Popup>
                    </Marker>
                    <Marker
                      position={[
                        loadedGeoJson.features[0].geometry.coordinates[
                          loadedGeoJson.features[0].geometry.coordinates
                            .length - 1
                        ][1],
                        loadedGeoJson.features[0].geometry.coordinates[
                          loadedGeoJson.features[0].geometry.coordinates
                            .length - 1
                        ][0],
                      ]}
                      icon={finishMarkerIcon}
                    >
                      <Popup>
                        <Typography variant="h5">Finish</Typography>
                      </Popup>
                    </Marker>
                  </MapContainer>
                  <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    spacing={2}
                    sx={{ marginTop: "20px" }}
                  >
                    <Box>
                      <Typography variant="body1" textAlign="center">
                        Length
                      </Typography>
                      <Typography variant="h6" textAlign="center" gutterBottom>
                        {(routeLength * 1000).toPrecision(4)} m
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body1" textAlign="center">
                        Estimated Duration
                      </Typography>
                      <Typography variant="h6" textAlign="center" gutterBottom>
                        {Math.round((routeLength * 1000) / 1.4 / 60)} mins
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </>
            ) : (
              <Typography variant="body1" textAlign="center" gutterBottom>
                No file selected
              </Typography>
            )}
          </>
        )}
        {activeStep === 2 && (
          <Container maxWidth="md" sx={{ height: "100%" }}>
            <Typography variant="h6" textAlign="center" gutterBottom>
              Enter Route Details
            </Typography>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ flex: "auto" }}
            >
              <Box>
                <TextField
                  required
                  fullWidth
                  type="text"
                  inputProps={{ maxLength: 100 }}
                  id="route-name"
                  label="Route Name"
                  value={newRouteName}
                  onChange={(event) => {
                    setNewRouteName(event.target.value);
                  }}
                />
                <Typography variant="caption" sx={{ marginBottom: "20px" }}>
                  {100 - newRouteName.length} characters remaining
                </Typography>
              </Box>
              <Box>
                <TextField
                  autoFocus
                  margin="dense"
                  id="route-description"
                  label="Route Description"
                  type="description"
                  fullWidth
                  multiline
                  value={newRouteDescription}
                  onChange={(event) => {
                    setNewRouteDescription(event.target.value);
                  }}
                  inputProps={{ maxLength: 250 }}
                />
                <Typography variant="caption" sx={{ marginBottom: "20px" }}>
                  {250 - newRouteDescription.length} characters remaining
                </Typography>
              </Box>

              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includesPrivateLand}
                      onChange={handlePrivateLandChange}
                    />
                  }
                  label="This route includes private land"
                />
              </FormGroup>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!newRouteName}
              >
                Submit
              </Button>
            </Stack>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default RouteUpload;
