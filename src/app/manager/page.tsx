"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Post = {
  id: number;
  title: string;
};

type User = {
  id: number;
  username: string;
  email: string;
};

export default function ManagerPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [me, setMe] = useState<{ id: number; username: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     LOAD MANAGER DATA
     ========================= */
  useEffect(() => {
    Promise.all([
      fetch("/api/manager/posts").then(res =>
        res.ok ? res.json() : []
      ),
      fetch("/api/manager/users").then(res =>
        res.ok ? res.json() : []
      ),
      fetch("/api/auth/me").then(res =>
        res.ok ? res.json() : null
      ),
    ])
      .then(([postsData, usersData, meData]) => {
        setPosts(postsData);
        setUsers(usersData);
        setMe(meData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load manager data");
        setLoading(false);
      });
  }, []);

  /* =========================
     LOGOUT
     ========================= */
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push("/manager/login");
  }

  /* =========================
     DELETE POST
     ========================= */
  async function deletePost(id: number) {
    if (!confirm("Delete this post?")) return;

    const res = await fetch(
      `/api/manager/posts/${id}`,
      { method: "DELETE" }
    );

    if (!res.ok) {
      alert("Failed to delete post");
      return;
    }

    setPosts(posts.filter(p => p.id !== id));
  }

  /* =========================
     DELETE USER
     ========================= */
  async function deleteUser(id: number) {
    if (!confirm("Delete this user?")) return;

    const res = await fetch(
      `/api/manager/users/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete user");
      return;
    }

    setUsers(users.filter(u => u.id !== id));
  }

  if (loading) {
    return <p className="p-10">Loading…</p>;
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">
      {/* =========================
         HEADER
         ========================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Manager
          </h1>

          {me && (
            <p className="text-sm text-gray-500">
              Logged in as{" "}
              <strong>{me.username}</strong>
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              router.push("/manager/create")
            }
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Create post
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 border rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {/* =========================
         POSTS
         ========================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Posts
        </h2>

        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <div className="space-y-3">
            {posts.map(post => (
              <div
                key={post.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <span>{post.title}</span>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/manager/edit/${post.id}`
                      )
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deletePost(post.id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================
         USERS
         ========================= */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Users
          </h2>

          <button
            onClick={() =>
              router.push("/manager/users/add")
            }
            className="px-4 py-2 border rounded"
          >
            Add user
          </button>
        </div>

        {users.length === 0 ? (
          <p>No users.</p>
        ) : (
          <div className="space-y-3">
            {users.map(user => (
              <div
                key={user.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      router.push(
                        `/manager/users/edit/${user.id}`
                      )
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteUser(user.id)
                    }
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
