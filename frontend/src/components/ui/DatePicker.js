"use client";
import React from "react";

export default function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  id,
  className = "",
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
      className={`block w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-500 transition-colors cursor-pointer ${className}`}
    />
  );
}
