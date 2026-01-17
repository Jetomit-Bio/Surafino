"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  // Load theme from cookie on first render
  useEffect(() => {
    const match = document.cookie.match(/theme=(dark|light)/);
    const isDark = match?.[1] === "dark";

    setDark(isDark);
    document.body.classList.toggle("dark", isDark);
  }, []);

  // Toggle theme and save to cookie
  function toggleTheme() {
    const newTheme = !dark;
    setDark(newTheme);

    document.body.classList.toggle("dark", newTheme);
    document.cookie = `theme=${newTheme ? "dark" : "light"}; path=/; max-age=31536000`;
  }

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        borderColor: dark ? "#2a2a2a" : "#e5e7eb",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="text-xl font-bold tracking-wide"
        >
          Surafino
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="hover:underline"
          >
            Home
          </Link>

          <Link
            href="/news"
            className="hover:underline"
          >
            News
          </Link>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border transition"
            style={{
              borderColor: dark ? "#3a3a3a" : "#d1d5db",
            }}
          >
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div
          className="md:hidden px-6 py-4 space-y-4 border-t"
          style={{
            background: "var(--background)",
            color: "var(--foreground)",
            borderColor: dark ? "#2a2a2a" : "#e5e7eb",
          }}
        >
          <Link href="/" onClick={() => setOpen(false)} className="block">
            Home
          </Link>

          <Link href="/news" onClick={() => setOpen(false)} className="block">
            News
          </Link>

          <button
            onClick={() => {
              toggleTheme();
              setOpen(false);
            }}
            className="block"
          >
            {dark ? "Light mode" : "Dark mode"}
          </button>
        </div>
      )}
    </header>
  );
}
