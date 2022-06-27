import { React, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Rating, Stack } from "@mui/material";
import { getUsernameById } from "../api/user.api";

const ReviewCard = (props) => {
  const review = props.review;
  const [author, setAuthor] = useState(null);
  const [rating, setRating] = useState(null);
  const [reviewDate, setReviewDate] = useState(null);

  // Get author name
  const getAuthorName = async () => {
    const response = await getUsernameById(review.userId);
    const data = await response.json();

    if (data.success) {
      setAuthor(data.username);
    } else {
      console.error("Error", data.error);
    }
  };

  useEffect(() => {
    getAuthorName();
  }, [review.userId]);

  useEffect(() => {
    setRating(review.rating);
  }, [review.rating]);

  useEffect(() => {
    const tempDate = new Date(review.createdAt);
    const date = `${tempDate.getDate()}/${
      tempDate.getMonth() + 1
    }/${tempDate.getFullYear()} at ${tempDate.getHours()}:${tempDate.getMinutes()}`;

    setReviewDate(date);
  }, [review.createdAt]);

  if (!review || review.length === 0) {
    return (
      <Typography sx={{ color: "red" }} variant="subtitle1">
        Review prop not found!
      </Typography>
    );
  } else {
    return (
      <Card sx={{ minWidth: 275, marginBottom: "10px" }}>
        <Box sx={{ padding: "10px" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
          >
            {author ? (
              <Typography variant="subtitle2">{author}</Typography>
            ) : (
              <Typography variant="subtitle2">Author unknown</Typography>
            )}
            <Rating value={rating} size="small" readOnly />
          </Stack>
          <Typography variant="body1" gutterBottom>
            {review.body}
          </Typography>
          <Typography variant="body2">{reviewDate}</Typography>
        </Box>
      </Card>
    );
  }
};

export default ReviewCard;
