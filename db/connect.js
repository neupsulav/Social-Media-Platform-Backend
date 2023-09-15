const mongoose = require("mongoose");

const connectDabatase = async (connectionUrl) => {
  return mongoose
    .connect(connectionUrl)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDabatase;
