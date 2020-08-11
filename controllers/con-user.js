const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
  "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"
);

module.exports = {
  userProfile: (req, res) => {
    User.findOne({ _id: req.params.id })
      .select("-password")
      .then((user) => {
        Post.find({ postedBy: req.params.id })
          .populate("postedBy", "_id name")
          .exec((err, post) => {
            if (err) {
              return res.json({ error: err });
            } else {
              console.log("The user is ", user, " Post : ", post);
              return res.json({ user, post });
            }
          });
      })
      .catch((err) => {
        console.log("Error ", err);
      });
  },

  follow: (req, res) => {
    User.findByIdAndUpdate(
      req.body.followID,
      {
        $push: { followers: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followID },
        },
        { new: true }
      )
        .select("-password")
        .then((resp) => {
          console.log("The user updated following list is ", resp);
          res.json(resp);
        })
        .catch((err) => {
          console.log("Error : ", err);
        });
    });
  },
  unfollow: (req, res) => {
    User.findByIdAndUpdate(
      req.body.unfollowID,
      {
        $pull: { followers: req.user._id },
      },
      { new: true }
    ).exec((err, result) => {
      if (err) {
        return res.json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowID },
        },
        { new: true }
      )
        .select("-password")
        .then((resp) => {
          console.log("The user updated following list is ", resp);
          res.json(resp);
        })
        .catch((err) => {
          console.log("Error : ", err);
        });
    });
  },
};
