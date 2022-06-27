import {
  Button,
  Typography,
  Container,
  Stack,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
} from "@mui/material";
import { React, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  useMap,
  GeoJSON,
  Marker,
  Popup,
} from "react-leaflet";
import * as turf from "@turf/turf";
import "leaflet-arrowheads";
import startMarkerIcon from "../mapIcons/startMarkerIcon";
import finishMarkerIcon from "../mapIcons/finishMarkerIcon";
import BookmarkButton from "../components/BookmarkButton";
import jwtDecode from "jwt-decode";
import { getRouteById, postReview } from "../api/route.api";

const staticMapOptions = {
  zoomControl: false,
  doubleClickZoom: false,
  closePopupOnClick: false,
  dragging: false,
  zoomDelta: false,
  touchZoom: false,
  scrollWheelZoom: false,
};

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

// If no route in props, redirect to route search
const RouteComplete = () => {
  const routeId = useParams().id;
  const { state } = useLocation();
  const { time, distance } = state;
  const [route, setRoute] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [rating, setRating] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const fetchCurrentRoute = async () => {
    const response = await getRouteById(routeId);
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

  const handleReviewDialogClose = () => {
    setOpenReviewDialog(false);
  };

  const handleFeedbackSubmission = async () => {
    const response = await postReview({
      token: token,
      routeId: routeId,
      reviewText: reviewText,
      rating: rating,
    });
    const data = await response.json();
    if (data.success) {
      handleReviewDialogClose();
      setRating(null);
      setReviewText("");
    } else {
      alert("Error", data.error);
    }
  };

  useEffect(() => {
    if (routeId === null || time === null || distance === null) {
      navigate("/routes");
    } else {
      fetchCurrentRoute();
      setToken(sessionStorage.getItem("token"));
    }
  }, []);

  if (route) {
    return (
      <Box
        id="home"
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          background: "#FFFFFFBF",
        }}
      >
        <MapContainer
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            zIndex: "-1",
            PointerEvents: "none",
          }}
          center={[0, 0]}
          zoom={13}
          {...staticMapOptions}
        >
          <UpdateView route={route} />
          <TileLayer url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_API_KEY_HERE" />
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
        <Container>
          <Typography
            sx={{
              textAlign: "center",
              paddingBottom: "30px",
              paddingTop: "30px",
            }}
            variant="h3"
          >
            Walk Complete!
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
            }}
          >
            You walked {distance.toPrecision(4)} m in {time}.
          </Typography>
        </Container>
        <Container
          maxWidth="md"
          sx={{ paddingBottom: "20px", paddingTop: "20px" }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1, md: 2, lg: 4 }}
            justifyContent={{ xs: "center", md: "space-evenly" }}
            alignItems={{ xs: "stretch", md: "flex-start" }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setOpenReviewDialog(true);
              }}
              disabled={!token}
            >
              Leave a Review
            </Button>
            <BookmarkButton routeId={routeId} buttonStyle="standardButton" />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                navigate("/");
              }}
            >
              Return Home
            </Button>
          </Stack>
        </Container>
        {/* Feedback submission dialog */}
        <Dialog open={openReviewDialog} onClose={handleReviewDialogClose}>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter your review of this route below.
            </DialogContentText>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Comments"
              type="email"
              fullWidth
              variant="standard"
              multiline
              value={reviewText}
              onChange={(event) => {
                setReviewText(event.target.value);
              }}
              inputProps={{ maxLength: 250 }}
            />
            <Typography variant="caption">
              {250 - reviewText.length} characters remaining
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleReviewDialogClose}>Cancel</Button>
            <Button onClick={handleFeedbackSubmission}>Submit</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
};

export default RouteComplete;
