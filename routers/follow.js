const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");

const followOther = require("../controllers/follow");

// routes
router.patch("/follow/:id", authentication, followOther);

module.exports = router;
