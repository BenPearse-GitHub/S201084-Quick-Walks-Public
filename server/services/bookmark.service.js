const User = require("../models/user.model");
const Route = require("../models/route.model");

exports.checkUserExists = async (userId) => {
  if (!userId) {
    return {
      status: 401,
      success: false,
      message: "User id is required",
    };
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        status: 401,
        success: false,
        message: "User does not exist",
      };
    }
  } catch (err) {
    return {
      status: 500,
      success: false,
      message: "Error checking user exists",
      error: err,
    };
  }
  return {
    status: 200,
    success: true,
    message: "User exists",
  };
};

exports.checkRouteExists = async (routeId) => {
  if (!routeId) {
    return {
      status: 401,
      success: false,
      message: "Route id is required",
    };
  }
  try {
    const route = await Route.findById(routeId);
    if (!route) {
      return {
        status: 401,
        success: false,
        message: "Route does not exist",
      };
    }
  } catch (err) {
    return {
      status: 500,
      success: false,
      message: "Error checking route exists",
      error: err,
    };
  }
  return {
    status: 200,
    success: true,
    message: "Route exists",
  };
};
