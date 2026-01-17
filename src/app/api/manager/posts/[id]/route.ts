import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type Params = {
  params: Promise<{ id: string }>;
};

type JwtPayload = {
  id: number;
  username: string;
};

/* =========================
   AUTH HELPER
   ========================= */
async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  return jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as JwtPayload;
}

/* =========================
   GET – LOAD POST
   ========================= */
export async function GET(
  req: Request,
  { params }: Params
) {
  let conn;

  try {
    await requireAuth();

    const { id } = await params;
    conn = await pool.getConnection();

    const rows = await conn.query(
      `
      SELECT id, title, description, content
      FROM posts
      WHERE id = ?
      `,
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Failed to load post:", err);
    return NextResponse.json(
      { error: "Failed to load post" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

/* =========================
   PUT – UPDATE POST
   ========================= */
export async function PUT(
  req: Request,
  { params }: Params
) {
  let conn;

  try {
    await requireAuth();

    const { id } = await params;
    const { title, description, content } =
      await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    await conn.query(
      `
      UPDATE posts
      SET title = ?, description = ?, content = ?
      WHERE id = ?
      `,
      [
        title,
        description ?? "",
        content,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Failed to update post:", err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

/* =========================
   DELETE – DELETE POST
   ========================= */
export async function DELETE(
  req: Request,
  { params }: Params
) {
  let conn;

  try {
    await requireAuth();

    const { id } = await params;
    conn = await pool.getConnection();

    await conn.query(
      `
      DELETE FROM posts
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Failed to delete post:", err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
