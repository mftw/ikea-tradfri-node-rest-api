// npm dependencies
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

// other imports
const masterswitchRoute = require('./api/routes/masterswitch');
const deviceRoute = require("./api/routes/devices");
const roomRoute = require("./api/routes/rooms");

// Development logger. To be disabled in production
app.use(morgan("dev"));

// Setup static route for image resources
app.use(
  "/uploads",
  express.static(
    "uploads",
    // Pass config object to set cache control header
    {
      maxAge: "7d"
    }
  )
);

// Make express parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup CORS response headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    // res.setHeader("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.sendStatus(200);
  }
  next();
});

// Routes which should handle requests
app.use("/masterswitch", masterswitchRoute)
app.use("/devices", deviceRoute);
app.use("/rooms", roomRoute);

// Make 404 response when dead endpoint
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// Spit any error out in the api reponses
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// const serializedb = require('./serializedb');
// serializedb();
// serializedb.includeProductGroupRel();
// console.log(process)

module.exports = app;
