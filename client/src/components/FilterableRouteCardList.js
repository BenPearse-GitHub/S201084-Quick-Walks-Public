import RouteCard from "./RouteCard";
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Container,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getAverageRouteRating } from "../api/route.api";

//   fetch average rating for route
const fetchAverageRating = async (route) => {
  const response = await getAverageRouteRating(route._id);
  const data = await response.json();

  if (data.success) {
    if (data.average === null) {
      data.average = 0;
    }
    return data;
  } else {
    console.error("Error", data.error);
  }
};

// Custom filter function for RouteCardList
const descending = (property) => {
  return (a, b) => {
    if (a[property] > b[property]) {
      // return a before b
      return -1;
    } else if (a[property] < b[property]) {
      // return b before a
      return 1;
    } else {
      // return a and b are equal
      return 0;
    }
  };
};

// Custom filter function for RouteCardList
const ascending = (property) => {
  return (a, b) => {
    if (a[property] < b[property]) {
      // return a before b
      return -1;
    } else if (a[property] > b[property]) {
      // return b before a
      return 1;
    } else {
      // return a and b are equal
      return 0;
    }
  };
};

//   sort routes based on selected filter
const sortRoutes = (routesToSort, sort) => {
  switch (sort) {
    case "rating":
      // return routes sorted by descending average rating
      return routesToSort.sort(descending("averageRating"));
    case "longest":
      // return routes sorted by descending length
      return routesToSort.sort(descending("length"));
    case "shortest":
      // return routes sorted by ascending length
      return routesToSort.sort(ascending("length"));
    case "elevation":
      // return routes sorted by descending elevation
      return routesToSort.sort(descending("elevation"));
    case "flatness":
      // return routes sorted by ascending elevation
      return routesToSort.sort(ascending("elevation"));
    default:
      return routesToSort;
  }
};

const FilterableRouteCardList = (props) => {
  const routes = props.routes;
  const [sortBy, setSortBy] = useState("rating");
  const [ratedRoutes, setRatedRoutes] = useState(null);
  const [sortedResults, setSortedResults] = useState(null);

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  //   When routes are detected, fetch rating data for each route and add to setRatedRoutes
  useEffect(() => {
    async function fetchData() {
      if (routes) {
        let tempRatedRoutes = routes;
        for (let i = 0; i < tempRatedRoutes.length; i++) {
          const response = await fetchAverageRating(tempRatedRoutes[i]);
          tempRatedRoutes[i].averageRating = response.average;
          tempRatedRoutes[i].totalReviews = response.totalReviews;
        }
        setRatedRoutes(tempRatedRoutes);
      }
    }
    fetchData();
  }, [routes]);

  useEffect(() => {
    if (ratedRoutes) {
      const sorted = sortRoutes([...ratedRoutes], sortBy);
      setSortedResults(sorted);
    }
  }, [sortBy, ratedRoutes]);

  if (!sortedResults) {
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
  } else if (sortedResults.length === 0) {
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
        <Typography variant="h4">No routes found</Typography>
      </Box>
    );
  } else {
    return (
      //   map routes to route cards
      <>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <Typography variant="h6">
            Results ({sortedResults ? sortedResults.length : 0})
          </Typography>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="sort-select">Sort By</InputLabel>
            <Select
              labelId="sort-select"
              id="sort-select"
              value={sortBy}
              label="Sort By"
              onChange={handleSortByChange}
            >
              <MenuItem value="rating">Top rated</MenuItem>
              <MenuItem value="longest">Longest</MenuItem>
              <MenuItem value="shortest">Shortest</MenuItem>
              <MenuItem value="elevation">Elevation</MenuItem>
              <MenuItem value="flatness">Flatness</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {sortedResults.map((route) => (
          <RouteCard key={route._id} route={route} />
        ))}
      </>
    );
  }
};

export default FilterableRouteCardList;
