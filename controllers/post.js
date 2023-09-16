const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");

//creating post
const createPost = catchAsync(async (req, res, next) => {
  const files = req.files;
  let imagePaths = [];
  const basepath = `${req.protocol}://${req.get(
    "host"
  )}/public/uploads/postImages/`;

  if (files) {
    files.map((file) => {
      imagePaths.push(`${basepath}${file.filename}`);
    });
  }

  const post = await Post.create({
    caption: req.body.caption,
    images: imagePaths,
  });

  post.save();

  if (!post) {
    return next(new ErrorHandler("Something went wrong", 500));
  }

  res.status(201).json({ msg: "Post created" });
});

module.exports = { createPost };
