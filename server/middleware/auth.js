const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

exports.auth = async (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token, authorization denied",
    });
  }
  try {
    // Validate and decode the jwt token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const _id = decoded._id;
    const user = await User.findById(_id);

    return next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};
