const mongoose = require("mongoose");
const User = require("./user");
const comments = require("./comments");

const postSchema = new mongoose.Schema({
  caption: {
    type: String,
  },
  images: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: comments,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
  ],
});

module.exports = mongoose.model("Post", postSchema);
