const express = require("express");
const router = express.Router();

const { getAllUsers } = require("../controllers/admin");
const authentication = require("../middlewares/authentication");
const adminValidation = require("../middlewares/adminValidation");

// routes
router.get("/allusers", authentication, adminValidation, getAllUsers);

module.exports = router;
