const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  let token, tokenData;
  try {
    token = req.headers.authorization.split(" ")[1];
    tokenData = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { id: tokenData.userId };
  } catch (error) {
    console.log(error.message);

    return next(new HttpError("Authorization failed"));
  }

  return next();
};
