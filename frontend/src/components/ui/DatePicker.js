"use client";
import React from "react";

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  id,
}) {
  return (
    <input
      id={id}
      type="date"
      value={value || ""}
      onChange={(e) => onChange?.(e.target.value)}
      min={minDate}
      max={maxDate}
      placeholder={placeholder}
      style={{
        display: "block",
        width: "100%",
        padding: "0.6rem 0.7rem",
        backgroundColor: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        color: "inherit",
        transition: "background-color 0.2s, border-color 0.2s, color 0.2s",
        cursor: "pointer",
      }}
    />
  );
}
