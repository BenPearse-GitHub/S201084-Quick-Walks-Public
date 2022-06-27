const Review = require("../models/review.model");

// Create a new review
exports.create = async (req, res) => {
  try {
    const review = new Review({
      userId: req.body.userId,
      routeId: req.params.routeId,
      body: req.body.body,
      rating: req.body.rating,
    });
    const result = await review.save();
    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating review",
      error: err,
    });
  }
};

// Get average rating for route
exports.getAverage = async (req, res) => {
  try {
    // get all reviews for route
    const reviews = await Review.find({ routeId: req.params.routeId });
    // get average rating
    const average =
      reviews.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0) / reviews.length;
    res.status(200).json({
      success: true,
      message: "Average rating fetched successfully",
      average: average,
      totalReviews: reviews.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching average rating",
      error: err,
    });
  }
};

// get three most recent reviews for route
exports.getRecent = async (req, res) => {
  try {
    // get all reviews for route
    const reviews = await Review.find({ routeId: req.params.routeId });
    // sort reviews by date
    const sortedReviews = reviews.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // get three most recent reviews
    const recentReviews = sortedReviews.slice(0, 3);
    res.status(200).json({
      success: true,
      message: "Recent reviews fetched successfully",
      reviews: recentReviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching recent reviews",
      error: err,
    });
  }
};

// Get all reviews for route
exports.getAll = async (req, res) => {
  try {
    const reviews = await Review.find({ routeId: req.params.routeId });
    res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews: reviews,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: err,
    });
  }
};
