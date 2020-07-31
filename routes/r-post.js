var express = require("express");
var router = express.Router();
var postController = require("../controllers/con-post");
var verification = require("../middleware/verification");

router.post("/createPost", verification, postController.addPost);

router.get("/allPost", verification, postController.allPost);

router.get("/myPost", verification, postController.myPost);

module.exports = router;
