require("dotenv").config({ path: ".env.local" });
const { auth } = require("express-openid-connect");

const authConfig = {
  authRequired: false, // Set to true to protect all routes unless specified
  auth0Logout: true, // Use Auth0's logout functionality
  secret: process.env.AUTH0_SECRET, // Secret stored in your .env
  baseURL: process.env.BASE_URL || "http://localhost:8081", // Backend URL
  clientID: process.env.AUTH0_CLIENT_ID, // Client ID from Auth0
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`, // Auth0 domain
};

module.exports = auth(authConfig); // 🚀 Export Auth0 middleware
