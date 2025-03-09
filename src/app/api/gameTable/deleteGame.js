import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL query
const deleteGameQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/deleteGame.sql"),
  "utf8"
);

// ✅ DELETE request to remove a game by ID
export async function DELETE(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { game_id } = body;

    if (!game_id) {
      return NextResponse.json(
        { error: "game_id is required." },
        { status: 400 }
      );
    }

    console.log("Deleting game with ID:", game_id);

    // Execute deletion query
    const deleteResult = await pool.query(deleteGameQuery, [game_id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Game deleted successfully.",
        deletedGameId: game_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
