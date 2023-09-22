const { default: mongoose } = require("mongoose");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");

const followOther = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid UserID", 400));
  }
  const userId = req.params.id;

  // to follow someone
  // check if already followed
  const ifAlreadyFollowing = await User.find({
    _id: req.user.userId,
    following: userId,
  });

  if (!ifAlreadyFollowing) {
    //   update our following list
    const updateFollowing = await User.findByIdAndUpdate(
      {
        _id: req.user.userId,
      },
      { $push: { following: userId } },
      { new: true }
    );

    //   update others followers list
    const updateFollowers = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { followers: req.user.userId } },
      { new: true }
    );
    res.status(200).json({ msg: "User followed" });
  } else {
    const updateFollowing = await User.findByIdAndUpdate(
      {
        _id: req.user.userId,
      },
      { $pull: { following: userId } },
      { new: true }
    );

    //   update others followers list
    const updateFollowers = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { followers: req.user.userId } },
      { new: true }
    );
    res.status(200).json({ msg: "User unfollowed" });
  }
});

module.exports = followOther;
