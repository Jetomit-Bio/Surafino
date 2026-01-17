"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = document.cookie.includes("cookiesAccepted=true");
    if (!accepted) setVisible(true);
  }, []);

  function acceptCookies() {
    document.cookie = "cookiesAccepted=true; path=/; max-age=31536000";
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="
      fixed bottom-4 left-4 right-4
      max-w-3xl mx-auto
      rounded-xl p-4 shadow-lg
      border
      bg-white text-gray-800 border-gray-300
      dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700
      flex flex-col md:flex-row gap-4
      items-center justify-between
    ">
      <p className="text-sm">
        This website uses cookies to store theme preferences.
      </p>

      <button
        onClick={acceptCookies}
        className="
          px-5 py-2 rounded-lg
          bg-blue-600 text-white
          hover:bg-blue-700
          transition
        "
      >
        Accept
      </button>
    </div>
  );
}
