// npm dependencies
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const http = require("http");

// other imports
const masterswitchRoute = require("./api/routes/masterswitch");
const deviceRoute = require("./api/routes/devices");
const roomRoute = require("./api/routes/rooms");
const Testing = require("./api/routes/testing");
const apolloServer = require("./api/graphql/apolloServer");

app.disable("powered-by-people");

// Development logger. Disable in production
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

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
app.use("/masterswitch", masterswitchRoute);
app.use("/devices", deviceRoute);
app.use("/rooms", roomRoute);
app.use("/test", Testing);

// Wierd syntax to start Apollo server as express middleware
// start it before error handling since Apollo server does it's own error handling
// Apollo's defualt endpoint is /graphql, dunno how to change it, and doesn't care
apolloServer.applyMiddleware({ app: app, cors: false });

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
      message: error.message,
    },
  });
});

const port = process.env.SERVER_PORT || 3500;

// This will make the server
const server = http.createServer(app);

// This will bind the websocket connnection to ws://localhost:3500/graphql
// dunno how to change it, and doesn't care.
apolloServer.installSubscriptionHandlers(server);

server.listen(port);

// Wait a little bit for the TradfriClient to connect
setTimeout(() => {
  console.log(`API running @ http://localhost:${port}`);
}, 500);

module.exports = app;
