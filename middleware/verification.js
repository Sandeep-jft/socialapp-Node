const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log("The header is ", authorization);

  if (!authorization) {
    return res.status(201).json({ error: "User must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(201).json({ error: "User must be logged in" });
    }
    const { _id } = payload;
    User.findById(_id).then((getUserDetails) => {
      getUserDetails.password = undefined;
      req.user = getUserDetails;
      next();
    });
    // next();
  });
};
