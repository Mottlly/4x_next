const express = require("express");

const router = express.Router();
const FRONTEND_URL = "http://localhost:5173";

// 🔹 Logout Route (Clears Auth Token)
router.get("/", (req, res) => {
  res.clearCookie("auth_token");
  res.redirect(FRONTEND_URL);
});

module.exports = router;
