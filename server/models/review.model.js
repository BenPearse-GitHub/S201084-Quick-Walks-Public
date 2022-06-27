const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
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
  body: {
    type: String,
    default: "",
    maxlength: 250,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
