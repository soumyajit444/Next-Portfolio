"use client";
import { Mail, Phone, Link, MapPin, Calendar, Building2 } from "lucide-react";

export default function ProfileModal({ profile, onClose }) {
  if (!profile) return null;

  const fullName =
    profile.Name ||
    `${profile.FirstName || ""} ${profile.LastName || ""}`.trim();

  // ✅ Format date from YYYY-MM-DD to "MMM YYYY"
  const formatDate = (dateStr) => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // ✅ Format date range
  const formatDateRange = (start, end) => {
    const startFormatted = formatDate(start);
    const endFormatted = end ? formatDate(end) : "Present";
    return `${startFormatted} - ${endFormatted}`;
  };

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
        background: "var(--color-bg)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
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
          background: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "85vh",
          position: "relative",
          color: "var(--color-text)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Icon Only Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "transparent",
            border: "none",
            color: "var(--color-text-muted)",
            cursor: "pointer",
            padding: "8px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-border-muted)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Header - Fixed at top */}
        <div
          style={{
            padding: "32px 32px 0 32px",
            display: "flex",
            gap: "20px",
            alignItems: "center",
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
            <div
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "var(--color-text)",
              }}>
              {fullName}
            </div>

            {/* ✅ Display JobRoles as chips or primary role */}
            {profile.JobRoles?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginTop: "6px",
                }}>
                {profile.JobRoles.slice(0, 2).map((role, i) => (
                  <span
                    key={i}
                    style={{
                      padding: "2px 10px",
                      borderRadius: "12px",
                      background: "rgba(99, 102, 241, 0.1)",
                      color: "#6366f1",
                      fontSize: "11px",
                      fontWeight: 500,
                    }}>
                    {role}
                  </span>
                ))}
                {profile.JobRoles.length > 2 && (
                  <span
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "11px",
                    }}>
                    +{profile.JobRoles.length - 2} more
                  </span>
                )}
              </div>
            )}

            <div
              style={{
                color: "var(--color-text-muted)",
                fontSize: "13px",
                marginTop: "4px",
              }}>
              {profile.YearsOfExperience} years experience
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "24px 40px 32px 32px",
          }}>
          {/* ✅ Bio Section */}
          {profile.Bio && (
            <Section title="Bio">
              <p
                style={{
                  color: "var(--color-text-muted)",
                  lineHeight: "1.7",
                  fontSize: "14px",
                  whiteSpace: "pre-line",
                }}>
                {profile.Bio}
              </p>
            </Section>
          )}

          {/* ✅ Skills Section */}
          {profile.Skills?.length > 0 && (
            <Section title="Skills">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                {profile.Skills.map((s, i) => (
                  <div key={i}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                        fontSize: "13px",
                      }}>
                      <span
                        style={{ color: "var(--color-text)", fontWeight: 500 }}>
                        {s.Name}
                      </span>
                      <span style={{ color: "#6366f1", fontWeight: 600 }}>
                        {s.Rating}/10
                      </span>
                    </div>
                    <div
                      style={{
                        height: "6px",
                        width: "100%",
                        background: "var(--color-border-muted)",
                        borderRadius: "10px",
                        overflow: "hidden",
                      }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(s.Rating / 10) * 100}%`,
                          background:
                            "linear-gradient(90deg, #6366f1, #8b5cf6)",
                          borderRadius: "10px",
                          transition: "width 0.5s ease-in-out",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* ✅ Industry Tools Section */}
          {profile.IndustryTools?.length > 0 && (
            <Section title="Tools">
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {profile.IndustryTools.map((t, i) => (
                  <Tag key={i} label={t} />
                ))}
              </div>
            </Section>
          )}

          {/* ✅ Education Section */}
          {profile.Education?.length > 0 && (
            <Section title="Education">
              {profile.Education.map((e, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 16px",
                    background: "var(--color-bg)",
                    borderRadius: "10px",
                    marginBottom: "8px",
                    border: "1px solid var(--color-border)",
                  }}>
                  <div
                    style={{
                      color: "var(--color-text)",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}>
                    {e.Degree}
                  </div>
                  <div
                    style={{
                      color: "var(--color-text-muted)",
                      fontSize: "13px",
                    }}>
                    {e.Institution} · {e.PassOutYear}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ✅ Work Experience Section - NEW */}
          {profile.WorkExperience?.length > 0 && (
            <Section title="Work Experience">
              {profile.WorkExperience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px",
                    background: "var(--color-bg)",
                    borderRadius: "12px",
                    marginBottom: "12px",
                    border: "1px solid var(--color-border)",
                  }}>
                  {/* Header */}
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        color: "var(--color-text)",
                        fontWeight: 600,
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}>
                      {exp.Role}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "#6366f1",
                        fontSize: "13px",
                        fontWeight: 500,
                      }}>
                      <Building2 size={14} />
                      {exp.CompanyName}
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      marginBottom: "10px",
                      fontSize: "12px",
                      color: "var(--color-text-muted)",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}>
                      <Calendar size={14} />
                      {formatDateRange(exp.StartDate, exp.EndDate)}
                    </div>
                    {exp.WorkLocation && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}>
                        <MapPin size={14} />
                        {exp.WorkLocation}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {exp.Description && (
                    <p
                      style={{
                        color: "var(--color-text-muted)",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        marginBottom: "10px",
                        whiteSpace: "pre-line",
                      }}>
                      {exp.Description}
                    </p>
                  )}

                  {/* Key Skills */}
                  {exp.KeySkills?.length > 0 && (
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {exp.KeySkills.map((skill, j) => (
                        <span
                          key={j}
                          style={{
                            padding: "3px 10px",
                            borderRadius: "14px",
                            background: "rgba(99, 102, 241, 0.1)",
                            color: "#6366f1",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ✅ Address Section - NEW */}
          {(profile.Address?.Street ||
            profile.Address?.City ||
            profile.Address?.State ||
            profile.Address?.Country) && (
            <Section title="Location">
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "var(--color-text-muted)",
                  fontSize: "13px",
                }}>
                <MapPin size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div style={{ lineHeight: "1.6" }}>
                  {profile.Address.Street && (
                    <div>{profile.Address.Street}</div>
                  )}
                  {[
                    profile.Address.State,
                    profile.Address.Pin,
                    profile.Address.Country,
                  ]
                    .filter(Boolean)
                    .join(", ") && (
                    <div>
                      {[
                        profile.Address.State,
                        profile.Address.Pin,
                        profile.Address.Country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {/* ✅ Contact Section */}
          {profile.ContactInfo && (
            <Section title="Contact">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}>
                {profile.ContactInfo.Email && (
                  <a
                    href={`mailto:${profile.ContactInfo.Email}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "var(--color-text-muted)",
                      fontSize: "13px",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#6366f1")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-text-muted)")
                    }>
                    <Mail size={16} />
                    <span>{profile.ContactInfo.Email}</span>
                  </a>
                )}

                {profile.ContactInfo.PhoneNo && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "var(--color-text-muted)",
                      fontSize: "13px",
                    }}>
                    <Phone size={16} />
                    <span>{profile.ContactInfo.PhoneNo}</span>
                  </div>
                )}

                {profile.ContactInfo.LinkedIn && (
                  <a
                    href={
                      profile.ContactInfo.LinkedIn.startsWith("http")
                        ? profile.ContactInfo.LinkedIn
                        : `https://${profile.ContactInfo.LinkedIn}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "var(--color-text-muted)",
                      fontSize: "13px",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#0077b5")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--color-text-muted)")
                    }>
                    <Link size={16} />
                    <span>
                      {profile.ContactInfo.LinkedIn.replace(
                        /(^\w+:|^)\/\//,
                        "",
                      )}
                    </span>
                  </a>
                )}
              </div>
            </Section>
          )}

          {/* ✅ Hobbies Section */}
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
    </div>
  );
}
