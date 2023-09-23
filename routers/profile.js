const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { selfProfileData } = require("../controllers/profile");

// routes
router.get("/profile", authentication, selfProfileData);

module.exports = router;
