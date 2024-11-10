const { Router } = require("express");

const user_router  = Router()

// Retrieve list of all users
user_router.get("/", ()=>{})

// Create new user + log user in
user_router.post("/signup", ()=>{})

// Log user in
user_router.post("/login", ()=>{})

module.exports = user_router