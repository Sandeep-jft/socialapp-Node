const mongoose = require("mongoose");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

module.exports = {
  userProfile: (req, res) => {
    User.findOne({ _id: req.params.id })
      .select("-password")
      .then((user) => {
        Post.findOne({ postedBy: req.params.id })
          .populate("postedBy", "_id name")
          .exec((err, post) => {
            if (err) {
              return res.json({ error: err });
            } else {
              return res.json({ user, post });
            }
          });
      })
      .catch((err) => {
        console.log("Error ", err);
      });
  },
};
