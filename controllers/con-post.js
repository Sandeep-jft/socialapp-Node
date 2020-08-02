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
      .sort({ _id: -1 })
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
    const { _id } = req.body;
    console.log(req.body._id);
    Post.findByIdAndUpdate(
      _id,
      {
        $push: { likes: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        console.log("err ", err);
        return res.json({ error: "Can't like the post now" });
      } else {
        console.log("Output  ", result);
        return res.json(result);
      }
    });
  },
  unlikePost: (req, res) => {
    const { _id } = req.body;
    console.log(_id);
    Post.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: req.user._id },
      },
      { new: true, useFindAndModify: false }
    ).exec((err, result) => {
      if (err) {
        return res.json({ error: "Can't dislike the post now" });
      } else {
        console.log("The result  ", result);
        return res.json(result);
      }
    });
  },
};
