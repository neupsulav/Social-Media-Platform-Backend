const express = require("express");
const dotenv = require("dotenv");
const noRoute = require("./middlewares/noRoute");
const errorHandlerMiddleware = require("./middlewares/ErrorHandlerMiddleware");
const connectDabatase = require("./db/connect");
const authRouter = require("./routers/auth");
const postRouter = require("./routers/post");
const followRouter = require("./routers/follow");
const adminRouter = require("./routers/admin");
const usersRouter = require("./routers/users");
const emailVerificationRouter = require("./routers/emailVerification");
const profileRouter = require("./routers/profile");
const userProfileRouter = require("./routers/userProfile");

const app = express();
dotenv.config();
const port = process.env.port || 3000;

//routes
app.use(express.json());
app.use(
  "/public/uploads/userImages/",
  express.static("public/uploads/userImages")
);

app.use(
  "/public/uploads/postImages/",
  express.static("public/uploads/postImages")
);
app.use("/api/auth", authRouter);
app.use("/api/post", postRouter);
app.use("/api/user", followRouter);
app.use("/api/admin", adminRouter);
app.use("/api", usersRouter);
app.use("/api", emailVerificationRouter);
app.use("/api", profileRouter);
app.use("/api", userProfileRouter);

//error handler middleware
app.use(errorHandlerMiddleware);

//no route
app.use(noRoute);

//listen
const listen = async () => {
  await connectDabatase(process.env.connectionURL);

  app.listen(port, () => {
    console.log(`Connected to port no ${port}`);
  });
};

listen();
