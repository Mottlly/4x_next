import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Ensure correct path
import pool from "@/library/middleware/db";
import fs from "fs";
import path from "path";

// Load SQL queries
const deleteUserQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/deleteUser.sql"),
  "utf8"
);

const getUserRoleQuery = fs.readFileSync(
  path.join(process.cwd(), "src/library/sql/userTable/getUserAuthId.sql"),
  "utf8"
);

// ✅ DELETE request to remove a user by Auth0 ID (`sub`)
export async function DELETE(req) {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Extract requestor's Auth0 ID (`sub`) from session
    const requestorAuthId = session.user.id; // `sub` is stored as `session.user.id`
    if (!requestorAuthId) {
      return NextResponse.json(
        { error: "Auth0 ID not found in session." },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { auth_id } = body; // The Auth0 ID of the user to delete

    if (!auth_id) {
      return NextResponse.json(
        { error: "No Auth0 ID provided to delete." },
        { status: 400 }
      );
    }

    // Fetch the requestor's role from the database using their Auth0 ID
    const roleResult = await pool.query(getUserRoleQuery, [requestorAuthId]);

    if (roleResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Access denied. User role not found." },
        { status: 403 }
      );
    }

    const requestorRole = roleResult.rows[0].role;

    // Check if the user has admin rights
    if (requestorRole !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Only admins can delete users." },
        { status: 403 }
      );
    }

    // Proceed with deleting the user by Auth0 ID (`sub`)
    const deletedUser = await pool.query(deleteUserQuery, [auth_id]);

    if (deletedUser.rowCount === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted.", deletedUser: deletedUser.rows[0] },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
