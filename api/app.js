// Express app server

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyparser = require("body-parser");
const process = require("process");

// Handle SINGTERM & SIGINT signals immediately to speed up docker container recreation.
process.on("SIGTERM", function onSigterm() {
  process.exit();
});
process.on("SIGINT", function onSigint() {
  process.exit();
});

// Import the routes
const videoRoutes = require("./routes/video");
const searchRoutes = require("./routes/search");

// Handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

// Add logging with morgan, and set up body-parser
app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Specify routes for the app
app.use("/video", videoRoutes);
app.use("/search", searchRoutes);

// Handle errors from endpoints that are not found
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Handle any other possible error, and pass the error message along
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
