require("dotenv").config();

const mongoose = require("mongoose");

const mongoString = process.env.DATABASE_URL;

const initiateMongoServer = async () => {
  try {
    await mongoose.connect(mongoString, {
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error(e);
    throw e;
  }
};

module.exports = initiateMongoServer;
