const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  commentContent: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comments", commentSchema);
