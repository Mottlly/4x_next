import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ensure correct path
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL queries
const userCheckQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/userCheck.sql"),
  "utf8"
);
const insertGameQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/insertGame.sql"),
  "utf8"
);

// ✅ POST request to create a new game
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

    // Extract user ID from session (Auth0 ID)
    const user_id = session.user.id; // `sub` is stored as `session.user.id`

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    console.log("🔹 Creating game for user ID:", user_id);

    // Check if the user exists in the database
    const userCheckResult = await pool.query(userCheckQuery, [user_id]);

    if (userCheckResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Insert new game into database
    const newGame = await pool.query(insertGameQuery, [user_id]);

    return NextResponse.json(
      { message: "Game created.", game: newGame.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting game:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
