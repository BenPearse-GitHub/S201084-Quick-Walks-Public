import {
  Container,
  Typography,
  Button,
  Box,
  Divider,
  Stack,
  Rating,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  ZoomControl,
  Marker,
  useMapEvents,
  useMap,
  Circle,
  Popup,
} from "react-leaflet";
import FilterSlider from "../components/FilterSlider";
import * as turf from "@turf/turf";

const RouteSearchConfig = () => {
  const navigate = useNavigate();
  const [markerLocation, setMarkerLocation] = useState({ lat: 0, lng: 0 });
  const [currentLocation, setCurrentLocation] = useState({ lat: 0, lng: 0 });

  //   filter toggles
  const [useAvailableTime, setUseAvailableTime] = useState(false);
  const [useMaxSearchDistance, setUseMaxSearchDistance] = useState(false);
  const [useMaxElevation, setUseMaxElevation] = useState(false);

  //   search criteria
  const [availableTime, setAvailableTime] = useState(0);
  const [maxSearchDistance, setMaxSearchDistance] = useState(0);
  const [maxElevation, setMaxElevation] = useState(0);

  const MoveMarker = () => {
    useMapEvents({
      click: (e) => {
        setMarkerLocation({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      },
    });

    return null;
  };

  const UpdateView = () => {
    const map = useMap();

    if (markerLocation && !useMaxSearchDistance) {
      map.setView(markerLocation);
    }
  };

  const SearchRadiusCircle = () => {
    const map = useMap();
    const [radius, setRadius] = useState(0);

    useEffect(() => {
      if (maxSearchDistance) {
        setRadius(maxSearchDistance * 1000);
      }
    }, [maxSearchDistance]);

    useEffect(() => {
      if (maxSearchDistance && markerLocation) {
        const point = turf.point([markerLocation.lng, markerLocation.lat]);
        const buffered = turf.buffer(point, maxSearchDistance, {
          units: "kilometers",
        });
        const bbox = turf.bbox(buffered);
        // Fit map bounds to bbox
        map.fitBounds([
          [bbox[1], bbox[0]],
          [bbox[3], bbox[2]],
        ]);
      }
    }, [maxSearchDistance, markerLocation]);

    return (
      <>
        <Circle
          center={markerLocation}
          radius={radius}
          color="green"
          fillColor="green"
          fillOpacity={0.3}
        />
      </>
    );
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
    return null;
  };

  // on page render, get current user location
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // When current location updated, move marker to current location
  useEffect(() => {
    setMarkerLocation(currentLocation);
  }, [currentLocation]);

  const onAvailableTimeChange = (value) => {
    setAvailableTime(value);
  };

  const onMaximumDistanceChange = (value) => {
    setMaxSearchDistance(value);
  };

  const onMaximumElevationChange = (value) => {
    setMaxElevation(value);
  };

  const handleNavigate = (type) => {
    const stateToSend = {
      searchType: type,
      markerLocation: markerLocation,
      availableTimeMinutes: availableTime,
      searchRadiusKm: maxSearchDistance,
      maxElevationMetres: maxElevation,
      useAvailableTime: useAvailableTime,
      useSearchRadius: useMaxSearchDistance,
      useMaxElevation: useMaxElevation,
    };

    navigate(`/routes`, {
      state: stateToSend,
    });
  };

  return (
    <Container sx={{ height: "100%" }} maxWidth="md">
      <Typography
        variant="h5"
        component="h2"
        sx={{ textAlign: "center", padding: "20px" }}
      >
        Route Search Settings
      </Typography>
      <Typography variant="subtitle1" align="center" sx={{ pb: "10px" }}>
        Choose search filters below
      </Typography>
      <Accordion expanded={useAvailableTime}>
        <AccordionSummary
          aria-controls="available-time-filter-content"
          id="available-time-filter-header"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography>Available Time (minutes)</Typography>
            <Switch
              checked={useAvailableTime}
              onChange={(event) => {
                setUseAvailableTime(event.target.checked);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <FilterSlider
            name="Available time (minutes)"
            min={0}
            max={100}
            step={5}
            onChange={onAvailableTimeChange}
            displayName={false}
            defaultValue={30}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={useMaxSearchDistance}>
        <AccordionSummary
          aria-controls="max-search-distance-filter-content"
          id="max-search-distance-filter-header"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography>Distance from location (km)</Typography>
            <Switch
              checked={useMaxSearchDistance}
              onChange={(event) => {
                setUseMaxSearchDistance(event.target.checked);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            Tap on the map to set search centre:
          </Typography>
          <MapContainer
            style={{ height: "50%", minHeight: "200px" }}
            center={[0, 0]}
            zoom={13}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_API_KEY_HERE"
            />
            <MoveMarker />
            <Marker
              eventHandlers={{
                dragend: (e) => {
                  setMarkerLocation({
                    lat: e.target._latlng.lat,

                    lng: e.target._latlng.lng,
                  });
                },
              }}
              position={markerLocation}
              draggable
            ></Marker>
            {useMaxSearchDistance && <SearchRadiusCircle />}
            <UpdateView />
          </MapContainer>
          <Box sx={{ display: "flex", justifyContent: "center", pt: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                getCurrentLocation();
              }}
            >
              Centre on my current location
            </Button>
          </Box>
          <Typography variant="body1" align="center" sx={{ pt: "10px" }}>
            Search radius: {maxSearchDistance} km
          </Typography>
          <Box style={{ paddingTop: "10px" }}>
            <FilterSlider
              name="Maximum distance from origin (km)"
              min={0.5}
              max={10}
              step={0.5}
              onChange={onMaximumDistanceChange}
              displayName={false}
              defaultValue={1}
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion expanded={useMaxElevation}>
        <AccordionSummary
          aria-controls="available-time-filter-content"
          id="available-time-filter-header"
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ width: "100%" }}
          >
            <Typography>Maximum Elevation Gain (m)</Typography>
            <Switch
              checked={useMaxElevation}
              onChange={(event) => {
                setUseMaxElevation(event.target.checked);
              }}
              inputProps={{ "aria-label": "controlled" }}
            />
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <FilterSlider
            name="Maximum elevation gain (m)"
            min={0}
            max={100}
            step={5}
            onChange={onMaximumElevationChange}
            displayName={false}
            defaultValue={100}
          />
        </AccordionDetails>
      </Accordion>

      <Divider sx={{ mt: "10px", mb: "10px" }} />
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1, md: 2, lg: 4 }}
        justifyContent={{ xs: "center", md: "center" }}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: "200px" }}
          onClick={() => {
            handleNavigate("query");
          }}
          disabled={
            !useMaxSearchDistance && !useAvailableTime && !useMaxElevation
          }
        >
          Search
        </Button>
        <Typography variant="h6" align="center">
          or
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: "200px" }}
          onClick={() => {
            handleNavigate("all");
          }}
        >
          Browse all routes
        </Button>
      </Stack>
    </Container>
  );
};

export default RouteSearchConfig;
