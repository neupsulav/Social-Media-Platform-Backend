const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const { followOther, getRecommendations } = require("../controllers/follow");

// routes
router.patch("/follow/:id", authentication, followOther);

router.get("/recommendations", authentication, getRecommendations);

module.exports = router;
