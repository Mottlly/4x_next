import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

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
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ POST: Generate and insert board
export async function POST(req) {
  try {
    const boardState = generateBoard();
    const { user_id } = await req.json();

    if (!user_id)
      return NextResponse.json({ error: "User ID required." }, { status: 400 });

    const { rows } = await pool.query(postBoardQuery, [
      user_id,
      JSON.stringify(boardState),
    ]);
    return NextResponse.json(
      { message: "Board created.", board: rows[0] },
      { status: 201 }
    );
  } catch (error) {
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
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// Function to generate board state
function generateBoard() {
  const board = { tiles: [] };
  for (let x = 1; x <= 10; x++) {
    for (let y = 1; y <= 10; y++) {
      board.tiles.push({
        x,
        y,
        z: Math.floor(Math.random() * 4) + 1,
        type: "terrain_type",
      });
    }
  }
  return board;
}
