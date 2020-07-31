const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = {
  addPost: (req, res) => {
    const { title, body, photo } = JSON.parse(req.body.data);
    console.log("The post data is ", req.body.data, "***", title, body, photo);
    if (!title || !body || !photo) {
      return res.json({ error: "Please add title and body text" });
    }
    const createPost = new Post({
      title,
      body,
      photo,
      postedBy: req.user,
    });

    createPost
      .save()
      .then((createdPost) => {
        res.json({ post: createdPost, message: "Post added successfully" });
      })
      .catch((err) => {
        console.log("Err ", err);
      });
  },

  allPost: (req, res) => {
    Post.find()
      .populate("postedBy", "_id name")
      .then((allpost) => {
        res.json({ allpost });
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  },

  myPost: (req, res) => {
    console.log("reached");
    Post.find({ postedBy: req.user._id })
      .populate("postedBy")
      .then((mypost) => {
        res.json({ mypost });
      });
  },
};
