import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";
import { generateBiomeMap } from "../../../library/utililies/game/biomeGenerators/generateMap";
import { createPiece } from "../../../library/utililies/game/gamePieces/schemas/pieceBank";
import { v4 as uuidv4 } from "uuid";

const getBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/getBoard.sql"),
  "utf8"
);
const getBoardByGameIDQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/getBoardByGameID.sql"),
  "utf8"
);
const postBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/postBoard.sql"),
  "utf8"
);
const patchBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/patchBoard.sql"),
  "utf8"
);
const deleteBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/deleteBoard.sql"),
  "utf8"
);

// ── GET by id or game_id
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const game_id = searchParams.get("game_id");
  if (!id && !game_id) {
    return NextResponse.json(
      { error: "Board ID or Game ID required." },
      { status: 400 }
    );
  }
  const query = id ? getBoardQuery : getBoardByGameIDQuery;
  const params = id ? [id] : [game_id];

  try {
    const { rows } = await pool.query(query, params);
    if (rows.length === 0) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }
    return NextResponse.json(
      { board: rows[0].boardref, board_id: rows[0].id },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ── POST (generate & insert)
export async function POST(req) {
  try {
    const { user_id, game_id } = await req.json();
    if (!user_id || !game_id) {
      return NextResponse.json(
        { error: "User ID and Game ID are required." },
        { status: 400 }
      );
    }

    const cols = 25;
    const rows = 25;
    const spacing = 1.05;
    const tiles = generateBiomeMap(cols, rows);
    const forbidden = new Set(["water", "lake", "impassable mountain"]);
    const spawnable = tiles.filter((t) => !forbidden.has(t.type));
    const podTile = spawnable[Math.floor(Math.random() * spawnable.length)];
    const firstPiece = createPiece("Pod", {
      id: uuidv4(),
      q: podTile.q,
      r: podTile.r,
    });

    const boardState = {
      turn: 1,
      cols,
      rows,
      spacing,
      tiles,
      pieces: [firstPiece],
      // resources array: [rations, printingMaterial, weapons]
      resources: [20, 3, 3],
    };

    const { rows: inserted } = await pool.query(postBoardQuery, [
      user_id,
      game_id,
      JSON.stringify(boardState),
    ]);

    return NextResponse.json(
      { board: inserted[0].boardref, board_id: inserted[0].id },
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

// ── PATCH (update JSONB)
export async function PATCH(req) {
  try {
    const { board_id, board: newBoard } = await req.json();
    if (!board_id || !newBoard) {
      return NextResponse.json(
        { error: "Board ID and new board payload required." },
        { status: 400 }
      );
    }

    // Ensure pieces are saved with type and location
    const boardToSave = {
      ...newBoard,
      pieces: (newBoard.pieces || []).map((p) => ({ ...p })), // Save all fields
    };

    const { rows: updated } = await pool.query(patchBoardQuery, [
      JSON.stringify(boardToSave),
      board_id,
    ]);
    if (updated.length === 0) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Board updated.", board: updated[0].boardref },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ── DELETE by board_id
export async function DELETE(req) {
  try {
    const { board_id } = await req.json();
    if (!board_id) {
      return NextResponse.json(
        { error: "Board ID required." },
        { status: 400 }
      );
    }

    const result = await pool.query(deleteBoardQuery, [board_id]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }

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
