import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Load environment variables
const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
const CLIENT_SECRET = process.env.AUTH0_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI; // Matches frontend redirect
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL; // Ensure this is set

export async function GET(req) {
  console.log("🔹 Received authentication request");

  // Get the authorization code from the request
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
    // Step 1: Exchange Authorization Code for Token
    console.log("🔹 Exchanging authorization code for token...");
    const tokenResponse = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

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
      return NextResponse.json(
        { error: "Invalid token received" },
        { status: 400 }
      );
    }

    console.log("✅ Successfully authenticated user:", decodedToken);

    // Step 3: Set Session Cookie
    const response = NextResponse.redirect(FRONTEND_URL);
    response.cookies.set("auth_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Lax",
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
