"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function save() {
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/manager/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create user");
      return;
    }

    router.push("/manager");
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">
        Add user
      </h1>

      {error && (
        <p className="mb-4 text-red-600">
          {error}
        </p>
      )}

      <div className="space-y-6">
        <input
          className="w-full p-3 border rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <input
          type="email"
          className="w-full p-3 border rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Create user
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
