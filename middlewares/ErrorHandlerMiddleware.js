const errorHandlerMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal server error";
  err.statusCode = err.statusCode || 500;

  if (err.code == 11000) {
    return res
      .status(403)
      .json({ status: "Error", msg: "User already exists" });
  }

  res.status(err.statusCode).json({
    msg: err.message,
  });
};

module.exports = errorHandlerMiddleware;
