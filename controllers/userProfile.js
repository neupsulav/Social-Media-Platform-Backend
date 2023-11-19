const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");
const Post = require("../models/post");
const { default: mongoose, Error } = require("mongoose");

// to get any user's profile data
const userProfileData = catchAsync(async (req, res, next) => {
  // if (!mongoose.isValidObjectId(req.params.id)) {
  //   return next(new ErrorHandler("Invalid userId", 400));
  // }

  const userName = req.params.username;

  //   user's profile data
  const userProfileData = await User.findOne({ username: userName }).select(
    "_id name username email image followers following"
  );

  //   user's following and follow count
  const followersCount = userProfileData.followers.length;
  const followingCount = userProfileData.following.length;

  //   post posted by user if any
  const userPosts = await Post.find({ createdBy: userProfileData._id })
    .select("_id caption images likes comments createdAt createdBy")
    .populate({ path: "createdBy", select: "name username image -_id" })
    .populate({
      path: "comments",
      select: "_id name username image commentContent createdAt",
    })
    .sort({ createdAt: -1 });

  // to check if the user logged in is following this user
  let isFollowing = false;
  // userProfileData.followers.map((id) => {
  //   if (id === req.user.userId) {
  //     isFollowing = true;
  //   }
  // });
  if (userProfileData.followers.includes(req.user.userId)) {
    isFollowing = true;
  }

  // to check if user has not posted anything yet and send response accordingly
  // if (userPosts.length == 0) {
  //   res.status(200).json({
  //     userProfileData,
  //     followersCount,
  //     followingCount,
  //     posts: "User has not posted anything yet",
  //   });
  // } else {
  res.status(200).json({
    isFollowing,
    userProfileData,
    followersCount,
    followingCount,
    userPosts,
  });
  // }
});

// to get the list of people whom the user is following
const followingList = catchAsync(async (req, res, next) => {
  // if (!mongoose.isValidObjectId(req.params.id)) {
  //   return next(new ErrorHandler("Invalid userId", 400));
  // }

  const userName = req.params.username;

  //   to get the following list
  const followingList = await User.findOne({ username: userName }).populate({
    path: "following",
    select: "_id name username image",
  });

  // if (followingList.following.length == 0) {
  //   res.status(200).send("Currently user is not following anyone");
  // }

  res.status(200).json(followingList.following);
});

// to get the list of people who are following the user
const followersList = catchAsync(async (req, res, next) => {
  // if (!mongoose.isValidObjectId(req.params.id)) {
  //   return next(new ErrorHandler("Invalid userId", 400));
  // }

  const userName = req.params.username;

  //   to get the followers list
  const followersList = await User.findOne({ username: userName }).populate({
    path: "followers",
    select: "_id name username image",
  });

  // if (followersList.followers.length == 0) {
  //   res.status(200).send("Currently no one is following the user");
  // }

  res.status(200).json(followersList.followers);
});

module.exports = { userProfileData, followingList, followersList };
