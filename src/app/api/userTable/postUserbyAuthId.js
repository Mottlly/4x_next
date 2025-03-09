import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ensure correct path
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL query
const insertUserQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/insertAuth0User.sql"),
  "utf8"
);

// ✅ POST request to create a new user by Auth0 ID (`sub`)
export async function POST(req) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Extract Auth0 ID (`sub`) from session
    const auth_id = session.user.id; // Auth0 ID is stored as `session.user.id`
    if (!auth_id) {
      return NextResponse.json(
        { error: "Auth0 ID not found in session." },
        { status: 403 }
      );
    }

    console.log("🔹 Creating new user with Auth0 ID:", auth_id);

    // Insert new user into database
    const newUser = await pool.query(insertUserQuery, [auth_id]);

    return NextResponse.json(
      { message: "User created.", user: newUser.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting user:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
