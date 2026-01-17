"use client";

import { useState } from "react";

export default function ManagerLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }

    // 🔥 TERAZ už cookie EXISTUJE → normálna navigácia
    window.location.href = "/manager";
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={login}
        className="w-full max-w-sm border rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-6">
          Manager Login
        </h1>

        {error && (
          <p className="mb-4 text-red-600">
            {error}
          </p>
        )}

        <input
          className="w-full mb-3 p-2 border rounded"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <input
          className="w-full mb-4 p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </main>
  );
}
