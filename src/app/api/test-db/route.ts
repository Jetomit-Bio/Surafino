import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT 1 AS ok");
  conn.release();

  return NextResponse.json(rows);
}
