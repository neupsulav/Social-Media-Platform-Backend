const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");
const Post = require("../models/post");

// to get our profile data
const selfProfileData = catchAsync(async (req, res, next) => {
  const profileData = await User.findById({ _id: req.user.userId }).select(
    "-_id name username email image followers following"
  );

  const followersCount = profileData.followers.length;
  const followingCount = profileData.following.length;

  const userPosts = await Post.find({ createdBy: req.user.userId })
    .select("-_id caption images likes comments createdAt createdBy")
    .populate({ path: "createdBy", select: "name username image -_id" })
    .populate({
      path: "comments",
      select: "-_id name username image commentContent createdAt",
    });

  res
    .status(200)
    .json({ profileData, userPosts, followersCount, followingCount });
});

// to get the users whom we are following
const followingList = catchAsync(async (req, res, next) => {
  const followingList = await User.findById({ _id: req.user.userId }).populate({
    path: "following",
    select: "_id name username image",
  });

  if (followingList.following.length == 0) {
    res.status(200).send("Currently you are not following any users");
  }

  res.status(200).json({ list: followingList.following });
});

// to get the users who are following us
const followersList = catchAsync(async (req, res, next) => {
  const followersList = await User.findById({ _id: req.user.userId }).populate({
    path: "followers",
    select: "_id name username image",
  });

  if (followersList.followers.length == 0) {
    res.status(200).send("Currently you are not being followed by anyone");
  }

  res.status(200).json({ list: followersList.followers });
});

module.exports = { selfProfileData, followingList, followersList };
