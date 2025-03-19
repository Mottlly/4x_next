import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route"; // Ensure correct path
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL queries
const getGameDetailsQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/getGameDetails.sql"),
  "utf8"
);

const getLatestGameQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/getLatestGame.sql"),
  "utf8"
);

const insertGameQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/insertGame.sql"),
  "utf8"
);
const deleteGameQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/deleteGame.sql"),
  "utf8"
);
const userCheckQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/gameTable/userCheck.sql"),
  "utf8"
);

// ✅ GET: Fetch game details by ID
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      // Fetch game by ID
      const { rows } = await pool.query(getGameDetailsQuery, [id]);
      if (rows.length === 0)
        return NextResponse.json({ error: "Game not found." }, { status: 404 });
      return NextResponse.json(rows[0], { status: 200 });
    } else {
      // Fetch the most recent game for the logged-in user
      const session = await getServerSession(authOptions);
      if (!session)
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

      const auth_id = session.user.id;
      if (!auth_id)
        return NextResponse.json(
          { error: "User ID required." },
          { status: 400 }
        );

      console.log("🔹 Fetching most recent game for user:", auth_id);

      const latestGame = await pool.query(getLatestGameQuery, [auth_id]);

      if (latestGame.rows.length === 0) {
        return NextResponse.json({ error: "No game found." }, { status: 404 });
      }

      console.log("🔹 Latest game retrieved:", latestGame);

      return NextResponse.json({ game: latestGame.rows[0] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new game
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const user_id = session.user.id;
    if (!user_id)
      return NextResponse.json({ error: "User ID required." }, { status: 400 });

    console.log("🔹 Checking for User:", user_id);

    const userCheckResult = await pool.query(userCheckQuery, [session.user.id]);
    if (userCheckResult.rows.length === 0)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    console.log("🔹 Creating game for user:", user_id);

    const newGame = await pool.query(insertGameQuery, [session.user.id]);
    return NextResponse.json(
      { message: "Game created.", game: newGame.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a game by ID
export async function DELETE(req) {
  try {
    const { game_id } = await req.json();
    if (!game_id)
      return NextResponse.json({ error: "Game ID required." }, { status: 400 });

    console.log("Deleting game:", game_id);
    const deleteResult = await pool.query(deleteGameQuery, [game_id]);

    if (deleteResult.rowCount === 0)
      return NextResponse.json({ error: "Game not found." }, { status: 404 });

    return NextResponse.json(
      { message: "Game deleted.", deletedGameId: game_id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
