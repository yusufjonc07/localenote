const express = require("express");
const mongoose = require("mongoose");
const bodyBarser = require("body-parser");
const HttpError = require("./models/http-error");
const place_router = require("./routes/places-route");
const user_router = require("./routes/users-route");

const app = express();

app.use(bodyBarser.json());

app.get("/", (req, res) => {
  res.send(`Hello home`);
});

// registering place router
app.use("/api/places", place_router);

// registering user router
app.use("/api/users", user_router);

/// whenever there is no the requested route, 404 not found error should be thowen
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  /// here we are listening for the event that request send from our endpoints.
  if (res.headerSent) {
    return next(error);
  }
  /// then we see there is error either exist or unexist,
  // and we send it user as json with error code specified
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect("mongodb+srv://yahmedov64:cP5ucckiTzv3Meyx@cluster0.qjten.mongodb.net/localnote-main?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    app.listen(5001);
  })
  .catch((err) => {
    console.log(err);
  });
