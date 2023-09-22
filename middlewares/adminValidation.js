const catchAsync = require("./catchAsync");
const ErrorHandler = require("./errorHandler");
const User = require("../models/user");

// check if user is Admin
const adminValidation = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;

  const checkAdmin = await User.findOne({ _id: userId, isAdmin: true });

  if (!checkAdmin) {
    return next(new ErrorHandler("Unauthorized access", 400));
  }

  next();
});

module.exports = adminValidation;
