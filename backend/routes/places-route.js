const { Router } = require("express");

const place_router  = Router()

// Retrieve list of all places for a given user id (uid)
place_router.get("/user/:uId", ()=>{})

// Get a specific place by place id (pid)
place_router.get("/:pId", ()=>{})

// Create a new place
place_router.post("/", ()=>{})

// Update a place by id
place_router.patch("/:pId", ()=>{})

// Delete a place by id (pid)
place_router.delete("/:pId", ()=>{})


module.exports = place_router