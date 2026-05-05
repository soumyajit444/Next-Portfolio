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
        background: "#111",
        border: "1px solid #1e1e1e",
        borderRadius: "16px",
        padding: "28px 24px",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1e1e1e";
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
          color: "#fff",
          marginBottom: "4px",
        }}>
        {fullName}
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "#6366f1",
          marginBottom: "8px",
          fontWeight: 500,
        }}>
        {profile.CurrentJobRole || "—"}
      </div>
      <div style={{ fontSize: "13px", color: "#555", marginBottom: "4px" }}>
        {profile.YearsOfExperience
          ? `${profile.YearsOfExperience} yrs exp`
          : ""}
      </div>
      <div style={{ fontSize: "12px", color: "#444" }}>
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
            border: "1px solid #2a2a2a",
            background: "transparent",
            color: "#aaa",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.color = "#6366f1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#aaa";
          }}>
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(profile)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #2a2a2a",
            background: "transparent",
            color: "#aaa",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#2a2a2a";
            e.currentTarget.style.color = "#aaa";
          }}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}
