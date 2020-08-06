const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../keys");

module.exports = {
  signup: (req, res) => {
    const { name, email, password, confirmPassword, pic } = JSON.parse(
      req.body.data
    );
    console.log(
      "check ",
      password,
      confirmPassword,
      name,
      email,
      " Body ",
      JSON.parse(req.body.data)
    );
    if (!name || !email || !password || !confirmPassword) {
      return res.status(201).json({ error: "All fields are mandatory" });
    }

    User.findOne({ email })
      .then((foundUser) => {
        if (foundUser) {
          return res.status(201).json({ error: "Email is already registered" });
        }
        if (password !== confirmPassword) {
          return res
            .status(201)
            .json({ error: "Please enter correct password" });
        }

        const createUser = new User({
          email,
          name,
          password,
          pic,
        });

        createUser
          .save()
          .then((user) => {
            return res.json({ message: "User has been created successfully" });
          })
          .catch((err) => {
            console.log("Error : ", err);
          });
      })
      .catch((err) => {
        console.log("Err : ", err);
      });
    //   res.json({ msg: `Hello ${req.body.name}` });
  },

  login: (req, res) => {
    const { email, password } = JSON.parse(req.body.data);
    console.log("account details are ", email, password, SECRET_KEY);
    User.findOne({ email })
      .then((foundUser) => {
        if (foundUser) {
          bcryptjs
            .compare(password, foundUser.password)
            .then((authenticated) => {
              if (authenticated) {
                const token = jwt.sign({ _id: foundUser._id }, SECRET_KEY);
                const {
                  _id,
                  name,
                  email,
                  followers,
                  following,
                  pic,
                } = foundUser;
                return res.json({
                  token,
                  user: { _id, name, email, followers, following, pic },
                  message: "Signed in successfully",
                });
              } else {
                return res.json({
                  error: "Your email or password is incorrect",
                });
              }
            })
            .catch((err) => {
              console.log((err) => console.log("Error : ", err));
            });
        } else
          return res.json({ error: "Your email or password is incorrect" });
      })
      .catch((err) => {
        console.log((err) => console.log("Error : ", err));
      });
  },
  protected: (req, res) => {
    res.json({
      Details: `Hello ${req.user.name} your details are ${req.user}`,
    });
  },
};
