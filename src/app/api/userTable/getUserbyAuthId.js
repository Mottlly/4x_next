import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Import NextAuth config
import pool from "@/library/middleware/db"; // Adjust path based on your setup
import fs from "fs";
import path from "path";

// Load SQL query from file
const getUserByAuthIdQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/getUserAuthId.sql"),
  "utf8"
);

// ✅ GET request to fetch user by Auth0 `sub`
export async function GET(req) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("Session Data:", session);
    const auth_id = session.user.id; // Auth0 `sub` is stored as `session.user.id`
    console.log("Fetching user with auth_id:", auth_id);

    const { rows } = await pool.query(getUserByAuthIdQuery, [auth_id]);

    if (rows.length === 0) {
      console.log("User not found.");
      return NextResponse.json(
        { error: "User not found in database. Generate new user!" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error("Error during database query:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
