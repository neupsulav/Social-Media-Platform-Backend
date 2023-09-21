const { default: mongoose } = require("mongoose");
const catchAsync = require("./catchAsync");
const ErrorHandler = require("./errorHandler");
const post = require("../models/post");

const ownerValidation = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ErrorHandler("Invalid Post ID", 400));
  }

  const isOwner = await post.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });

  if (!isOwner) {
    return next(new ErrorHandler("Unauthorized access", 401));
  } else {
    next();
  }
});

module.exports = ownerValidation;
