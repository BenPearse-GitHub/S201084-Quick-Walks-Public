const Route = require("../models/route.model");

// post a new route
exports.create = async (req, res) => {
  try {
    const route = new Route(req.body);
    const newRoute = await route.save();
    res.status(200).json({
      success: true,
      message: "Route created successfully",
      route: newRoute,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error creating route",
      error: err,
    });
  }
};

// get route by id
exports.getById = async (req, res) => {
  try {
    const route = await Route.findById(req.params.routeId);
    res.status(200).json({
      success: true,
      message: "Route fetched successfully",
      route: route,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching route",
      error: err,
    });
  }
};

// Get all routes
exports.getAll = async (req, res) => {
  try {
    const routes = await Route.find({});
    res.status(200).json({
      success: true,
      message: "Routes fetched successfully",
      routes: routes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching routes",
      error: err,
    });
  }
};

// Query routes by duration, distance from given point, rating, and max elevation
exports.query = async (req, res) => {
  try {
    const {
      origin,
      availableTimeMinutes,
      searchRadiusKm,
      maxElevationMetres,

      // Optional
      useAvailableTime,
      useSearchRadius,
      useMaxElevation,
    } = req.body;
    const query = {};
    if (useAvailableTime) {
      query.duration = {
        $lte: availableTimeMinutes * 60, // convert minutes to seconds
      };
    }

    if (useSearchRadius) {
      query.startPoint = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [origin.lng, origin.lat],
          },
          $maxDistance: searchRadiusKm * 1000, // convert km to meters
        },
      };
    }

    if (useMaxElevation) {
      query.elevation = {
        $lte: maxElevationMetres,
      };
    }

    const routes = await Route.find(query);
    res.status(200).json({
      success: true,
      message: "Routes fetched successfully",
      results: routes.length,
      routes: routes,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching routes",
      error: err,
    });
  }
};
