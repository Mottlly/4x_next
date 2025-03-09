import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL query for deleting a board
const deleteBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/deleteBoard.sql"),
  "utf8"
);

// ✅ DELETE request to remove a board by ID
export async function DELETE(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { board_id } = body;

    if (!board_id) {
      return NextResponse.json(
        { error: "board_id is required." },
        { status: 400 }
      );
    }

    console.log("Deleting board with ID:", board_id);

    // Execute deletion query
    const deleteResult = await pool.query(deleteBoardQuery, [board_id]);

    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Board deleted successfully.",
        deletedBoardId: board_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting board:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
