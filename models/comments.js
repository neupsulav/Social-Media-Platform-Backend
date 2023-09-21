const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  name: {
    type: String,
  },
  commentContent: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("comments", commentSchema);
