"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme =
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "light";

    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        className="relative w-20 h-10 rounded-full flex items-center px-1 transition-all duration-300 shadow-md"
        style={{
          background: isDark ? "#2a2a2a" : "#e5e5e5",
        }}>
        {/* ICONS */}
        <div className="absolute left-3 text-sm">🌙</div>
        <div className="absolute right-3 text-sm">☀️</div>

        {/* TOGGLE KNOB */}
        <div
          className={`w-8 h-8 rounded-full bg-white shadow-md transform transition-all duration-300 ${
            isDark ? "translate-x-10" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
