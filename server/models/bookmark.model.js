const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  routeId: {
    type: mongoose.Schema.ObjectId,
    ref: "Route",
    required: true,
  },
});

module.exports = mongoose.model("Bookmark", bookmarkSchema);
