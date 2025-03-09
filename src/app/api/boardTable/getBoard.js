import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load the correct SQL query for getting a board state
const getBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/getBoard.sql"),
  "utf8"
);

// ✅ GET request to fetch board state by ID
export async function GET(req) {
  try {
    // Extract board ID from query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Board ID is required." },
        { status: 400 }
      );
    }

    console.log("Fetching board state with ID:", id);

    // Query database
    const { rows } = await pool.query(getBoardQuery, [id]);

    if (rows.length === 0) {
      console.log("Board state not found.");
      return NextResponse.json(
        { error: "Board state not found." },
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
