"use client";

import { useEffect, useState } from "react";
import Editor from "@/components/Editor";

type Post = {
  title: string;
  description: string;
  content: string;
};

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);

  const [post, setPost] = useState<Post>({
    title: "",
    description: "",
    content: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  /* =========================
     UNWRAP PARAMS (Next.js 16)
     ========================= */
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  /* =========================
     LOAD POST
     ========================= */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/manager/posts/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to load post");
        }
        return res.json();
      })
      .then(data => {
        setPost({
          title: data.title ?? "",
          description: data.description ?? "",
          content: data.content ?? "",
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Post not found");
        setLoading(false);
      });
  }, [id]);

  /* =========================
     SAVE POST
     ========================= */
  async function save() {
    if (!id) return;

    setError("");
    setSaved(false);

    const res = await fetch(`/api/manager/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: post.title,
        description: post.description,
        content: post.content, // HTML s viac videami + obrázkami
      }),
    });

    if (!res.ok) {
      setError("Failed to save post");
      return;
    }

    setSaved(true);
  }

  /* =========================
     RENDER STATES
     ========================= */
  if (loading) {
    return <p className="p-10">Loading…</p>;
  }

  if (error) {
    return (
      <p className="p-10 text-red-600">
        {error}
      </p>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Edit post
      </h1>

      {saved && (
        <p className="mb-4 text-green-600">
          Saved successfully
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

        {/* CONTENT – WYSIWYG EDITOR */}
        <Editor
          content={post.content}
          onChange={html =>
            setPost({
              ...post,
              content: html, // môže obsahovať ľubovoľný počet <img> a <video>
            })
          }
        />

        {/* SAVE */}
        <button
          onClick={save}
          className="
            px-6 py-2 rounded
            bg-blue-600 text-white
            hover:bg-blue-700
          "
        >
          Save
        </button>
      </div>
    </main>
  );
}
