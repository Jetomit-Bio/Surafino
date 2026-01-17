import Link from "next/link";
import { pool } from "@/lib/db";

type Post = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default async function HomePage() {
  let posts: Post[] = [];

  try {
    const conn = await pool.getConnection();
    posts = await conn.query(
      `
      SELECT id, title, description, created_at
      FROM posts
      ORDER BY created_at DESC
      LIMIT 3
      `
    );
    conn.release();
  } catch (err) {
    console.error("Failed to load posts:", err);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20 space-y-32">
      {/* ================= HERO ================= */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to Surafino
        </h1>

        <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
          A modern blog and news platform focused on technology,
          development and digital projects.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/news"
            className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Read articles
          </Link>

          <Link
            href="/news"
            className="px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            View news
          </Link>
        </div>
      </section>

      {/* ================= LATEST POSTS ================= */}
      <section>
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold">
            Latest posts
          </h2>

          <Link
            href="/news"
            className="text-blue-600 hover:underline"
          >
            View more
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500">
            No posts have been published yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
              <article
                key={post.id}
                className="
                  rounded-2xl border border-gray-200 dark:border-gray-700
                  p-6 hover:shadow-md transition
                "
              >
                <h3 className="text-xl font-semibold">
                  {post.title}
                </h3>

                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {post.description}
                </p>

                <Link
                  href={`/news/${post.id}`}
                  className="inline-block mt-5 text-blue-600 hover:underline"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ================= ABOUT ================= */}
      <section className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          About Surafino
        </h2>

        <p className="text-gray-700 dark:text-gray-400 leading-relaxed">
          Surafino is a personal blog and news platform built with modern
          web technologies. It allows publishing articles with rich content,
          managing posts through a private admin panel, and supports
          light and dark mode for better readability.
        </p>
      </section>
    </main>
  );
}
