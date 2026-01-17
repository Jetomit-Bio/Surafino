import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const conn = await pool.getConnection();
  const posts = await conn.query(
    "SELECT id, title FROM posts ORDER BY created_at DESC"
  );
  conn.release();

  return NextResponse.json(posts);
}
