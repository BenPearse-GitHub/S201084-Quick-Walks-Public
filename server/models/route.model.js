const mongoose = require("mongoose");
const haversine = require("haversine-distance");
const addElevation = require("geojson-elevation").addElevation;
const TileSet = require("node-hgt").TileSet;

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  description: {
    type: String,
    default: "No description.",
    maxlength: 250,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  geoJSON: {
    type: {
      type: String,
      enum: {
        values: ["LineString"],
        default: "LineString",
        required: true,
        message: "Invalid GeoJSON type, route must be in LineString format.",
      },
      immutable: true,
    },
    coordinates: {
      type: [[Number]],
      required: true,
    },
  },
  startPoint: {
    type: {
      type: String,
      enum: {
        values: ["Point"],
        default: "Point",
        required: true,
        message: "Invalid GeoJSON type, start point must be in Point format.",
      },
      immutable: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  length: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 0,
  },
  elevation: {
    type: Number,
    default: 0,
  },
  privateLand: {
    type: Boolean,
    default: false,
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

// routeSchema pre to calculate length of route (in meters), and route duration (in seconds)
routeSchema.pre("save", function (next) {
  const coordinates = this.geoJSON.coordinates;
  let length = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    length += haversine(coordinates[i], coordinates[i + 1]);
  }
  this.length = length;
  // calculate time duration based on average walking pace of 1.42 m/s
  this.duration = length / 1.42;

  // calculate elevation
  addElevation(this.geoJSON, new TileSet("./mapData"), function (err, geojson) {
    if (!err) {
      // Add elevation data to each coordinate pair on route
      this.geoJSON = geojson;
    } else {
      console.error(err);
    }
    next();
  });
});

// routeSchema pre to add total elevation gain to route
routeSchema.pre("save", function (next) {
  const coordinates = this.geoJSON.coordinates;
  let elevation = 0;
  for (let i = 0; i < coordinates.length; i++) {
    if (i !== 0) {
      const difference = coordinates[i][2] - coordinates[i - 1][2];
      if (difference > 0) {
        elevation += difference;
      }
    }
  }
  this.elevation = elevation;
  next();
});

// routeSchema pre to set start point to first coordinate pair
routeSchema.pre("save", function (next) {
  const startCoords = [
    this.geoJSON.coordinates[0][0],
    this.geoJSON.coordinates[0][1],
  ];

  this.startPoint = {
    type: "Point",
    coordinates: startCoords,
  };
  next();
});

// create 2dsphere index on startPoint
routeSchema.index({ startPoint: "2dsphere" });

module.exports = mongoose.model("Route", routeSchema);
