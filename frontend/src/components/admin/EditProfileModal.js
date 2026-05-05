"use client";
import { useState } from "react";
import { updateProfile } from "@/services/profileService";

export default function EditProfileModal({
  profile,
  secret,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    Name:
      profile.Name ||
      `${profile.FirstName || ""} ${profile.LastName || ""}`.trim(),
    CurrentJobRole: profile.CurrentJobRole || "",
    Bio: profile.Bio || "",
    YearsOfExperience: profile.YearsOfExperience || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await updateProfile(profile.profileSlug, form, secret);
      onSuccess();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || "Update failed. Check your secret key.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid #2a2a2a",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "14px",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}>
      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid #2a2a2a",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "500px",
          padding: "40px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "#1a1a1a",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
            color: "#aaa",
            padding: "6px 12px",
            cursor: "pointer",
            fontSize: "13px",
          }}>
          ✕
        </button>

        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "24px",
          }}>
          Edit Profile
        </div>

        <label
          style={{
            color: "#666",
            fontSize: "12px",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "6px",
          }}>
          FULL NAME
        </label>
        <input
          style={inputStyle}
          value={form.Name}
          onChange={(e) => setForm({ ...form, Name: e.target.value })}
        />

        <label
          style={{
            color: "#666",
            fontSize: "12px",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "6px",
          }}>
          JOB ROLE
        </label>
        <input
          style={inputStyle}
          value={form.CurrentJobRole}
          onChange={(e) => setForm({ ...form, CurrentJobRole: e.target.value })}
        />

        <label
          style={{
            color: "#666",
            fontSize: "12px",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "6px",
          }}>
          BIO
        </label>
        <textarea
          style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
          value={form.Bio}
          onChange={(e) => setForm({ ...form, Bio: e.target.value })}
        />

        <label
          style={{
            color: "#666",
            fontSize: "12px",
            letterSpacing: "1px",
            display: "block",
            marginBottom: "6px",
          }}>
          YEARS OF EXPERIENCE
        </label>
        <input
          style={inputStyle}
          type="number"
          value={form.YearsOfExperience}
          onChange={(e) =>
            setForm({ ...form, YearsOfExperience: e.target.value })
          }
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

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #2a2a2a",
              background: "transparent",
              color: "#aaa",
              cursor: "pointer",
              fontSize: "14px",
            }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 2,
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "14px",
              opacity: loading ? 0.7 : 1,
            }}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
