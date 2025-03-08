import "dotenv/config";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ Load environment variables
const AUTH0_DOMAIN = process.env.AUTH0_ISSUER_BASE_URL;
const CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET; // ✅ Correct Secret
const REDIRECT_URI = process.env.AUTH0_CALLBACK_URL; // ✅ Fixed Redirect URL
const FRONTEND_URL = process.env.AUTH0_BASE_URL; // ✅ Use AUTH0_BASE_URL (Your Frontend)

export async function GET(req) {
  console.log("🔹 Received authentication request");

  // ✅ Get the authorization code from URL parameters
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    console.error("❌ No authorization code provided");
    return NextResponse.json(
      { error: "No authorization code provided" },
      { status: 400 }
    );
  }

  try {
    // ✅ Step 1: Exchange Authorization Code for Token
    console.log("🔹 Exchanging authorization code for token...");
    const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET, // ✅ Correct Secret Used
        code,
        redirect_uri: REDIRECT_URI, // ✅ Fixed redirect
        scope: "openid profile email", // ✅ Ensure Auth0 returns user data
      }),
    });

    if (!tokenResponse.ok) {
      console.error(
        `❌ Auth0 token request failed with status ${tokenResponse.status}`
      );
      return NextResponse.json(
        { error: "Failed to get token from Auth0" },
        { status: tokenResponse.status }
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, id_token } = tokenData;

    // ✅ Ensure we got tokens
    if (!access_token || !id_token) {
      console.error("❌ Auth0 response missing required tokens:", tokenData);
      return NextResponse.json(
        { error: "Auth0 response missing tokens" },
        { status: 500 }
      );
    }

    // ✅ Step 2: Decode ID Token to Get User Info
    const decodedToken = jwt.decode(id_token);
    if (!decodedToken) {
      console.error("❌ Failed to decode token");
      return NextResponse.json(
        { error: "Invalid token received" },
        { status: 400 }
      );
    }

    console.log("✅ Successfully authenticated user:", decodedToken);

    // ✅ Step 3: Set Session Cookie (Improved security)
    const response = NextResponse.redirect(FRONTEND_URL);
    response.cookies.set("auth_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ✅ Secure in production
      sameSite: "Lax",
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("❌ Error during Auth0 authentication:", error.message);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
