const express = require("express");
const router = express.Router();

const { getEveryUsers } = require("../controllers/users");
const authentication = require("../middlewares/authentication");

// routes
router.get("/users", authentication, getEveryUsers);

module.exports = router;
