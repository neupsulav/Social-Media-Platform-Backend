const catchAsync = require("./catchAsync");
const ErrorHandler = require("./errorHandler");
const jwt = require("jsonwebtoken");

// token authentication
const authentication = catchAsync(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ErrorHandler("Unauthorized access", 401));
  }

  const token = authorization.split(" ")[1];

  const payload = jwt.verify(token, process.env.secretKey);

  req.user = {
    userImage: payload.userImage,
    userId: payload.userId,
    name: payload.name,
    username: payload.username,
  };

  next();
});

module.exports = authentication;
