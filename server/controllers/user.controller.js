const User = require("../models/user.model");

// get username by id
exports.getUsername = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        username: user.username,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: err,
    });
  }
};
