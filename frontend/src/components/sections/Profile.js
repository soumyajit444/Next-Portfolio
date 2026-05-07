"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";

/* ─── viewport reveal hook ─── 
    Modified to support toggling back and forth 
*/
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  // removed 'once: true' so it triggers every time
  const inView = useInView(ref, {
    once: false,
    amount: threshold,
    margin: "-50px 0px -50px 0px", // Triggers slightly before/after element hits edge
  });

  return { ref, inView };
}

/* ─── MOTION VARIANTS ─── */

// 1. Drop From Top (For Profile Card)
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

// 2. Slide From Right (For Bio Card)
const slideFromRight = (d = 0) => ({
  hidden: { opacity: 0, x: 100, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: "easeOut", delay: d },
  },
});

// 3. Rise From Bottom (For Bottom Row Cards)
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
function Card({
  children,
  style = {},
  variants,
  animate,
  initial,
  className = "",
}) {
  return (
    <motion.div
      variants={variants}
      animate={animate}
      initial={initial} // Ensure we define initial state explicitly if needed, though 'hidden' variant handles it
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        width: "100%",
        border: "1px solid rgba(139, 92, 246, 0.1)",
        background: "var(--glass-bg)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        ...style,
      }}>
      {/* Subtle glare */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 40%)",
          zIndex: 1,
        }}
      />
      <div className="relative z-10 h-full w-full">{children}</div>
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
        marginBottom: 12,
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

/* ─── Skill Bar (No Percentage Text) ─── */
function SkillBar({ label, pct, delay, shouldAnimate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 12,
      }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--color-text)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
          {label}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 4,
          borderRadius: 99,
          background: "rgba(139, 92, 246, 0.1)",
          overflow: "hidden",
        }}>
        <motion.div
          // We control the width directly via animate prop based on visibility
          animate={{ width: shouldAnimate ? `${pct}%` : "0%" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: delay }}
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
  /* ── DATA PREPARATION ── */
  const fullName =
    `${profile?.FirstName || ""} ${profile?.LastName || ""}`.trim();
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

  /* REVEAL HOOKS 
     These now return { ref, inView } instead of controls
  */
  const bioR = useReveal(0.2);
  const profileR = useReveal(0.1);
  const hobbiesR = useReveal(0.1);
  const skillsR = useReveal(0.1);
  const eduR = useReveal(0.1);
  const addrR = useReveal(0.1);

  const UNIFORM_GAP = 20;

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        padding: "15vh 20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "var(--font-primary)",
        color: "var(--color-text)",
        boxSizing: "border-box",
        overflow: "hidden",
      }}>
      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          height: "100%",
          display: "grid",
          gridTemplateRows: "2fr 3fr",
          gap: UNIFORM_GAP,
        }}>
        {/* ─ TOP ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 3fr",
            gap: UNIFORM_GAP,
            minHeight: 0,
          }}>
          {/* PROFILE CARD */}
          <div ref={profileR.ref} style={{ height: "100%" }}>
            <Card
              variants={dropFromTop(0)}
              // If inView is true, animate to 'show', else animate to 'hidden'
              animate={profileR.inView ? "show" : "hidden"}
              style={{
                padding: "24px",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
              }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 12,
                  boxShadow: "0 8px 20px -5px rgba(124, 58, 237, 0.4)",
                  margin: "0 auto 12px auto",
                }}>
                {initials}
              </div>

              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: "0 0 4px",
                  color: "var(--color-text)",
                }}>
                {fullName}
              </h2>
              <p
                style={{
                  fontSize: 12,
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
          <div ref={bioR.ref} style={{ height: "100%", width: "100%" }}>
            <Card
              variants={slideFromRight(0.1)}
              animate={bioR.inView ? "show" : "hidden"}
              style={{
                padding: "24px",
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}>
              <SectionLabel>My Bio</SectionLabel>
              <div
                style={{
                  overflowY: "auto",
                  flex: 1,
                  width: "100%",
                }}
                className="custom-scroll">
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "var(--color-text-muted)",
                    margin: 0,
                    width: "100%",
                    textAlign: "left",
                  }}>
                  {bioText}
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: UNIFORM_GAP,
            minHeight: 0,
          }}>
          {/* LEFT: HOBBIES */}
          <div
            ref={hobbiesR.ref}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}>
            <Card
              variants={riseFromBottom(0.1)}
              animate={hobbiesR.inView ? "show" : "hidden"}
              style={{
                padding: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
              <SectionLabel>Hobbies</SectionLabel>
              <div
                style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}
                className="custom-scroll">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {hobbiesData.length > 0 ? (
                    hobbiesData.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          padding: "10px 14px",
                          background: "rgba(139, 92, 246, 0.05)",
                          borderRadius: "8px",
                          border: "1px solid rgba(139, 92, 246, 0.1)",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--color-text)",
                        }}>
                        {h}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                      }}>
                      No hobbies listed.
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* MIDDLE: SKILLS */}
          <div
            ref={skillsR.ref}
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}>
            <Card
              variants={riseFromBottom(0.2)}
              animate={skillsR.inView ? "show" : "hidden"}
              style={{
                padding: "20px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}>
              <SectionLabel>Technical Skills</SectionLabel>
              <div
                style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}
                className="custom-scroll">
                {skillsData.length > 0 ? (
                  skillsData.map((s, i) => (
                    <SkillBar
                      key={s.label}
                      label={s.label}
                      pct={s.pct}
                      delay={i * 0.05}
                      shouldAnimate={skillsR.inView} // Pass visibility to skill bar
                    />
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
                    No skills listed.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT: EDUCATION & LOCATION STACKED */}
          <div
            style={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              gap: UNIFORM_GAP,
            }}>
            {/* EDUCATION */}
            <div ref={eduR.ref} style={{ flex: 1, minHeight: 0 }}>
              <Card
                variants={riseFromBottom(0.3)}
                animate={eduR.inView ? "show" : "hidden"}
                style={{
                  padding: "20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}>
                <SectionLabel>Education</SectionLabel>
                <div
                  style={{ overflowY: "auto", flex: 1, paddingRight: "8px" }}
                  className="custom-scroll">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}>
                    {educationData.length > 0 ? (
                      educationData.map((edu, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "flex-start",
                          }}>
                          <div
                            style={{
                              marginTop: 2,
                              color: "#8b5cf6",
                              flexShrink: 0,
                            }}>
                            <GraduationCap size={14} />
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: "var(--color-text)",
                              }}>
                              {edu.Degree}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: "var(--color-text-muted)",
                                marginTop: 2,
                              }}>
                              {edu.Institution}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#8b5cf6",
                                marginTop: 2,
                              }}>
                              {edu.PassOutYear}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          fontSize: 12,
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
            <div ref={addrR.ref} style={{ flex: 0.6, minHeight: 0 }}>
              <Card
                variants={riseFromBottom(0.4)}
                animate={addrR.inView ? "show" : "hidden"}
                style={{
                  padding: "20px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}>
                <SectionLabel>Location</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ color: "#8b5cf6", flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--color-text-muted)",
                      lineHeight: 1.4,
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
  );
};

export default Profile;
