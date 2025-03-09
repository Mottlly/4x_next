import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL query
const getUserByIdQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/getUserId.sql"),
  "utf8"
);

// ✅ GET request to fetch user by database ID
export async function GET(req) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract user ID from request params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching user with ID:", id);

    // Query database
    const { rows } = await pool.query(getUserByIdQuery, [id]);

    if (rows.length === 0) {
      console.log("User not found.");
      return NextResponse.json({ error: "User not found." }, { status: 404 });
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
