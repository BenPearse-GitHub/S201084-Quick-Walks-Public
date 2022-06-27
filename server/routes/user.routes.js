const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const bookmarkController = require("../controllers/bookmark.controller");
const auth = require("../middleware/auth");

// get username by id
userRouter.get("/:userId/username", userController.getUsername);

// Bookmarks

// get all bookmarks for user
userRouter.get(
  "/:userId/bookmarks",
  auth.auth,
  bookmarkController.getAllBookmarks
);

// post new bookmark for user
userRouter.post(
  "/:userId/bookmarks",
  auth.auth,
  bookmarkController.addBookmark
);

// check if route is already bookmarked
userRouter.get(
  "/:userId/bookmarks/:routeId",
  auth.auth,
  bookmarkController.checkBookmarkExists
);

// delete bookmark by routeId
userRouter.delete(
  "/:userId/bookmarks/:routeId",
  auth.auth,
  bookmarkController.removeBookmark
);

module.exports = userRouter;
