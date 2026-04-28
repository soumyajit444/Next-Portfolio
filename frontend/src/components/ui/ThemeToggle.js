"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved =
      localStorage.getItem("theme") ||
      document.documentElement.getAttribute("data-theme") ||
      "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 13px 6px 10px",
        borderRadius: "1rem",
        background: "transparent",
        color: "var(--color-text)",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "0.09em",
        cursor: "pointer",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
        border: "none",
        transition: "background 0.2s, color 0.2s",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--color-text)";
        e.currentTarget.style.color = "var(--color-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--color-text)";
      }}>
      {isDark ? <SunIcon /> : <MoonIcon />}
      {isDark ? "LIGHT" : "DARK"}
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
