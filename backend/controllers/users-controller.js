const HttpError = require("../models/http-error");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, ["-password", "-email", "-__v"]).populate(
      "places"
    );
  } catch (error) {
    return next(new HttpError("Cannot fetch users. Try again later", 500));
  }

  if (!users || users.length === 0) {
    return next(new HttpError("No users found", 404));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);

    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let hasUser;

  try {
    hasUser = await User.findOne({ email: email });
  } catch (error) {
    return next(
      new HttpError("Signing up failed. Please try again later", 500)
    );
  }

  if (hasUser) {
    return next(
      new HttpError(
        "User with this email exists. Please use another email or login",
        422
      )
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bycrypt.hash(password, 12);
  } catch (error) {
    return next(
      new HttpError("Signing up failed. Please try again later", 500)
    );
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await newUser.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Signing up failed. Please try again later", 500)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY,
      {
        expiresIn: "2h",
      }
    );
  } catch (error) {
    return next(
      new HttpError("Opps, Login failed. Plese try again later", 500)
    );
  }

  res.status(200).json({
    userId: newUser.id,
    email: newUser.email,
    token: token,
  });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;

  try {
    identifiedUser = await User.findOne({ email });
  } catch (error) {
    return next(
      new HttpError("Opps, Login failed. Plese try again later", 500)
    );
  }

  if (!identifiedUser) {
    return next(new HttpError("Credential seems to be incorrect!", 401));
  }

  let isPasswordValid;
  try {
    isPasswordValid = await bycrypt.compare(password, identifiedUser.password);
  } catch (error) {
    return next(
      new HttpError("Opps, Login failed. Plese try again later", 500)
    );
  }

  if (isPasswordValid === false) {
    return next(new HttpError("Credential seems to be incorrect!", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: identifiedUser.id, email: identifiedUser.email },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token
  });
};

module.exports = {
  getUsers,
  signup,
  login,
};
