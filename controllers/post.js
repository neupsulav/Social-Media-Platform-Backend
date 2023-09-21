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
    return next(new ErrorHandler("Something went wrong", 400));
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
      select: "_id name username image commentContent createdAt",
    })
    .sort({ createdAt: -1 });

  if (!posts) {
    return next(new ErrorHandler("Something went wrong!", 400));
  }

  res.status(200).json(posts);
});

//comment on a post
const createComment = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post Id", 400));
  }
  const postId = req.params.id;

  const saveComment = await comments.create({
    image: req.user.userImage,
    username: req.user.username,
    name: req.user.name,
    commentContent: req.body.commentContent,
  });

  saveComment.save();

  const updatePost = await Post.findByIdAndUpdate(
    { _id: postId },
    { $push: { comments: saveComment._id } },
    { new: true }
  );

  if (!updatePost) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(201).json({ success: true });
});

// like and unlike a post
const likePost = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post ID", 404));
  }

  const postId = req.params.id;

  // check if user already liked the post
  const checkIfLiked = await Post.findOne({
    _id: postId,
    likes: req.user.userId,
  });

  if (!checkIfLiked) {
    // like a post
    const like = await Post.findByIdAndUpdate(
      { _id: postId },
      { $push: { likes: req.user.userId } },
      { new: true }
    );

    if (!like) {
      return next(new ErrorHandler("Something went wrong", 400));
    }

    res
      .status(200)
      .json({ msg: "Liked the post", likesCount: like.likes.length });
  } else {
    // preventing a user to like a post multiple times
    const preventMultipleLikes = await Post.findByIdAndUpdate(
      { _id: postId },
      { $pull: { likes: req.user.userId } },
      { new: true }
    );

    if (!preventMultipleLikes) {
      return next(new ErrorHandler("Something went wrong", 400));
    }

    res.status(200).json({
      msg: "Disliked the post",
      likesCount: preventMultipleLikes.likes.length,
    });
  }
});

// getting a single post
const getSinglePost = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post ID", 400));
  }
  const post = await Post.findOne({ _id: req.params.id })
    .populate({
      path: "createdBy",
      select: "_id name username image",
    })
    .populate({
      path: "comments",
      select: "_id name username image commentContent createdAt",
    });

  if (!post) {
    return next(
      new ErrorHandler(`Post with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).send(post);
});

// update a post
const updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const updatePost = await Post.findByIdAndUpdate({ _id: postId }, req.body, {
    new: true,
  });

  if (!updatePost) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(200).json({ msg: "Post updated" });
});

// Delete post
const deletePost = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid post ID", 400));
  }

  const postId = req.params.id;

  const deletePost = await Post.findByIdAndRemove({ _id: postId });

  if (!deletePost) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(200).json({ msg: "Post deleted" });
});

module.exports = {
  createPost,
  getPost,
  createComment,
  likePost,
  getSinglePost,
  updatePost,
  deletePost,
};
