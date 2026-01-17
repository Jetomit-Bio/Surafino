"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  username: string;
  email: string;
};

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();

  const [id, setId] = useState<string | null>(null);
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
  });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  /* =========================
     UNWRAP PARAMS (Next 16)
     ========================= */
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);

  /* =========================
     LOAD USER
     ========================= */
  useEffect(() => {
    if (!id) return;

    fetch(`/api/manager/users/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to load user");
        }
        return res.json();
      })
      .then(data => {
        setUser({
          username: data.username,
          email: data.email,
        });
        setLoading(false);
      })
      .catch(() => {
        setError("User not found");
        setLoading(false);
      });
  }, [id]);

  /* =========================
     SAVE USER
     ========================= */
  async function save() {
    if (!id) return;

    setError("");
    setSaved(false);

    const res = await fetch(`/api/manager/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...user,
        password: password || undefined,
      }),
    });

    if (!res.ok) {
      setError("Failed to save user");
      return;
    }

    setSaved(true);
    setPassword("");
  }

  if (loading) {
    return <p className="p-10">Loading…</p>;
  }

  if (error) {
    return <p className="p-10 text-red-600">{error}</p>;
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Edit user
      </h1>

      {saved && (
        <p className="mb-4 text-green-600">
          User updated successfully
        </p>
      )}

      <div className="space-y-6">
        <input
          className="w-full p-3 border rounded"
          placeholder="Username"
          value={user.username}
          onChange={e =>
            setUser({
              ...user,
              username: e.target.value,
            })
          }
        />

        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Email"
          value={user.email}
          onChange={e =>
            setUser({
              ...user,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="w-full p-3 border rounded"
          placeholder="New password (optional)"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={save}
            className="px-6 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>

          <button
            onClick={() => router.back()}
            className="px-6 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
