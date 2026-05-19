"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";

/* ─── viewport reveal hook ─── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const inView = useInView(ref, {
    once: false,
    amount: threshold,
    margin: "-50px 0px -50px 0px",
  });
  return { ref, inView };
}

/* ─── MOTION VARIANTS ─── */
const dropFromTop = (d = 0) => ({
  hidden: { opacity: 0, y: -100, scale: 0.9, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20, delay: d },
  },
});

const slideFromRight = (d = 0) => ({
  hidden: { opacity: 0, x: 100, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut", delay: d },
  },
});

const riseFromBottom = (d = 0) => ({
  hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut", delay: d },
  },
});

/* ── glass card ─── */
function Card({ children, style = {}, variants, animate, className = "" }) {
  return (
    <motion.div
      variants={variants}
      animate={animate}
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        width: "100%",
        border: "1px solid rgba(139, 92, 246, 0.1)",
        background: "var(--glass-bg)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        /* Cards are flex-column by default so content fills height */
        display: "flex",
        flexDirection: "column",
        ...style,
      }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 40%)",
          zIndex: 1,
        }}
      />
      <div
        className="relative z-10 h-full w-full"
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}>
        {children}
      </div>
    </motion.div>
  );
}

/* ─── section label ─── */
function SectionLabel({ children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        flexShrink: 0,
      }}>
      <div
        style={{
          width: 12,
          height: 2,
          borderRadius: 99,
          background: "#8b5cf6",
        }}
      />
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#8b5cf6",
        }}>
        {children}
      </span>
    </div>
  );
}

/* ─── Skill Bar ─── */
function SkillBar({ label, pct, delay, shouldAnimate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        marginBottom: 10,
        flexShrink: 0,
      }}>
      <span
        className="profile-skill-label"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-text)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
        {label}
      </span>
      <div
        style={{
          width: "100%",
          height: 4,
          borderRadius: 99,
          background: "rgba(139, 92, 246, 0.1)",
          overflow: "hidden",
        }}>
        <motion.div
          animate={{ width: shouldAnimate ? `${pct}%` : "0%" }}
          transition={{ duration: 0.8, ease: "easeOut", delay }}
          style={{
            height: "100%",
            borderRadius: 99,
            background: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
          }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
const Profile = ({ profile }) => {
  const fullName =
    `${profile?.FirstName || ""} ${profile?.LastName || ""}`.trim();
  const avatarUrl = profile?.ProfilePicture?.url;
  const jobRole = profile?.CurrentJobRole || "Developer";
  const bioText = profile?.Bio || "No bio available.";
  const initials =
    `${profile?.FirstName?.[0] || ""}${profile?.LastName?.[0] || ""}`.toUpperCase();

  const skillsData =
    profile?.Skills?.map((s) => ({
      label: s.Name,
      pct: (s.Rating / 10) * 100,
    })) || [];
  const hobbiesData = profile?.Hobbies || [];
  const educationData = profile?.Education || [];
  const addr = profile?.Address || {};
  const addressString = `${addr.Street || ""}, ${addr.State || ""} ${addr.Pin || ""}, ${addr.Country || ""}`;

  const bioR = useReveal(0.2);
  const profileR = useReveal(0.1);
  const hobbiesR = useReveal(0.1);
  const skillsR = useReveal(0.1);
  const eduR = useReveal(0.1);
  const addrR = useReveal(0.1);

  const GAP = 16;

  return (
    <>
      <style>{`
        /* ─── Scrollbar styling ─── */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.25);
          border-radius: 99px;
        }

        /* ══════════════════════════════
           WRAPPER
        ══════════════════════════════ */
        .profile-wrapper {
          width: 100%;
          min-height: 100vh;
          padding: 80px 20px 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-family: var(--font-primary);
          color: var(--color-text);
          box-sizing: border-box;
        }

        .profile-inner {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
        }

        /* ══════════════════════════════
           TOP ROW  — Profile | Bio
        ══════════════════════════════ */
        .profile-top-row {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: ${GAP}px;
          align-items: stretch;
        }

        /* Make both top-row children fill the row height */
        .profile-top-row > * {
          height: 100%;
        }

        /* ══════════════════════════════
           BOTTOM ROW — Hobbies | Skills | Right-col
        ══════════════════════════════ */
        .profile-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: ${GAP}px;
          /* CRITICAL: all cells equal height */
          align-items: stretch;
          /* Fixed row height so hobbies == skills always */
          height: 300px;
        }

        /* Every direct child of the bottom row must fill cell height */
        .profile-bottom-row > * {
          height: 100%;
          min-height: 0;
        }

        /* Right column: flex column, splits edu + location */
        .profile-right-col {
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
          height: 100%;
          min-height: 0;
        }

        .profile-edu-wrap {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .profile-addr-wrap {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
        }

        /* Cards inside bottom row must fill 100% */
        .profile-hobbies-col,
        .profile-skills-col {
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .profile-hobbies-col > *,
        .profile-skills-col > * {
          height: 100%;
          flex: 1;
        }

        .profile-edu-wrap > * {
          height: 100%;
          flex: 1;
        }

        /* ══════════════════════════════
           TABLET  640 – 1024px
        ══════════════════════════════ */
        @media (max-width: 1024px) and (min-width: 640px) {
          .profile-wrapper {
            padding: 80px 20px 60px;
            align-items: center;
          }
          .profile-top-row {
            grid-template-columns: 180px 1fr;
          }
          .profile-bottom-row {
            grid-template-columns: 1fr 1fr 1fr;
            height: 280px;
          }
        }

        /* ══════════════════════════════
           MOBILE  < 640px
           Stack order:
           1. Profile card   (full width, fixed height)
           2. Bio            (full width, fixed height + scroll)
           3. Hobbies | Skills  (2 cols, fixed height + scroll)
           4. Education      (full width, fixed height + scroll)
           5. Location       (full width, auto height)
        ══════════════════════════════ */
        @media (max-width: 639px) {
          .profile-wrapper {
            padding: 70px 12px 40px;
            align-items: flex-start;
          }

          .profile-inner {
            gap: 12px;
          }

          /* Top row → single column */
          .profile-top-row {
            grid-template-columns: 1fr;
            height: auto;
          }

          .profile-top-row > * {
            height: auto;
          }

          /* Profile card compact */
          .profile-card-mobile {
            min-height: 0 !important;
            padding: 16px !important;
          }

          /* Bio card fixed height */
          .profile-bio-card-mobile {
            height: 110px !important;
          }

        
          .profile-bottom-row {
            grid-template-columns: 1fr 1fr;
            height: auto;
            grid-template-rows: 190px auto;
          }

          .profile-hobbies-col { grid-column: 1; grid-row: 1; height: 190px; }
          .profile-skills-col  { grid-column: 2; grid-row: 1; height: 190px; }

          /* Right col: row 2, spans both columns, unconstrained */
          .profile-right-col {
            grid-column: 1 / -1;
            grid-row: 2;
            height: auto;
            flex-direction: column;
            gap: 12px;
          }

          .profile-edu-wrap {
            height: 130px;
            flex: unset;
          }

          .profile-addr-wrap {
            height: auto;
            flex: unset;
          }

          /* ── Text size reductions ── */
          .profile-name       { font-size: 15px !important; }
          .profile-role       { font-size: 10px !important; }
          .profile-bio-txt    { font-size: 11px !important; line-height: 1.5 !important; }
          .profile-hobby      { font-size: 10px !important; padding: 6px 9px !important; }
          .profile-skill-label{ font-size: 9px  !important; }
          .profile-edu-degree { font-size: 11px !important; }
          .profile-edu-inst   { font-size: 9px  !important; }
          .profile-addr-txt   { font-size: 11px !important; }
        }
      `}</style>

      <div className="profile-wrapper">
        <div className="profile-inner">
          {/* ══ TOP ROW: Profile + Bio ══ */}
          <div className="profile-top-row">
            {/* PROFILE CARD */}
            <div
              ref={profileR.ref}
              style={{ display: "flex", flexDirection: "column" }}>
              <Card
                variants={dropFromTop(0)}
                animate={profileR.inView ? "show" : "hidden"}
                style={{
                  padding: "20px",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  flex: 1,
                }}
                className="profile-card-inner profile-card-mobile">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(139,92,246,0.4)",
                      boxShadow: "0 8px 20px -5px rgba(124,58,237,0.4)",
                      marginBottom: 10,
                      marginLeft: "auto",
                      marginRight: "auto",
                      display: "block",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: 10,
                      boxShadow: "0 8px 20px -5px rgba(124, 58, 237, 0.4)",
                      flexShrink: 0,
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}>
                    {initials}
                  </div>
                )}
                <h2
                  className="profile-name"
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    margin: "0 0 4px",
                    color: "var(--color-text)",
                  }}>
                  {fullName}
                </h2>
                <p
                  className="profile-role"
                  style={{
                    fontSize: 11,
                    color: "#8b5cf6",
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}>
                  {jobRole}
                </p>
              </Card>
            </div>

            {/* BIO CARD */}
            <div
              ref={bioR.ref}
              style={{ display: "flex", flexDirection: "column" }}>
              <Card
                variants={slideFromRight(0.1)}
                animate={bioR.inView ? "show" : "hidden"}
                style={{
                  padding: "20px",
                  flex: 1,
                }}
                className="profile-bio-card-mobile">
                <SectionLabel>My Bio</SectionLabel>
                {/* Scrollable bio text */}
                <div
                  style={{
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0,
                    paddingRight: 4,
                  }}
                  className="custom-scroll">
                  <p
                    className="profile-bio-txt"
                    style={{
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "var(--color-text-muted)",
                      margin: 0,
                    }}>
                    {bioText}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* ══ BOTTOM ROW ══ */}
          <div className="profile-bottom-row">
            {/* HOBBIES */}
            <div ref={hobbiesR.ref} className="profile-hobbies-col">
              <Card
                variants={riseFromBottom(0.1)}
                animate={hobbiesR.inView ? "show" : "hidden"}
                style={{ padding: "16px" }}>
                <SectionLabel>Hobbies</SectionLabel>
                {/* Scrollable list */}
                <div
                  style={{
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0,
                    paddingRight: 4,
                  }}
                  className="custom-scroll">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}>
                    {hobbiesData.length > 0 ? (
                      hobbiesData.map((h, i) => (
                        <div
                          key={i}
                          className="profile-hobby"
                          style={{
                            padding: "8px 12px",
                            background: "rgba(139, 92, 246, 0.05)",
                            borderRadius: "8px",
                            border: "1px solid rgba(139, 92, 246, 0.12)",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "var(--color-text)",
                            flexShrink: 0,
                          }}>
                          {h}
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          fontSize: 11,
                          color: "var(--color-text-muted)",
                        }}>
                        No hobbies listed.
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* SKILLS */}
            <div ref={skillsR.ref} className="profile-skills-col">
              <Card
                variants={riseFromBottom(0.2)}
                animate={skillsR.inView ? "show" : "hidden"}
                style={{ padding: "16px" }}>
                <SectionLabel>Technical Skills</SectionLabel>
                {/* Scrollable skill bars */}
                <div
                  style={{
                    overflowY: "auto",
                    flex: 1,
                    minHeight: 0,
                    paddingRight: 4,
                  }}
                  className="custom-scroll">
                  {skillsData.length > 0 ? (
                    skillsData.map((s, i) => (
                      <SkillBar
                        key={s.label}
                        label={s.label}
                        pct={s.pct}
                        delay={i * 0.05}
                        shouldAnimate={skillsR.inView}
                      />
                    ))
                  ) : (
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-muted)",
                      }}>
                      No skills listed.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT COL: Education + Location */}
            <div className="profile-right-col">
              {/* EDUCATION */}
              <div ref={eduR.ref} className="profile-edu-wrap">
                <Card
                  variants={riseFromBottom(0.3)}
                  animate={eduR.inView ? "show" : "hidden"}
                  style={{ padding: "16px", flex: 1 }}>
                  <SectionLabel>Education</SectionLabel>
                  {/* Scrollable education list */}
                  <div
                    style={{
                      overflowY: "auto",
                      flex: 1,
                      minHeight: 0,
                      paddingRight: 4,
                    }}
                    className="custom-scroll">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}>
                      {educationData.length > 0 ? (
                        educationData.map((edu, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 8,
                              alignItems: "flex-start",
                              flexShrink: 0,
                            }}>
                            <div
                              style={{
                                marginTop: 2,
                                color: "#8b5cf6",
                                flexShrink: 0,
                              }}>
                              <GraduationCap size={13} />
                            </div>
                            <div>
                              <div
                                className="profile-edu-degree"
                                style={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "var(--color-text)",
                                  lineHeight: 1.3,
                                }}>
                                {edu.Degree}
                              </div>
                              <div
                                className="profile-edu-inst"
                                style={{
                                  fontSize: 10,
                                  color: "var(--color-text-muted)",
                                  marginTop: 2,
                                  lineHeight: 1.4,
                                }}>
                                {edu.Institution}
                              </div>
                              <div
                                style={{
                                  fontSize: 9,
                                  color: "#8b5cf6",
                                  marginTop: 2,
                                  fontWeight: 600,
                                }}>
                                {edu.PassOutYear}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--color-text-muted)",
                          }}>
                          No education details.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* LOCATION */}
              <div ref={addrR.ref} className="profile-addr-wrap">
                <Card
                  variants={riseFromBottom(0.4)}
                  animate={addrR.inView ? "show" : "hidden"}
                  style={{
                    padding: "14px 16px",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}>
                  <SectionLabel>Location</SectionLabel>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}>
                    <div
                      style={{ color: "#8b5cf6", flexShrink: 0, marginTop: 1 }}>
                      <MapPin size={15} />
                    </div>
                    <p
                      className="profile-addr-txt"
                      style={{
                        fontSize: 11,
                        color: "var(--color-text-muted)",
                        lineHeight: 1.45,
                        margin: 0,
                      }}>
                      {addressString || "No address provided."}
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
