import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type JwtPayload = {
  id: number;
  username: string;
};

/* =========================
   GET – LIST POSTS
   ========================= */
export async function GET() {
  let conn;

  try {
    conn = await pool.getConnection();

    const rows = await conn.query(
      `
      SELECT
        posts.id,
        posts.title,
        posts.created_at,
        users.username AS author
      FROM posts
      JOIN users ON users.id = posts.author_id
      ORDER BY posts.created_at DESC
      `
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to load manager posts:", error);
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

/* =========================
   POST – CREATE POST
   ========================= */
export async function POST(req: Request) {
  let conn;

  try {
    /* =========================
       AUTH (Next.js 16 FIX)
       ========================= */
    const cookieStore = await cookies(); // 🔑 MUST BE AWAIT
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    /* =========================
       BODY
       ========================= */
    const { title, description, content } = await req.json();

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    /* =========================
       INSERT
       ========================= */
    conn = await pool.getConnection();

    const result = await conn.query(
      `
      INSERT INTO posts (
        title,
        description,
        content,
        author_id,
        created_at
      ) VALUES (?, ?, ?, ?, NOW())
      `,
      [
        title,
        description ?? "",
        content ?? "",
        decoded.id,
      ]
    );

    const insertId = Number(result.insertId);

    return NextResponse.json({ id: insertId });
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
