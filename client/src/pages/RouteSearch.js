import { React, useEffect, useState } from "react";
import { Box, Button, Stack, Container, Divider } from "@mui/material";
import FilterableRouteCardList from "../components/FilterableRouteCardList";
import { useNavigate, useLocation } from "react-router-dom";
import { queryRoutes, getAllRoutes } from "../api/route.api";

const RouteSearch = () => {
  const [routeResults, setRouteResults] = useState(null);
  const [stateLoaded, setStateLoaded] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();

  const runQuery = async () => {
    const queryBody = {
      origin: {
        lng: state.markerLocation.lng,
        lat: state.markerLocation.lat,
      },
      availableTimeMinutes: state.availableTimeMinutes,
      searchRadiusKm: state.searchRadiusKm,
      maxElevationMetres: state.maxElevationMetres,
      useAvailableTime: state.useAvailableTime,
      useSearchRadius: state.useSearchRadius,
      useMaxElevation: state.useMaxElevation,
    };

    const response = await queryRoutes(queryBody);

    const data = await response.json();
    // if request successful
    if (data.success) {
      // set search results
      setRouteResults(data.routes);
    } else {
      alert("Error", data.error);
    }
  };

  // function to fetch routes from database
  const fetchAllRoutes = async () => {
    const response = await getAllRoutes();
    const data = await response.json();
    // if request successful
    if (data.success) {
      // set search results
      setRouteResults(data.routes);
    } else {
      alert("Error", data.error);
    }
  };

  const selectRandomRoute = () => {
    // select a random route from the list
    const randomIndex = Math.floor(Math.random() * routeResults.length);
    const randomRoute = routeResults[randomIndex];
    navigate(`/routes/${randomRoute._id}`);
  };

  // useEffect to start route fetch
  useEffect(() => {
    if (state && state.searchType === "query") {
      runQuery();
    } else {
      fetchAllRoutes();
    }
  }, [state]);

  return (
    <Box sx={{ display: "flex", flexFlow: "column", height: "100%" }}>
      <Container
        maxWidth="md"
        sx={{ paddingTop: "10px", paddingBottom: "10px" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={selectRandomRoute}
            disabled={!routeResults || routeResults.length === 0}
          >
            Choose for me
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/routes/configure");
            }}
          >
            Configure search
          </Button>
        </Stack>
      </Container>
      <Divider />
      <Container
        maxWidth="md"
        sx={{
          paddingTop: "10px",
          flex: "auto",
          overflowY: "auto",
        }}
      >
        <FilterableRouteCardList routes={routeResults} />
      </Container>
    </Box>
  );
};

export default RouteSearch;
