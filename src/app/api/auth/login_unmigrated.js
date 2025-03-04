require("dotenv").config({ path: ".env.local" });
const express = require("express");
const router = express.Router();

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const BACKEND_CALLBACK_URI = "http://localhost:8081/callback"; // Backend callback

router.get("/", (req, res) => {
  console.log("🔹 /login route was hit!");

  const authUrl = `https://${AUTH0_DOMAIN}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid profile email`;

  console.log("🔹 Redirecting user to Auth0:", authUrl);

  res.redirect(authUrl);
});

module.exports = router;
