import "dotenv/config";
import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = handleAuth(); // ✅ Auth0 automatically handles authentication
