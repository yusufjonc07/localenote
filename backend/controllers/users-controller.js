const uuid = require("uuid");
const HttpError = require("../models/http-error");

DUMMY_USERS = [
  {
    id: "u1",
    name: "Yusuf Axmad",
    email: "yahmedov64@gmail.com",
    password: "qwerty1221",
  },
];

const getUsers = (req, res) => {
  res.json({ users: DUMMY_USERS });
};
const signup = (req, res) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError(
      "User with this email exists. Please use another email or login",
      409
    );
  }

  const newUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);

  res.status(201).json(newUser);
};
const login = (req, res) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Credential seems to be incorrect!", 401);
  }

  res.status(200).send("Login successfull");
};

module.exports = {
  getUsers,
  signup,
  login,
};
