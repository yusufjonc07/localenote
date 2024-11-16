const { Router } = require("express");
const { check } = require("express-validator");
const { getUsers, signup, login } = require("../controllers/users-controller");

const user_router = Router();

// Retrieve list of all users
user_router.get("/", getUsers);

// Create new user + log user in
user_router.post(
  "/signup",
  [
    check("name").notEmpty(),
    check("email").notEmpty().isEmail(),
    check("password")
      .notEmpty()
      .isStrongPassword({ minLength: 6 })
      .withMessage("Iltimos, xavfsiz parol kiriting!"),
  ],
  signup
);

// Log user in
user_router.post(
  "/login",
  [
    check("email").notEmpty().isEmail(),
    check("password").notEmpty().isLength({ minLength: 6 }),
  ],
  login
);

module.exports = user_router;
