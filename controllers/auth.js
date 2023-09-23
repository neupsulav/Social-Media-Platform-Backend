const User = require("../models/user");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const { sendVerificationMail } = require("./emailVerification");

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

  //for saving user's image in database
  const file = req.file;
  if (!file) {
    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
    });
    newUser.save();

    if (!newUser) {
      return next(
        new ErrorHandler("Something went wrong, User not created!", 500)
      );
    }

    // send verification mail
    sendVerificationMail(req.body.name, req.body.email, newUser._id);
  } else {
    const filename = file.filename;
    const basepath = `${req.protocol}://${req.get(
      "host"
    )}/public/uploads/userImages/`;

    const newUser = await User.create({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
      image: `${basepath}${filename}`,
    });

    newUser.save();

    if (!newUser) {
      return next(
        new ErrorHandler("Something went wrong, User not created!", 500)
      );
    }

    // send verification mail
    sendVerificationMail(req.body.name, req.body.email, newUser._id);
  }

  res.status(201).json({
    success: true,
    msg: "An email has been sent. Please verify your account.",
  });
});

//user login
const userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill all the credentials", 400));
  }

  //email verification
  const isEmailFound = await User.findOne({ email: email });

  if (!isEmailFound) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  if (!isEmailFound.isVerified) {
    return next(
      new ErrorHandler("Email is not verified. Please verify your email", 401)
    );
  }

  // comparing hashed password
  const comparePassword = await isEmailFound.comparePassword(password);

  if (!comparePassword) {
    return next(new ErrorHandler("Invalid user credentials", 401));
  }

  const token = await isEmailFound.getJwt();

  res.status(200).json({ msg: "Logged in successfully", token: token });
});

module.exports = { userRegistration, userLogin };
