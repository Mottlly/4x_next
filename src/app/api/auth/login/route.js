import "dotenv/config";

const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
const CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI; // Frontend callback

export async function GET(req) {
  console.log("🔹 /api/login route was hit!");

  const authUrl = `https://${AUTH0_DOMAIN}/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid profile email`;

  console.log("🔹 Redirecting user to Auth0:", authUrl);

  return Response.redirect(authUrl);
}
