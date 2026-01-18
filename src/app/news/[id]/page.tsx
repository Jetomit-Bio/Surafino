import { pool } from "@/lib/db";
import { notFound } from "next/navigation";

type Post = {
  id: number;
  title: string;
  description: string;
  content: string;
  created_at: string;
  author: string | null;
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let post: Post | null = null;

  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      `
      SELECT
        p.id,
        p.title,
        p.description,
        p.content,
        p.created_at,
        u.username AS author
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = ?
      `,
      [id]
    );
    conn.release();

    post = rows[0] ?? null;
  } catch (err) {
    console.error("Failed to load post:", err);
  }

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-[1400px] mx-auto px-5 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

        {/* ================= LEFT: ARTICLE CONTENT ================= */}
        <article
          className="
            prose dark:prose-invert max-w-none
            order-2
            lg:order-1
          "
        >
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* ================= RIGHT: META PANEL ================= */}
        <aside
          className="
            border border-gray-200 dark:border-gray-700
            rounded-xl p-6
            h-fit

            order-1
            lg:order-2

            lg:sticky
            lg:bottom-[10px]
          "
        >
          {/* TITLE */}
          <h1 className="text-2xl font-bold mb-6">
            {post.title}
          </h1>

          {/* AUTHOR */}
          <div className="mb-4">
            <p className="font-semibold">
              Author
            </p>
            <p>
              {post.author ?? "Unknown"}
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-4">
            <p className="font-semibold">
              Description
            </p>
            <p>
              {post.description}
            </p>
          </div>

          {/* PUBLISHED DATE */}
          <div>
            <p className="font-semibold">
              Published
            </p>
            <p>
              {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
        </aside>

      </div>
    </main>
  );
}
