const bookmarkService = require("../services/bookmark.service");
const Bookmark = require("../models/bookmark.model");

// get all bookmarks by user id
exports.getAllBookmarks = async (req, res) => {
  const reqUserId = req.params.userId;
  if (!reqUserId) {
    return res.status(401).json({
      success: false,
      message: "User id is required",
    });
  }
  try {
    const response = await Bookmark.find({ userId: reqUserId });
    return res.status(200).json({
      success: true,
      message: "Bookmarks fetched successfully",
      bookmarks: response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error fetching bookmarks",
      error: err,
    });
  }
};

// check bookmark exists
exports.checkBookmarkExists = async (req, res) => {
  const reqUserId = req.params.userId;
  const reqRouteId = req.params.routeId;
  if (!reqUserId || !reqRouteId) {
    return res.status(401).json({
      success: false,
      message: "User id and route id are required",
    });
  } else {
    try {
      const response = await Bookmark.find({
        userId: reqUserId,
        routeId: reqRouteId,
      });
      if (response.length > 0) {
        return res.status(200).json({
          success: true,
          message: "Bookmark exists",
          bookmark: response[0],
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Bookmark does not exist",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error checking bookmark exists",
        error: err,
      });
    }
  }
};

// add bookmark
exports.addBookmark = async (req, res) => {
  const reqUserId = req.params.userId;
  const reqRouteId = req.body.routeId;
  if (!reqUserId || !reqRouteId) {
    return res.status(401).json({
      success: false,
      message: "User id and route id are required",
    });
  }

  // check route exists
  const routeExists = await bookmarkService.checkRouteExists(reqRouteId);

  if (!routeExists.success) {
    return res.status(routeExists.status).json(routeExists);
  }

  // check user exists
  const userExists = await bookmarkService.checkUserExists(reqUserId);

  if (!userExists.success) {
    return res.status(userExists.status).json(userExists);
  }

  if (routeExists.success && userExists.success) {
    try {
      const newBookmark = new Bookmark({
        userId: reqUserId,
        routeId: reqRouteId,
      });
      const response = await newBookmark.save();
      return res.status(200).json({
        success: true,
        message: "Bookmark added successfully",
        bookmark: response,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error adding bookmark",
        error: err,
      });
    }
  }
};

// remove bookmark
exports.removeBookmark = async (req, res) => {
  const reqUserId = req.params.userId;
  const reqRouteId = req.params.routeId;
  if (!reqUserId || !reqRouteId) {
    return res.status(401).json({
      success: false,
      message: "User id and route id are required",
    });
  }
  try {
    const response = await Bookmark.findOneAndDelete({
      userId: reqUserId,
      routeId: reqRouteId,
    });
    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
      bookmark: response,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error removing bookmark",
      error: err,
    });
  }
};
