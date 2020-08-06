const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs"),
  SALT_WORK_FACTOR = 12;
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/sandeep32/image/upload/v1596626739/profile_x7vnm4.webp",
  },
});

userSchema.pre("save", function (next) {
  var user = this;

  // hash the password using our new salt
  bcryptjs.hash(user.password, SALT_WORK_FACTOR, function (err, hash) {
    if (err) return next(err);

    // override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

mongoose.model("User", userSchema);
