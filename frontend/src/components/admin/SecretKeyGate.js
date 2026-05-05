"use client";
import { useState } from "react";

export default function SecretKeyGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!input.trim()) {
      setError("Secret key cannot be empty.");
      return;
    }
    onUnlock(input.trim());
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)", // Keep overlay dark for focus
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(8px)",
      }}>
      <div
        style={{
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "16px",
          padding: "48px 40px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "var(--card-shadow)",
          color: "var(--color-text)",
        }}>
        <div
          style={{
            marginBottom: "8px",
            fontSize: "22px",
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "-0.5px",
          }}>
          🔐 Admin Access
        </div>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "14px",
            marginBottom: "28px",
          }}>
          Enter your secret key to manage profiles.
        </p>
        <input
          type="password"
          placeholder="Enter secret key..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: "10px",
            border: error
              ? "1px solid #ef4444"
              : "1px solid var(--color-border)",
            background: "var(--color-bg)",
            color: "var(--color-text)",
            fontSize: "15px",
            outline: "none",
            marginBottom: "8px",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        />
        {error && (
          <p
            style={{
              color: "#ef4444",
              fontSize: "13px",
              marginBottom: "12px",
            }}>
            {error}
          </p>
        )}
        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "13px",
            marginTop: "12px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "15px",
            cursor: "pointer",
            letterSpacing: "0.3px",
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
          Unlock Panel
        </button>
      </div>
    </div>
  );
}
