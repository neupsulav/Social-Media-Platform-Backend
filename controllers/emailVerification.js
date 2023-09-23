const nodemailer = require("nodemailer");
const catchAsync = require("../middlewares/catchAsync");
const ErrorHandler = require("../middlewares/errorHandler");
const User = require("../models/user");

// email generation
const sendVerificationMail = catchAsync(async (name, email, userid) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "For verification",
    html: `<p>Hi ${name},</p> please click <a href='http://localhost:3000/api/verify/${userid}'>here</a> to verify your account`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email has been sent:", info.response);
    }
  });
});

//   email verification
const emailVerification = catchAsync(async (req, res, next) => {
  const updateInfo = await User.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { isVerified: true } }
  );
  res
    .status(200)
    .send("Your email has been verified. You can now login to your account.");
});

module.exports = { sendVerificationMail, emailVerification };
