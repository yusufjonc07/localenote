const { Router } = require("express");
const { getUsers, signup, login } = require("../controllers/users-controller");

const user_router = Router();

// Retrieve list of all users
user_router.get("/", getUsers);

// Create new user + log user in
user_router.post("/signup", signup);

// Log user in
user_router.post("/login", login);

module.exports = user_router;
