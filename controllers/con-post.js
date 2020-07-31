const mongoose = require("mongoose");
const Post = mongoose.model("Post");

module.exports = {
  addPost: (req, res) => {
    const { title, body, photo } = JSON.parse(req.body.data);
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
    Post.find({ postedBy: req.user._id })
      .populate("postedBy")
      .then((mypost) => {
        res.json({ mypost });
      });
  },

  likePost: (req, res) => {
    const { _id } = JSON.parse(req.body._id);
    console.log("The like id is ", _id);
    Post.findByIdAndUpdate(
      _id,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.json({ error: "Can't like the post now" });
      } else {
        return res.json(result);
      }
    });
  },
  unlikePost: (req, res) => {
    const { _id } = JSON.parse(req.body._id);
    console.log("The dislike id is ", _id);
    Post.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.json({ error: "Can't dislike the post now" });
      } else {
        return res.json(result);
      }
    });
  },
};
