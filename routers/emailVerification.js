const express = require("express");
const router = express.Router();

const { emailVerification } = require("../controllers/emailVerification");

//routes
router.get("/verify/:id", emailVerification);

module.exports = router;
