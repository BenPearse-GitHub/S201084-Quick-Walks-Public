import ReviewCard from "./ReviewCard";
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

// Custom filter function for ReviewCardList
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

// Custom filter function for ReviewCardList
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

//   sort reviews based on selected filter
const sortRoutes = (routesToSort, sort) => {
  switch (sort) {
    case "top":
      // return reviews sorted by descending  rating
      return routesToSort.sort(descending("rating"));
    case "latest":
      // return reviews sorted by descending createdAt
      return routesToSort.sort(descending("createdAt"));
    default:
      return routesToSort;
  }
};

const FilterableReviewCardList = (props) => {
  const reviews = props.reviews;
  const [sortBy, setSortBy] = useState("top");
  const [sortedResults, setSortedResults] = useState(null);

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    if (reviews) {
      const sorted = sortRoutes([...reviews], sortBy);
      setSortedResults(sorted);
    }
  }, [sortBy, reviews]);

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
  } else if (sortedResults && sortedResults.length === 0) {
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
        <Typography textAlign="center" variant="h4">
          No reviews found
        </Typography>
      </Box>
    );
  } else {
    return (
      //   map routes to route cards
      <Box sx={{ overflowY: "auto" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={1}
          sx={{ paddingTop: "10px", paddingBottom: "10px" }}
        >
          <Typography variant="h6">
            All Reviews ({sortedResults ? sortedResults.length : 0})
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
              <MenuItem value="top">Top</MenuItem>
              <MenuItem value="latest">Latest</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        {sortedResults.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </Box>
    );
  }
};

export default FilterableReviewCardList;
