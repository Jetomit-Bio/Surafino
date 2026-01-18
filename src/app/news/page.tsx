export const dynamic = "force-dynamic";

import Link from "next/link";
import { pool } from "@/lib/db";

type Post = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default async function NewsPage() {
  let posts: Post[] = [];

  try {
    const conn = await pool.getConnection();
    posts = await conn.query(
      `
      SELECT id, title, description, created_at
      FROM posts
      ORDER BY created_at DESC
      `
    );
    conn.release();
  } catch (err) {
    console.error("Failed to load posts:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">
      {/* HEADER */}
      <header className="mb-16">
        <h1 className="text-4xl font-extrabold">
          News
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
          All articles and updates published on Surafino.
        </p>
      </header>

      {/* POSTS */}
      {posts.length === 0 ? (
        <p className="text-gray-500">
          No posts available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <article
              key={post.id}
              className="
                rounded-2xl border border-gray-200 dark:border-gray-700
                p-6 hover:shadow-md transition
              "
            >
              <h2 className="text-xl font-semibold">
                {post.title}
              </h2>

              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {post.description}
              </p>

              <Link
                href={`/news/${post.id}`}
                className="inline-block mt-5 text-blue-600 hover:underline"
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
