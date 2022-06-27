const express = require("express");
const routeRouter = express.Router();
const routeController = require("../controllers/route.controller");
const reviewController = require("../controllers/review.controller");
const auth = require("../middleware/auth");

// post a new route
routeRouter.post("/", auth.auth, routeController.create);

// get all routes
routeRouter.get("/", routeController.getAll);

// get a route by id
routeRouter.get("/:routeId", routeController.getById);

// Query routes
routeRouter.post("/query", routeController.query);

// Get all reviews for a route
routeRouter.get("/:routeId/reviews", reviewController.getAll);

// post a new review for a route
routeRouter.post("/:routeId/reviews", auth.auth, reviewController.create);

// get recent reviews for a route
routeRouter.get("/:routeId/reviews/recent", reviewController.getRecent);

// get average rating for a route
routeRouter.get(
  "/:routeId/reviews/average-rating",
  reviewController.getAverage
);

module.exports = routeRouter;
