import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";
import { generateBiomeMap } from "../../../library/utililies/game/biomeGenerators/generateMap";
import { createPiece } from "../../../library/utililies/game/gamePieces/schemas/pieceBank";
import { v4 as uuidv4 } from "uuid";
import { generateGoodyHuts } from "../../../library/utililies/game/goodyHuts/generateGoodyHuts";
import { generateHostileFortress } from "../../../library/utililies/game/biomeGenerators/generateHostileFortress";
import { hexDistance } from "../../../library/utililies/game/tileUtilities/Positioning/distanceFinder";

// Function to read SQL queries lazily
function readSQLQuery(filename) {
  return fs.readFileSync(
    path.join(process.cwd(), "src/library/sql/boardTable", filename),
    "utf8"
  );
}

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

  const query = id
    ? readSQLQuery("getBoard.sql")
    : readSQLQuery("getBoardByGameID.sql");
  const params = id ? [id] : [game_id];

  try {
    const { rows } = await pool.query(query, params);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }

    const b = rows[0];
    return NextResponse.json(
      {
        board: b.boardref,
        board_id: b.id,
        created_at: b.created_at,
        updated_at: b.updated_at,
      },
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
    const board = generateBiomeMap(cols, rows);
    const forbidden = new Set(["water", "lake", "impassable mountain"]);
    const spawnable = board.tiles.filter((t) => !forbidden.has(t.type));
    const podTile = spawnable[Math.floor(Math.random() * spawnable.length)];
    const firstPiece = createPiece("Pod", {
      id: uuidv4(),
      q: podTile.q,
      r: podTile.r,
    });

    // Only allow goody huts within 10 tiles of the pod
    const goodyHutSpawnable = spawnable.filter(
      (t) => hexDistance(t, podTile) <= 8
    );

    // Generate 3–6 goody huts within range
    const goodyHuts = generateGoodyHuts(goodyHutSpawnable);

    // --- Add fortress generation here ---
    const fortress = generateHostileFortress(board.tiles, podTile, 6);
    const hostilePieces = fortress ? [fortress] : [];

    const boardState = {
      turn: 1,
      cols,
      rows,
      spacing,
      tiles: board.tiles,
      riverPaths: board.riverPaths,
      pieces: [firstPiece],
      neutralPieces: goodyHuts,
      hostilePieces, // fortress will be rendered by HostilePiecesLayer
      resources: [20, 3, 3],
    };

    const { rows: inserted } = await pool.query(readSQLQuery("postBoard.sql"), [
      user_id,
      game_id,
      JSON.stringify(boardState),
    ]);

    const b = inserted[0];
    return NextResponse.json(
      {
        board: b.boardref,
        board_id: b.id,
        created_at: b.created_at,
        updated_at: b.updated_at,
      },
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

    // Preserve all piece fields
    const boardToSave = {
      ...newBoard,
      pieces: (newBoard.pieces || []).map((p) => ({ ...p })),
      hostilePieces: (newBoard.hostilePieces || []).map((p) => ({ ...p })), // <-- add this
      neutralPieces: (newBoard.neutralPieces || []).map((p) => ({ ...p })), // <-- optional
    };

    const { rows: updated } = await pool.query(readSQLQuery("patchBoard.sql"), [
      JSON.stringify(boardToSave),
      board_id,
    ]);

    if (updated.length === 0) {
      return NextResponse.json({ error: "Board not found." }, { status: 404 });
    }

    const b = updated[0];
    return NextResponse.json(
      {
        message: "Board updated.",
        board: b.boardref,
        created_at: b.created_at,
        updated_at: b.updated_at,
      },
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

    const result = await pool.query(readSQLQuery("deleteboard.sql"), [
      board_id,
    ]);
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
