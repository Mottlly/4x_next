const express = require("express");
const { checkJwt } = require("../../middleware/checkJwt");

const router = express.Router();

// Public route
router.get("/", (req, res) => {
  res.send("Public API: No authentication needed.");
});

// 🔐 Protected route - Requires valid Auth0 token
router.get("/protected", checkJwt, (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.auth });
});

module.exports = router;
