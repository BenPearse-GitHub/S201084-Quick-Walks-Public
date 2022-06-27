import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Container } from "@mui/material";
import { Link } from "react-router-dom";
import Rating from "@mui/material/Rating";

import { MapContainer, TileLayer, useMap, GeoJSON } from "react-leaflet";
import * as turf from "@turf/turf";

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
  // zoomSnap: false,
  zoomDelta: false,
  // trackResize: false,
  touchZoom: false,
  scrollWheelZoom: false,
};

const RouteCard = (props) => {
  const { route } = props;

  if (!route) {
    return (
      <Typography sx={{ color: "red" }} variant="h6">
        Route prop not found!
      </Typography>
    );
  } else {
    return (
      <Card sx={{ minWidth: 275, marginBottom: "10px" }}>
        <CardActionArea component={Link} to={`/routes/${route._id}`}>
          <Stack direction="row" spacing={1}>
            <Box sx={{ width: "35%", minWidth: "35%" }}>
              <MapContainer
                style={{ height: "100%", width: "100%", minWidth: "100%" }}
                center={[0, 0]}
                zoom={13}
                {...staticMapOptions}
              >
                <UpdateView route={route} />
                <TileLayer url="https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=YOUR_API_KEY_HERE" />
                <GeoJSON data={route.geoJSON} pathOptions={{ color: "red" }} />
              </MapContainer>
            </Box>
            <Box
              sx={{
                height: "100%",
                width: "65%",
                maxWidth: "65%",
                padding: "5px",
                paddingLeft: "10px",
              }}
            >
              <Typography
                sx={{ width: "calc(100% - 15px)" }}
                noWrap={true}
                variant="h6"
                component="h3"
              >
                {route.name}
              </Typography>
              {route.totalReviews > 0 ? (
                <Stack direction="row" spacing={1}>
                  <Rating
                    name="average-route-rating"
                    value={route.averageRating}
                    defaultValue={0}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <Typography variant="body2" component="p">
                    ({route.totalReviews} review
                    {route.totalReviews === 1 ? "" : "s"})
                  </Typography>
                </Stack>
              ) : (
                <Typography variant="body2" component="p">
                  (No reviews yet)
                </Typography>
              )}
              <Stack
                direction="row"
                spacing={{ xs: 0, sm: 1, md: 4 }}
                sx={{ flexWrap: "wrap" }}
              >
                <Typography variant="body1" component="p">
                  Length: {route.length.toPrecision(4)} m
                </Typography>
                <Typography variant="body1" component="p">
                  Duration: {Math.round(route.duration / 60)} mins
                </Typography>
                <Typography variant="body1" component="p">
                  Elevation gain: {route.elevation.toPrecision(4)} m
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </CardActionArea>
      </Card>
    );
  }
};

export default RouteCard;
