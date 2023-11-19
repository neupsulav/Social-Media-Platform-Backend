const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  userProfileData,
  followingList,
  followersList,
} = require("../controllers/userProfile");

// routes
router.get("/user/profile/:username", authentication, userProfileData);

router.get("/user/profile/following/:username", authentication, followingList);

router.get("/user/profile/followers/:username", authentication, followersList);

module.exports = router;
