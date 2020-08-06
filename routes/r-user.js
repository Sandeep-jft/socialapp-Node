var express = require("express");
var router = express.Router();
var profileController = require("../controllers/con-user");
var verification = require("../middleware/verification");

router.get("/userProfile/:id", verification, profileController.userProfile);

router.put("/follow", verification, profileController.follow);

router.put("/unfollow", verification, profileController.unfollow);

module.exports = router;
