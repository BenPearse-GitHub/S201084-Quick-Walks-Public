import { Typography, Container, Stack, Rating } from "@mui/material";
import FilterableReviewCardList from "../components/FilterableReviewCardList";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getAllReviewsByRouteId,
  getAverageRouteRating,
} from "../api/route.api";

const AllRouteReviews = () => {
  const id = useParams().id;
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  // get all reviews for route
  const getRouteReviews = async () => {
    const response = await getAllReviewsByRouteId(id);
    const data = await response.json();

    if (data.success) {
      setReviews(data.reviews);
    } else {
      console.error("Error", data.error);
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
    } else {
      console.error("Error", data.error);
    }
  };

  useEffect(() => {
    getRouteReviews();
    fetchAverageRating();
  }, [id]);

  return (
    <Container>
      <Typography
        variant="h5"
        component="h5"
        textAlign="center"
        sx={{ margin: "10px" }}
      >
        All Route Reviews
      </Typography>
      <Typography variant="subtitle1">Average rating:</Typography>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography variant="body1" component="p">
          {averageRating.toPrecision(2)}/5
        </Typography>
      </Stack>
      <FilterableReviewCardList reviews={reviews} />
    </Container>
  );
};

export default AllRouteReviews;
