const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const {
  userProfileData,
  followingList,
  followersList,
} = require("../controllers/userProfile");

// routes
router.get("/user/profile/:id", authentication, userProfileData);

router.get("/user/profile/following/:id", authentication, followingList);

router.get("/user/profile/followers/:id", authentication, followersList);

module.exports = router;
