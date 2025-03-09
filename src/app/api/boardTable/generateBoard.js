import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ensure correct path
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL query for inserting a new board state
const boardPostQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/postBoard.sql"),
  "utf8"
);

// Function to generate board state
function generateBoardRef() {
  const boardRef = {
    tiles: [],
  };

  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      const tile = {
        x: x,
        y: y,
        z: Math.floor(Math.random() * 4) + 1, // Random Z value between 1 and 4
        type: "terrain_type",
      };
      boardRef.tiles.push(tile);
    }
  }

  return boardRef;
}

// ✅ POST request to generate and insert a board state
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

    console.log("🔹 Generating board for user ID:", user_id);

    // Generate the board state
    const boardRef = generateBoardRef();
    const boardRefJSON = JSON.stringify(boardRef);

    // Insert the user_id and generated board into the database
    const result = await pool.query(boardPostQuery, [user_id, boardRefJSON]);

    return NextResponse.json(
      {
        message: "Map configuration created.",
        boardRef: result.rows[0].boardref,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting map configuration:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
