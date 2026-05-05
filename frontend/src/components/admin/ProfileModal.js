"use client";

export default function ProfileModal({ profile, onClose }) {
  if (!profile) return null;
  const fullName =
    profile.Name ||
    `${profile.FirstName || ""} ${profile.LastName || ""}`.trim();

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: "24px" }}>
      <div
        style={{
          fontSize: "11px",
          letterSpacing: "1.5px",
          color: "#6366f1",
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: "10px",
        }}>
        {title}
      </div>
      {children}
    </div>
  );

  const Tag = ({ label }) => (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "20px",
        background: "#1a1a2e",
        border: "1px solid #2a2a4a",
        color: "#a5b4fc",
        fontSize: "12px",
        fontWeight: 500,
      }}>
      {label}
    </span>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 9000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}>
      <div
        style={{
          background: "#0d0d0d",
          border: "1px solid #1e1e1e",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "85vh",
          overflowY: "auto",
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
          ✕ Close
        </button>

        {/* Header */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "center",
            marginBottom: "32px",
          }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}>
            {fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff" }}>
              {fullName}
            </div>
            <div
              style={{ color: "#6366f1", fontWeight: 500, marginTop: "4px" }}>
              {profile.CurrentJobRole}
            </div>
            <div style={{ color: "#555", fontSize: "13px", marginTop: "2px" }}>
              {profile.YearsOfExperience} years experience
            </div>
          </div>
        </div>

        {profile.Bio && (
          <Section title="Bio">
            <p style={{ color: "#999", lineHeight: "1.7", fontSize: "14px" }}>
              {profile.Bio}
            </p>
          </Section>
        )}

        {profile.Skills?.length > 0 && (
          <Section title="Skills">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {profile.Skills.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "20px",
                    background: "#1a1a2e",
                    border: "1px solid #2a2a4a",
                  }}>
                  <span style={{ color: "#a5b4fc", fontSize: "13px" }}>
                    {s.Name}
                  </span>
                  <span
                    style={{
                      color: "#6366f1",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}>
                    {s.Rating}/10
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {profile.IndustryTools?.length > 0 && (
          <Section title="Tools">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {profile.IndustryTools.map((t, i) => (
                <Tag key={i} label={t} />
              ))}
            </div>
          </Section>
        )}

        {profile.Education?.length > 0 && (
          <Section title="Education">
            {profile.Education.map((e, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  background: "#111",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  border: "1px solid #1e1e1e",
                }}>
                <div
                  style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
                  {e.Degree}
                </div>
                <div style={{ color: "#888", fontSize: "13px" }}>
                  {e.Institution} · {e.PassOutYear}
                </div>
              </div>
            ))}
          </Section>
        )}

        {profile.ContactInfo && (
          <Section title="Contact">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {profile.ContactInfo.Email && (
                <span style={{ color: "#888", fontSize: "13px" }}>
                  📧 {profile.ContactInfo.Email}
                </span>
              )}
              {profile.ContactInfo.PhoneNo && (
                <span style={{ color: "#888", fontSize: "13px" }}>
                  📞 {profile.ContactInfo.PhoneNo}
                </span>
              )}
              {profile.ContactInfo.LinkedIn && (
                <span style={{ color: "#888", fontSize: "13px" }}>
                  💼 {profile.ContactInfo.LinkedIn}
                </span>
              )}
            </div>
          </Section>
        )}

        {profile.Hobbies?.length > 0 && (
          <Section title="Hobbies">
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {profile.Hobbies.map((h, i) => (
                <Tag key={i} label={h} />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
