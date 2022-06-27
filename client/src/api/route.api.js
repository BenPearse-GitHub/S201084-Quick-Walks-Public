import jwtDecode from "jwt-decode";

// get one route, requires routeId
async function getRouteById(routeId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/routes/${routeId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

// query routes api, requires query
async function queryRoutes(queryBody) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/routes/query`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(queryBody),
    }
  );
  return response;
}

// get all routes api
async function getAllRoutes() {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/routes`, {
    method: "GET",
  });
  return response;
}

// post new route api, requires request body and token
async function postNewRoute(args) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/routes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": args.token,
    },
    body: JSON.stringify(args.body),
  });
  return response;
}

// get all reviews for a route, requires routeId
async function getAllReviewsByRouteId(routeId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/routes/${routeId}/reviews`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

// post a new review, requires token, routeId, reviewText, rating
async function postReview(args) {
  const user = jwtDecode(args.token);
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/routes/${args.routeId}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": args.token,
      },
      body: JSON.stringify({
        userId: user._id,
        body: args.reviewText,
        rating: args.rating,
      }),
    }
  );
  return response;
}

// fetch recent reviews for route, requires routeId
async function getRecentReviewsByRouteId(routeId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/routes/${routeId}/reviews/recent`,
    {
      method: "GET",
    }
  );
  return response;
}

// get average rating for a route, requires routeId
async function getAverageRouteRating(routeId) {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/routes/${routeId}/reviews/average-rating`
  );
  return response;
}

export {
  getRouteById,
  queryRoutes,
  getAllRoutes,
  postNewRoute,
  getAllReviewsByRouteId,
  postReview,
  getRecentReviewsByRouteId,
  getAverageRouteRating,
};
