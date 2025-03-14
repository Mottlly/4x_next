import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Read SQL files at runtime (keeping your original approach)
const getBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/getBoard.sql"),
  "utf8"
);
const postBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/postBoard.sql"),
  "utf8"
);
const deleteBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/deleteBoard.sql"),
  "utf8"
);

// ✅ GET: Fetch board state by ID
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id)
    return NextResponse.json({ error: "Board ID required." }, { status: 400 });

  try {
    const { rows } = await pool.query(getBoardQuery, [id]);
    if (rows.length === 0)
      return NextResponse.json({ error: "Board not found." }, { status: 404 });

    return NextResponse.json(rows[0].board_data, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ POST: Generate and insert board
export async function POST(req) {
  try {
    const { user_id } = await req.json();
    if (!user_id)
      return NextResponse.json({ error: "User ID required." }, { status: 400 });

    const boardState = generateBoard(); // ✅ Now includes `z`

    const { rows } = await pool.query(postBoardQuery, [
      user_id,
      JSON.stringify(boardState), // ✅ Includes `z`
    ]);

    return NextResponse.json(
      { message: "Board created.", board: rows[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a board by ID
export async function DELETE(req) {
  try {
    const { board_id } = await req.json();
    if (!board_id)
      return NextResponse.json(
        { error: "Board ID required." },
        { status: 400 }
      );

    const result = await pool.query(deleteBoardQuery, [board_id]);
    if (result.rowCount === 0)
      return NextResponse.json({ error: "Board not found." }, { status: 404 });

    return NextResponse.json(
      { message: "Board deleted.", deletedBoardId: board_id },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

function generateBoard() {
  const board = { tiles: [] };
  for (let q = 1; q <= 10; q++) {
    for (let r = 1; r <= 10; r++) {
      board.tiles.push({
        q,
        r,
        z: Math.floor(Math.random() * 4) + 1, // ✅ Random elevation
        type: "terrain_type",
      });
    }
  }
  return board;
}
