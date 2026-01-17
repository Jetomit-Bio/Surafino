"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "@/components/Editor";

type Post = {
  title: string;
  description: string;
  content: string;
};

export default function CreatePostPage() {
  const router = useRouter();

  const [post, setPost] = useState<Post>({
    title: "",
    description: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  /* =========================
     CREATE POST
     ========================= */
  async function create() {
    setError("");
    setSaved(false);

    if (!post.title.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/manager/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Failed to create post");
      return;
    }

    const data = await res.json();

    // redirect to edit page
    router.push(`/manager/edit/${data.id}`);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Create new post
      </h1>

      {error && (
        <p className="mb-4 text-red-600">
          {error}
        </p>
      )}

      {saved && (
        <p className="mb-4 text-green-600">
          Created successfully
        </p>
      )}

      <div className="space-y-6">
        {/* TITLE */}
        <input
          className="w-full p-3 border rounded"
          placeholder="Title"
          value={post.title}
          onChange={e =>
            setPost({
              ...post,
              title: e.target.value,
            })
          }
        />

        {/* DESCRIPTION */}
        <textarea
          className="w-full p-3 border rounded h-24"
          placeholder="Description"
          value={post.description}
          onChange={e =>
            setPost({
              ...post,
              description: e.target.value,
            })
          }
        />

        {/* CONTENT */}
        <Editor
          content={post.content}
          onChange={html =>
            setPost({
              ...post,
              content: html,
            })
          }
        />

        {/* ACTIONS */}
        <div className="flex gap-4">
          <button
            onClick={create}
            disabled={loading}
            className="
              px-6 py-2 rounded
              bg-blue-600 text-white
              hover:bg-blue-700
              disabled:opacity-50
            "
          >
            {loading ? "Creating..." : "Create"}
          </button>

          <button
            onClick={() => router.push("/manager")}
            className="px-6 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
