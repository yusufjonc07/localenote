const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  let token, tokenData;
  try {
    token = req.headers.authorzation.split(" ")[1];
    tokenData = jwt.verify(token, "allohu_akbar_lailaha_illalloh");
    req.userData = { id: tokenData.userId };
  } catch (error) {
    return next(new HttpError("Authorization failed"));
  }

  return next();
};
