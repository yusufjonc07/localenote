const express = require("express");
const mongoose = require("mongoose");
const bodyBarser = require("body-parser");
const HttpError = require("./models/http-error");
const place_router = require("./routes/places-route");
const user_router = require("./routes/users-route");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(bodyBarser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

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
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  /// here we are listening for the event that request send from our endpoints.
  if (res.headerSent) {
    return next(error);
  }
  /// then we see there is error either exist or unexist,
  // and we send it user as json with error code specified
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qjten.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(5001);
  })
  .catch((err) => {
    console.log(err);
  });
