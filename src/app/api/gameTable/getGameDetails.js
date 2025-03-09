import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL query
const getGameDetailsQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/getGameDetails.sql"),
  "utf8"
);

// ✅ GET request to fetch game details by ID
export async function GET(req) {
  try {
    // Extract game ID from request params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      );
    }

    console.log("Fetching game with ID:", id);

    // Query database
    const { rows } = await pool.query(getGameDetailsQuery, [id]);

    if (rows.length === 0) {
      console.log("Game not found.");
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
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
