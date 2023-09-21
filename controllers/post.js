const Post = require("../models/post");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const comments = require("../models/comments");
const { default: mongoose } = require("mongoose");

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
    .populate({
      path: "comments",
      select: "_id name username image commentcontent createdAt",
    })
    .sort({ createdAt: -1 });

  if (!posts) {
    return next(new ErrorHandler("Something went wrong!", 404));
  }

  res.status(200).json(posts);
});

//comment on a post
const createComment = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post Id", 400));
  }
  const postId = req.params.id;
  const commentContent = req.body.commentContent;

  const saveComment = await comments.create({
    image: req.user.userImage,
    username: req.user.username,
    name: req.user.name,
    commentContent: commentContent,
  });

  saveComment.save();

  const updatePost = await Post.findByIdAndUpdate(
    { _id: postId },
    { $push: { comments: saveComment._id } },
    { new: true }
  );

  if (!updatePost) {
    return next(new ErrorHandler("Something went wrong", 404));
  }

  res.status(201).json({ success: true });
});

module.exports = { createPost, getPost, createComment };
