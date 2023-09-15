const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");

//user registration
const userRegistration = catchAsync(async (req, res, next) => {
  const { name, username, email, password, cpassword } = req.body;

  if (!name || !username || !email || !password || !cpassword) {
    return next(new ErrorHandler("Please fill all the fields properly", 400));
  }

  if (password != cpassword) {
    return next(
      new ErrorHandler("Passwords doesn't match on both fields", 406)
    );
  }

  const newUser = await User.create(req.body);

  //   {
  //     name: req.body.name,
  //     username: req.body.username,
  //     email: req.body.email,
  //     password: req.body.password,
  //     cpassword: req.body.cpassword,

  //   }

  newUser.save();

  if (!newUser) {
    return next(
      new ErrorHandler("Something went wrong, User not created!", 500)
    );
  }

  res.status(201).json({ success: true, msg: "User created successfully" });
});

module.exports = { userRegistration };
