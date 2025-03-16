import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"; // ✅ Import JWT decryption utility
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // ✅ Ensure correct import
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"; // ✅ Import JWT decoder
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
    console.log("🔹 Extracting JWT from Authorization header...");

    let token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      console.error("🔴 No valid JWT token found.");
      return NextResponse.json(
        { error: "Unauthorized. No valid token found." },
        { status: 401 }
      );
    }

    console.log("🔍 Extracted Token:", token);

    // ✅ Extract user ID from the token
    const auth_id = token.id || token.sub;
    if (!auth_id || typeof auth_id !== "string") {
      console.error("🔴 Invalid auth_id extracted:", auth_id);
      return NextResponse.json(
        { error: "Invalid token structure." },
        { status: 401 }
      );
    }

    console.log("🔹 Fetching user from database:", auth_id);

    // ✅ Execute the query and log the result
    const result = await pool.query(getUserByAuthIdQuery, [auth_id]);

    if (result.rows.length === 0) {
      console.warn("⚠️ No user found for auth_id:", auth_id);
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    console.log("✅ User found:", result.rows[0]); // ✅ Log the user details

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("🔴 Server error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new user
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const auth_id = token.sub;
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
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token || !token.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const requestorAuthId = token.id;
    const { auth_id } = await req.json();

    if (!auth_id) {
      return NextResponse.json(
        { error: "Auth0 ID to delete is required." },
        { status: 400 }
      );
    }

    console.log("Deleting user:", auth_id);

    const roleResult = await pool.query(getUserRoleQuery, [requestorAuthId]);
    if (roleResult.rows.length === 0 || roleResult.rows[0].role !== "admin") {
      return NextResponse.json(
        { error: "Access denied. Admins only." },
        { status: 403 }
      );
    }

    const deleteResult = await pool.query(deleteUserQuery, [auth_id]);
    if (deleteResult.rowCount === 0) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

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
