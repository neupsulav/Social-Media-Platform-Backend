const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");

// get every users
const getEveryUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select("-password -cpassword");

  if (!users) {
    return next(new ErrorHandler("Something went wrong", 400));
  }

  res.status(200).send(users);
});

module.exports = { getEveryUsers };
