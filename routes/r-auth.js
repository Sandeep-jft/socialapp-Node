var express = require("express");
var router = express.Router();
var authController = require("../controllers/con-auth");
var verification = require("../middleware/verification");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

module.exports = router;
