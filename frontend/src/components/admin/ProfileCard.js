"use client";

export default function ProfileCard({ profile, onView, onEdit, onDelete }) {
  const fullName =
    profile.Name ||
    `${profile.FirstName || ""} ${profile.LastName || ""}`.trim();
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={() => onView(profile)}
      style={{
        background: "var(--color-bg)", // Dynamic Background
        border: "1px solid var(--color-border)", // Dynamic Border
        borderRadius: "16px",
        padding: "28px 24px",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        position: "relative",
        overflow: "hidden",
        color: "var(--color-text)", // Ensure text inherits correctly
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1"; // Keep accent color fixed or use var(--color-accent)
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}>
      {/* Avatar */}
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "22px",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "16px",
          flexShrink: 0,
        }}>
        {profile.ProfilePicture ? (
          <img
            src={profile.ProfilePicture}
            alt={fullName}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          initials
        )}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: "17px",
          color: "var(--color-text)", // Dynamic Text
          marginBottom: "4px",
        }}>
        {fullName}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "#6366f1", // Accent Color
          marginBottom: "8px",
          fontWeight: 500,
        }}>
        {profile.CurrentJobRole || "—"}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--color-text-muted)", // Muted Text
          marginBottom: "4px",
        }}>
        {profile.YearsOfExperience
          ? `${profile.YearsOfExperience} yrs exp`
          : ""}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "var(--color-text-muted)", // Muted Text
        }}>
        {profile.profileSlug}
      </div>

      {/* Action Buttons */}
      <div
        style={{ display: "flex", gap: "8px", marginTop: "20px" }}
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onEdit(profile)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-text-muted)",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.color = "#6366f1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}>
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(profile)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid var(--color-border)",
            background: "transparent",
            color: "var(--color-text-muted)",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
