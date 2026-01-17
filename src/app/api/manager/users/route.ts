import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  jwt.verify(token, process.env.JWT_SECRET!);
}

/* =========================
   GET – LIST USERS
   ========================= */
export async function GET() {
  let conn;

  try {
    await requireAuth();
    conn = await pool.getConnection();

    const users = await conn.query(
      `
      SELECT id, username, email
      FROM users
      ORDER BY id ASC
      `
    );

    return NextResponse.json(users);
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Failed to load users:", err);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

/* =========================
   POST – CREATE USER
   ========================= */
export async function POST(req: Request) {
  let conn;

  try {
    await requireAuth();

    const { username, email, password } =
      await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 10);

    conn = await pool.getConnection();

    await conn.query(
      `
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
      `,
      [username, email, hash]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Failed to create user:", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
