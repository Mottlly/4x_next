import { NextResponse } from "next/server";
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";
import { createNoise2D } from "simplex-noise";

// SQL queries (unchanged)
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
const deleteBoardQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/boardTable/deleteBoard.sql"),
  "utf8"
);

// ✅ GET (unchanged)
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const game_id = searchParams.get("game_id");

  if (!id && !game_id)
    return NextResponse.json(
      { error: "Board ID or Game ID required." },
      { status: 400 }
    );

  let query, param;
  if (id) {
    query = getBoardQuery;
    param = [id];
  } else {
    query = getBoardByGameIDQuery;
    param = [game_id];
  }

  try {
    const { rows } = await pool.query(query, param);
    if (rows.length === 0)
      return NextResponse.json({ error: "Board not found." }, { status: 404 });

    return NextResponse.json({ board: rows[0].boardref }, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ POST (Procedural Generation on Backend)
export async function POST(req) {
  try {
    const { user_id, game_id } = await req.json();

    if (!user_id || !game_id) {
      return NextResponse.json(
        { error: "User ID and Game ID are required." },
        { status: 400 }
      );
    }

    // Generate biome map directly on backend
    const tiles = generateBiomeMap(25, 25);

    const boardState = { tiles };

    const { rows } = await pool.query(postBoardQuery, [
      user_id,
      game_id,
      JSON.stringify(boardState),
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

// DELETE (unchanged)
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

// 🎲 Backend biome generation function
function generateBiomeMap(cols, rows, seed = Math.random()) {
  const noise2D = createNoise2D(() => seed);
  const scale = 0.08;
  const tiles = [];

  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const elevation = noise2D(q * scale, r * scale);
      const moisture = noise2D(q * scale + 100, r * scale + 100);

      let type = "plains";

      if (elevation < -0.3) type = "water";
      else if (elevation < 0) type = moisture > 0 ? "plains" : "desert";
      else if (elevation < 0.4) type = moisture > 0.2 ? "forest" : "plains";
      else type = "mountain";

      tiles.push({ q, r, type });
    }
  }

  return tiles;
}
