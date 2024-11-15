const HttpError = require("../models/http-error");
const user = require("../models/user");
const User = require("../models/user");
const { validationResult } = require("express-validator");

DUMMY_USERS = [
  {
    id: "u1",
    name: "Yusuf Axmad",
    email: "yahmedov64@gmail.com",
    password: "qwerty1221",
  },
];

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, ["-password", "-email", "-__v"]);
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

  const { name, email, password, places } = req.body;

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

  const newUser = new User({
    name,
    email,
    password,
    image: "https://avatars.githubusercontent.com/u/88669256?v=4",
    places: "Makka, Madina, Quddus, Margilan",
  });

  try {
    await newUser.save();
  } catch (error) {
    console.log(error);
    return next(
      new HttpError("Signing up failed. Please try again later", 500)
    );
  }

  res.status(201).json(newUser);
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

  if (!identifiedUser || identifiedUser.password !== password) {
    return next(new HttpError("Credential seems to be incorrect!", 401));
  }

  res.status(200).json({user: identifiedUser});
};

module.exports = {
  getUsers,
  signup,
  login,
};
