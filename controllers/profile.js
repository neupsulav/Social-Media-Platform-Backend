const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");
const Post = require("../models/post");

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

module.exports = { selfProfileData };
