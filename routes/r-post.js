var express = require("express");
var router = express.Router();
var postController = require("../controllers/con-post");
var verification = require("../middleware/verification");

router.post("/createPost", verification, postController.addPost);

router.get("/allPost", verification, postController.allPost);

router.get("/myPost", verification, postController.myPost);

router.put("/likePost", verification, postController.likePost);

router.put("unlikePost", verification, postController.unlikePost);

module.exports = router;
