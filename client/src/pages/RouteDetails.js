import { React, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Marker,
  Popup,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";
import * as turf from "@turf/turf";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import ReviewCard from "../components/ReviewCard";
import Divider from "@mui/material/Divider";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DirectionsIcon from "@mui/icons-material/Directions";
import Link from "@mui/material/Link";
import "leaflet-arrowheads";
import startMarkerIcon from "../mapIcons/startMarkerIcon";
import finishMarkerIcon from "../mapIcons/finishMarkerIcon";
import { Rating } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import BookmarkButton from "../components/BookmarkButton";
import {
  getRouteById,
  getAverageRouteRating,
  getRecentReviewsByRouteId,
} from "../api/route.api";
import { getUsernameById } from "../api/user.api";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";

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

const staticMapOptions = {
  zoomControl: false,
  doubleClickZoom: false,
  closePopupOnClick: false,
  dragging: false,
  zoomDelta: false,
  touchZoom: false,
  scrollWheelZoom: false,
};

const RouteDetails = () => {
  const id = useParams().id;
  const [route, setRoute] = useState(null);
  const [authorUsername, setAuthorUsername] = useState("Unknown author");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [recentReviews, setRecentReviews] = useState([]);

  const navigate = useNavigate();

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

  // fetch route author username
  const fetchRouteAuthor = async () => {
    const response = await getUsernameById(route.author);
    const data = await response.json();
    // if request successful
    if (data.success) {
      // set author username
      setAuthorUsername(data.username);
    } else {
      alert("Error", data.error);
    }
  };

  //   fetch average rating for route
  const fetchAverageRating = async () => {
    const response = await getAverageRouteRating(id);
    const data = await response.json();

    if (data.success) {
      if (data.average === null) {
        setAverageRating(0);
      } else {
        setAverageRating(data.average);
      }
      setTotalReviews(data.totalReviews);
    } else {
      console.error("Error", data.error);
    }
  };

  // fetch recent reviews
  const fetchRecentReviews = async () => {
    const response = await getRecentReviewsByRouteId(id);

    const data = await response.json();
    // if request successful
    if (data.success) {
      // set reviews
      setRecentReviews(data.reviews);
    } else {
      alert("Error", data.error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCurrentRoute();
      fetchRecentReviews();
    } else {
      // If no route in props, redirect to route search
      navigate("/routes");
    }
  }, [id]);

  useEffect(() => {
    if (route) {
      fetchRouteAuthor();
      fetchAverageRating();
    }
  }, [route]);

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
          style={{ height: "30%" }}
          center={[0, 0]}
          zoom={13}
          {...staticMapOptions}
        >
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
        <Divider />
        <Container maxWidth="md" sx={{ padding: "5px" }}>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={1}
          >
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
            >
              <IconButton
                color="primary"
                aria-label="preview route"
                onClick={() => {
                  navigate(`/routes/${id}/preview`);
                }}
                size="large"
              >
                <OpenInFullIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="body2">Preview</Typography>
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
            >
              <BookmarkButton routeId={route._id} buttonStyle="iconButton" />
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
            >
              <IconButton
                color="primary"
                aria-label="directions"
                href={`https://www.google.com/maps/dir/?api=1&destination=${route.geoJSON.coordinates[0][1]},${route.geoJSON.coordinates[0][0]}`}
                size="large"
              >
                <DirectionsIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="body2">Directions</Typography>
            </Stack>
            <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={0}
            >
              <IconButton
                color="primary"
                aria-label="navigate"
                onClick={() => {
                  navigate(`/routes/${id}/navigation`);
                }}
                size="large"
              >
                <PlayArrowIcon fontSize="inherit" />
              </IconButton>
              <Typography variant="body2">Go!</Typography>
            </Stack>
          </Stack>
        </Container>
        <Divider />
        <Container
          maxWidth="md"
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <Typography variant="h5" component="h2">
            {route.name}
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
            sx={{ paddingTop: "5px", paddingBottom: "5px" }}
          >
            <Typography variant="body2">{authorUsername}</Typography>
          </Stack>
          <Typography variant="body1">{route.description}</Typography>
        </Container>
        <Divider />
        <Container
          maxWidth="md"
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
            spacing={2}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle2" component="p">
                Distance
              </Typography>
              <Typography variant="h6" component="p">
                {route.length.toPrecision(4)} m
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle2" component="p">
                Estimated Duration
              </Typography>
              <Typography variant="h6" component="p">
                {Math.round(route.duration / 60)} mins
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle2" component="p">
                Elevation Gain
              </Typography>
              <Typography variant="h6" component="p">
                {route.elevation.toPrecision(4)} m
              </Typography>
            </Box>
          </Stack>
        </Container>
        <Divider />
        <Container
          maxWidth="md"
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <Stack
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
          >
            {route.privateLand ? (
              <>
                <LockIcon color="warning" />
                <Typography variant="body1">
                  This route includes private land
                </Typography>
              </>
            ) : (
              <>
                <LockOpenIcon color="success" />
                <Typography variant="body1">
                  This route is publicly accessible
                </Typography>
              </>
            )}
          </Stack>
        </Container>
        <Divider />
        <Container
          maxWidth="md"
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          {totalReviews > 0 ? (
            <>
              <Typography variant="subtitle1">Average Rating:</Typography>
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                sx={{ paddingTop: "5px", paddingBottom: "5px" }}
              >
                <Rating value={averageRating} precision={0.5} readOnly />
                <Typography variant="body1" component="p">
                  {averageRating.toPrecision(2)}/5
                </Typography>
                <Typography variant="body2" component="p">
                  ({totalReviews} review{totalReviews === 1 ? "" : "s"})
                </Typography>
              </Stack>
              <Typography variant="h6">Recent Reviews</Typography>

              {recentReviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}

              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  navigate(`/routes/${id}/reviews`);
                }}
                sx={{ width: "100%", paddingTop: "10px" }}
              >
                <Typography sx={{ textAlignt: "center" }} varient="body1">
                  View all reviews
                </Typography>
              </Link>
            </>
          ) : (
            <Typography align="center" variant="body1">
              No reviews yet
            </Typography>
          )}
        </Container>
      </>
    );
  }
};

export default RouteDetails;
