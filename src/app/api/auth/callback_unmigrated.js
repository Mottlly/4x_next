require("dotenv").config({ path: ".env.local" });
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");

const router = express.Router();

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_SECRET;
const REDIRECT_URI = "http://localhost:8081/callback";
const FRONTEND_URL = "http://localhost:5173/";

router.use(cookieParser());

// 🔹 Handle Auth0 Callback & Authenticate User
router.get("/", async (req, res) => {
  console.log("🔹 Received authentication request");
  const { code } = req.query;

  if (!code) {
    console.error("❌ No authorization code provided");
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    // Step 1: Exchange Authorization Code for Token
    console.log("🔹 Exchanging authorization code for token...");
    //const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
    //method: "POST",
    //headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // body: new URLSearchParams({
    // grant_type: "authorization_code",
    //client_id: CLIENT_ID,
    // client_secret: CLIENT_SECRET,
    // code,
    //  redirect_uri: REDIRECT_URI,
    //  }),
    // });

    if (!tokenResponse.ok) {
      throw new Error(
        `Auth0 token request failed with status ${tokenResponse.status}`
      );
    }

    const { access_token, id_token } = await tokenResponse.json();

    // Step 2: Decode ID Token to Get User Info
    const decodedToken = jwt.decode(id_token);
    if (!decodedToken) {
      console.error("❌ Failed to decode token");
      return res.status(400).json({ error: "Invalid token received" });
    }

    console.log("✅ Successfully authenticated user:", decodedToken);

    // Step 3: Set Session Cookie
    // res.cookie("auth_token", access_token, {
    // httpOnly: true,
    //  secure: false, // Set to true in production (HTTPS)
    //  sameSite: "Lax",
    // });

    // Step 4: Redirect User to Frontend
    console.log("🔹 Redirecting user to frontend...");
    //return res.redirect(FRONTEND_URL);
  } catch (error) {
    console.error("❌ Error during Auth0 authentication:", error.message);
    return res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = router;
