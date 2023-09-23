const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");
const Post = require("../models/post");
const { default: mongoose, Error } = require("mongoose");

// to get any user's profile data
const userProfileData = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid userId", 400));
  }

  const userId = req.params.id;

  //   user's profile data
  const userProfileData = await User.findById({ _id: userId }).select(
    "-_id name username email image followers following"
  );

  //   user's following and follow count
  const followersCount = userProfileData.followers.length;
  const followingCount = userProfileData.following.length;

  //   post posted by user if any
  const userPosts = await Post.find({ createdBy: userId })
    .select("-_id caption images likes comments createdAt createdBy")
    .populate({ path: "createdBy", select: "name username image -_id" })
    .populate({
      path: "comments",
      select: "-_id name username image commentContent createdAt",
    });

  // to check if user has not posted anything yet and send response accordingly
  if (userPosts.length == 0) {
    res.status(200).json({
      userProfileData,
      followersCount,
      followingCount,
      posts: "User has not posted anything yet",
    });
  } else {
    res.status(200).json({
      userProfileData,
      followersCount,
      followingCount,
      userPosts,
    });
  }
});

// to get the list of people whom the user is following
const followingList = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid userId", 400));
  }

  const userId = req.params.id;

  //   to get the following list
  const followingList = await User.findById({ _id: userId }).populate({
    path: "following",
    select: "_id name username image",
  });

  if (followingList.following.length == 0) {
    res.status(200).send("Currently user is not following anyone");
  }

  res.status(200).json({ list: followingList.following });
});

// to get the list of people who are following the user
const followersList = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid userId", 400));
  }

  const userId = req.params.id;

  //   to get the followers list
  const followersList = await User.findById({ _id: userId }).populate({
    path: "followers",
    select: "_id name username image",
  });

  if (followersList.followers.length == 0) {
    res.status(200).send("Currently no one is following the user");
  }

  res.status(200).json({ list: followersList.followers });
});

module.exports = { userProfileData, followingList, followersList };
