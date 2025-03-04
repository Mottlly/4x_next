const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// 🔹 Check Authentication Status (Frontend Calls This)
router.get("/", (req, res) => {
  const token = req.cookies?.auth_token;

  if (!token) return res.json({ isAuthenticated: false });

  try {
    const decoded = jwt.decode(token);
    res.json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
