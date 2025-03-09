import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ensure correct path
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL queries
const getUserByAuthIdQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/getUserAuthId.sql"),
  "utf8"
);
const insertUserQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/insertAuth0User.sql"),
  "utf8"
);
const deleteUserQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/deleteUser.sql"),
  "utf8"
);
const getUserRoleQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/getUserAuthId.sql"),
  "utf8"
);

// ✅ GET: Fetch user by Auth0 ID
export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const auth_id = session.user.id;
    if (!auth_id)
      return NextResponse.json(
        { error: "Auth0 ID required." },
        { status: 400 }
      );

    console.log("Fetching user:", auth_id);
    const { rows } = await pool.query(getUserByAuthIdQuery, [auth_id]);

    if (rows.length === 0)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new user
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const auth_id = session.user.id;
    if (!auth_id)
      return NextResponse.json(
        { error: "Auth0 ID required." },
        { status: 400 }
      );

    console.log("🔹 Creating user:", auth_id);

    const newUser = await pool.query(insertUserQuery, [auth_id]);
    return NextResponse.json(
      { message: "User created.", user: newUser.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ DELETE: Remove a user by Auth0 ID (Admin only)
export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session)
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const requestorAuthId = session.user.id;
    if (!requestorAuthId)
      return NextResponse.json(
        { error: "Auth0 ID required." },
        { status: 400 }
      );

    const { auth_id } = await req.json();
    if (!auth_id)
      return NextResponse.json(
        { error: "Auth0 ID to delete is required." },
        { status: 400 }
      );

    console.log("Deleting user:", auth_id);

    const roleResult = await pool.query(getUserRoleQuery, [requestorAuthId]);
    if (roleResult.rows.length === 0 || roleResult.rows[0].role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const deleteResult = await pool.query(deleteUserQuery, [auth_id]);
    if (deleteResult.rowCount === 0)
      return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json(
      { message: "User deleted.", deletedUserId: auth_id },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
