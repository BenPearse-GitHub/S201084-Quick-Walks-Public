const express = require("express");
const bodyParser = require("body-parser");
const initiateMongoServer = require("./config/db");
require("dotenv").config();
const apiRoutes = require("./routes/api.routes");

// Initiate mongo server
initiateMongoServer();

const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

// Assigning API routes to the app
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API" });
});

// start the server
app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
