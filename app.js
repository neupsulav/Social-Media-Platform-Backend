const express = require("express");
const dotenv = require("dotenv");
const noRoute = require("./middlewares/noRoute");
const errorHandlerMiddleware = require("./middlewares/ErrorHandlerMiddleware");
const connectDabatase = require("./db/connect");
const authRouter = require("./routers/auth");

const app = express();
dotenv.config();
const port = process.env.port || 3000;

//routes
app.use(express.json());
app.use("/api/auth", authRouter);

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
