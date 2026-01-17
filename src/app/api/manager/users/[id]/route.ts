import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

type Params = {
  params: Promise<{ id: string }>;
};

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  jwt.verify(token, process.env.JWT_SECRET!);
}

/* =========================
   GET – LOAD USER
   ========================= */
export async function DELETE(
  req: Request,
  { params }: Params
) {
  let conn;

  try {
    const cookieStore = await cookies();
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
    ) as { id: number };

    const { id } = await params;
    const userIdToDelete = Number(id);

    /* =========================
       SECURITY: CANNOT DELETE SELF
       ========================= */
    if (decoded.id === userIdToDelete) {
      return NextResponse.json(
        { error: "You cannot delete yourself" },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    await conn.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [userIdToDelete]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete user:", err);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

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
      SELECT id, username, email
      FROM users
      WHERE id = ?
      `,
      [id]
    );

    if (!rows[0]) {
      return NextResponse.json(
        { error: "User not found" },
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

    console.error("Failed to load user:", err);
    return NextResponse.json(
      { error: "Failed to load user" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}

/* =========================
   PUT – UPDATE USER
   ========================= */
export async function PUT(
  req: Request,
  { params }: Params
) {
  let conn;

  try {
    await requireAuth();
    const { id } = await params;

    const { username, email, password } =
      await req.json();

    if (!username || !email) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    if (password) {
      const hash = await bcrypt.hash(password, 10);

      await conn.query(
        `
        UPDATE users
        SET username = ?, email = ?, password = ?
        WHERE id = ?
        `,
        [username, email, hash, id]
      );
    } else {
      await conn.query(
        `
        UPDATE users
        SET username = ?, email = ?
        WHERE id = ?
        `,
        [username, email, id]
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.error("Failed to update user:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  } finally {
    if (conn) conn.release();
  }
}
