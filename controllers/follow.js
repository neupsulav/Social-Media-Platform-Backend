const { default: mongoose } = require("mongoose");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");

const followOther = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid UserID", 400));
  }
  const usersId = req.params.id;

  // to follow someone
  // check if already followed
  const ifAlreadyFollowing = await User.findOne({
    _id: req.user.userId,
    following: usersId,
  });

  if (!ifAlreadyFollowing) {
    //   update our following list
    const updateFollowing = await User.findByIdAndUpdate(
      {
        _id: req.user.userId,
      },
      { $push: { following: usersId } },
      { new: true }
    );

    //   update others followers list
    const updateFollowers = await User.findByIdAndUpdate(
      { _id: usersId },
      { $push: { followers: req.user.userId } },
      { new: true }
    );
    res.status(200).json({ msg: "User followed" });
  } else {
    const updateFollowing = await User.findByIdAndUpdate(
      {
        _id: req.user.userId,
      },
      { $pull: { following: usersId } },
      { new: true }
    );

    //   update others followers list
    const updateFollowers = await User.findByIdAndUpdate(
      { _id: usersId },
      { $pull: { followers: req.user.userId } },
      { new: true }
    );
    res.status(200).json({ msg: "User unfollowed" });
  }
});

// get people as recommendations to follow
const getRecommendations = catchAsync(async (req, res, next) => {
  // const selfProfile = await User.findById({ _id: req.user.userId });
  // const people = await User.find({ followers: selfProfile.following });
  // const list = [];
  // const peopleList = people.map((person, index) => {
  //   if (person._id !== req.user.userId) {
  //     list[index] = person._id;
  //   }
  // });
  // res.status(200).send(list);
  // const selfProfile = await User.findById({ _id: req.user.userId });
  // const people = await User.find({ followers: selfProfile.following });
  // let list = [];
  // selfProfile.following.map(async (person) => {
  //   const user = await User.findById({ _id: person });
  //   user.following.map((item) => {
  //     list.push(item);
  //   });
  // });
  // const peopleList = await User.find({ _id: list });
  // res.status(200).send(peopleList);
  // res.status(200).send(people);
  // const people = await User.find({}).sort({ createdAt: -1 });
  // res.status(200).send(people);
});

module.exports = { followOther, getRecommendations };
