const { Router } = require("express");
const {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
} = require("../controllers/places-controller");

const place_router = Router();

// Retrieve list of all places for a given user id (uid)
place_router.get("/user/:uId", getPlacesByUserId);

// Get a specific place by place id (pid)
place_router.get("/:pId", getPlaceById);

// Create a new place
place_router.post("/", createPlace);

// Update a place by id
place_router.patch("/:pId", updatePlace);

// Delete a place by id (pid)
place_router.delete("/:pId", deletePlace);

module.exports = place_router;
