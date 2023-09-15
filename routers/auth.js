const express = require("express");
const router = express.Router();

const { userRegistration } = require("../controllers/auth");

//routes
router.post("/register", userRegistration);

module.exports = router;
