const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");

//creating post
const createPost = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;
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
    createdBy: userId,
  });

  post.save();

  if (!post) {
    return next(new ErrorHandler("Something went wrong", 500));
  }

  res.status(201).json({ msg: "Post created" });
});

//get posts
const getPost = catchAsync(async (req, res, next) => {
  const posts = await Post.find({})
    .populate({
      path: "createdBy",
      select: "_id name username image",
    })
    .sort({ createdAt: -1 });

  if (!posts) {
    return next(new ErrorHandler("Something went wrong!", 404));
  }

  res.status(200).json(posts);
});

//comment on a post

module.exports = { createPost, getPost };
