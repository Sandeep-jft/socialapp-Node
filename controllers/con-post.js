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
      .populate("comments.postedBy", "_id name")
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
        console.log("My post are ", mypost);
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
  comments: (req, res) => {
    const comment = {
      text: req.body.text,
      postedBy: req.user._id,
    };
    console.log("The comments are ", comment);
    Post.findByIdAndUpdate(
      req.body._id,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec((err, result) => {
        if (err) {
          console.log("err ", err);
          return res.json({ error: "Can't like the post now" });
        } else {
          console.log("Output  ", result);
          return res.json(result);
        }
      });
  },
  deletePost: (req, res) => {
    const _id = req.params.postId;
    console.log("The deleted post id is ", _id);

    Post.findOne({ _id: _id })
      .populate("postedBy", "_id")
      .exec((err, post) => {
        if (err || !post) {
          return res.json({ error: err });
        }
        if (post.postedBy._id.toString() === req.user._id.toString()) {
          post
            .remove()
            .then((result) => {
              return res.json(result);
            })
            .catch((err) => {
              return res.json({ error: err });
            });
        }
      });
  },
  deleteComment: (req, res) => {
    const _id = req.params.postId;
    const commentId = req.params.commentID;
    console.log("The deleted comment id is ", _id, "****", commentId);

    Post.findByIdAndUpdate(
      _id,
      {
        $pull: { comments: { _id: commentId } },
      },
      { new: true, useFindAndModify: false }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name")
      .exec((err, result) => {
        if (err) {
          return res.json({ error: "Can't dislike the post now" });
        } else {
          console.log("The result  ", result);
          return res.json(result);
        }
      });
  },

  followingPost: (req, res) => {
    console.log("The user is ", req.user);
    Post.find({ postedBy: { $in: req.user.following } })
      .sort({ _id: -1 })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .then((allpost) => {
        res.json({ allpost });
      })
      .catch((err) => {
        console.log("Error : ", err);
      });
  },
};
