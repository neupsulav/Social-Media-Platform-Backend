const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  selfProfileData,
  followingList,
  followersList,
} = require("../controllers/profile");

// routes
router.get("/profile", authentication, selfProfileData);

router.get("/profile/following", authentication, followingList);

router.get("/profile/followers", authentication, followersList);

module.exports = router;
