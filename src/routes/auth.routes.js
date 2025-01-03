const express = require("express");
const { registerUser, loginUser, refreshAccessToken } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", registerUser); // Add this line
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
