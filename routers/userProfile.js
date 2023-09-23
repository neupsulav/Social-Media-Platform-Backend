const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { userProfileData } = require("../controllers/userProfile");

// routes
router.get("/user/profile/:id", authentication, userProfileData);

module.exports = router;
