var express = require("express");
var router = express.Router();
var authController = require("../controllers/con-auth");
var verification = require("../middleware/verification");

router.get("/", (req, res) => {
  res.json({ msg: "Hello this is home page" });
});

router.get("/protected", verification, authController.protected);

router.post("/signup", authController.signup);

router.post("/login", authController.login);

module.exports = router;
