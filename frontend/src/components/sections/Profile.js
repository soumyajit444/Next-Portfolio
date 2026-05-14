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
        ...style,
      }}
    >
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
      }}
    >
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
        }}
      >
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
        gap: 6,
        marginBottom: 12,
      }}
    >
      <span
        className="profile-skill-label"
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--color-text)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: "100%",
          height: 4,
          borderRadius: 99,
          background: "rgba(139, 92, 246, 0.1)",
          overflow: "hidden",
        }}
      >
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

  const GAP = 20;

  return (
    <>
      {/* ── Responsive styles injected once ── */}
      <style>{`
        .profile-wrapper {
          width: 100%;
          padding: 15vh 20px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
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

        /* ── TOP ROW ── */
        .profile-top-row {
          display: grid;
          grid-template-columns: 1fr 3fr;
          gap: ${GAP}px;
        }

        /* ── BOTTOM ROW ── Desktop: 3 columns */
        .profile-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: ${GAP}px;
        }

        /* Right column in bottom row: stacked edu + location */
        .profile-right-col {
          display: flex;
          flex-direction: column;
          gap: ${GAP}px;
        }

        /* ── TABLET (640px – 1024px) ── */
        @media (max-width: 1024px) and (min-width: 640px) {
          .profile-wrapper {
            padding: 10vh 24px;
            align-items: flex-start;
            height: auto;
            min-height: 100vh;
          }

          /* Top row: profile card narrower, bio takes rest */
          .profile-top-row {
            grid-template-columns: 160px 1fr;
          }

          /* Bottom row: 3 columns still fit on tablet */
          .profile-bottom-row {
            grid-template-columns: 1fr 1fr 1fr;
          }

          .profile-card-inner {
            padding: 20px !important;
          }
        }

        /* ── MOBILE (< 640px) ──
           Layout:
           1. Profile card  (full width)
           2. Bio           (full width)
           3. Hobbies + Skills side by side (2 cols)
           4. Education     (full width)
           5. Location      (full width)
        */
        @media (max-width: 639px) {
          .profile-wrapper {
            padding: 80px 14px 48px;
            align-items: flex-start;
            height: auto;
            min-height: 100vh;
          }

          /* Top row → single column stack */
          .profile-top-row {
            grid-template-columns: 1fr;
          }

          /* Bottom row → 2 cols for hobbies+skills, right-col spans full width below */
          .profile-bottom-row {
            grid-template-columns: 1fr 1fr;
          }

          .profile-hobbies-col { grid-column: 1; }
          .profile-skills-col  { grid-column: 2; }

          /* Right col spans both columns, stacks edu + location vertically */
          .profile-right-col {
            grid-column: 1 / -1;
            flex-direction: column;
          }

          /* Right col children must grow to fill */
          .profile-edu-wrap,
          .profile-addr-wrap {
            flex: unset !important;
            width: 100%;
            min-width: 0;
          }

          /* Tighten text sizes on mobile */
          .profile-name    { font-size: 15px !important; }
          .profile-role    { font-size: 10px !important; }
          .profile-bio-txt { font-size: 12px !important; line-height: 1.55 !important; }
          .profile-hobby   { font-size: 11px !important; padding: 8px 10px !important; }
          .profile-skill-label { font-size: 10px !important; }
          .profile-edu-degree  { font-size: 11px !important; }
          .profile-edu-inst    { font-size: 10px !important; }
          .profile-addr-txt    { font-size: 11px !important; }
        }
      `}</style>

      <div className="profile-wrapper">
        <div className="profile-inner">
          {/* ── TOP ROW: Profile + Bio ── */}
          <div className="profile-top-row">
            {/* PROFILE CARD */}
            <div ref={profileR.ref}>
              <Card
                variants={dropFromTop(0)}
                animate={profileR.inView ? "show" : "hidden"}
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  minHeight: 180,
                }}
                className="profile-card-inner"
              >
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
                    flexShrink: 0,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  {initials}
                </div>
                <h2
                  className="profile-name"
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    margin: "0 0 4px",
                    color: "var(--color-text)",
                  }}
                >
                  {fullName}
                </h2>
                <p
                  className="profile-role"
                  style={{
                    fontSize: 12,
                    color: "#8b5cf6",
                    fontWeight: 600,
                    margin: 0,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {jobRole}
                </p>
              </Card>
            </div>

            {/* BIO CARD */}
            <div ref={bioR.ref}>
              <Card
                variants={slideFromRight(0.1)}
                animate={bioR.inView ? "show" : "hidden"}
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  minHeight: 180,
                }}
              >
                <SectionLabel>My Bio</SectionLabel>
                <div
                  style={{ overflowY: "auto", flex: 1 }}
                  className="custom-scroll"
                >
                  <p
                    className="profile-bio-txt"
                    style={{
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: "var(--color-text-muted)",
                      margin: 0,
                    }}
                  >
                    {bioText}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="profile-bottom-row">
            {/* HOBBIES */}
            <div ref={hobbiesR.ref} className="profile-hobbies-col">
              <Card
                variants={riseFromBottom(0.1)}
                animate={hobbiesR.inView ? "show" : "hidden"}
                style={{ padding: "20px", minHeight: 160 }}
              >
                <SectionLabel>Hobbies</SectionLabel>
                <div
                  style={{ overflowY: "auto", maxHeight: 260, paddingRight: 8 }}
                  className="custom-scroll"
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {hobbiesData.length > 0 ? (
                      hobbiesData.map((h, i) => (
                        <div
                          key={i}
                          className="profile-hobby"
                          style={{
                            padding: "10px 14px",
                            background: "rgba(139, 92, 246, 0.05)",
                            borderRadius: "8px",
                            border: "1px solid rgba(139, 92, 246, 0.1)",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--color-text)",
                          }}
                        >
                          {h}
                        </div>
                      ))
                    ) : (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--color-text-muted)",
                        }}
                      >
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
                style={{ padding: "20px", minHeight: 160 }}
              >
                <SectionLabel>Technical Skills</SectionLabel>
                <div
                  style={{ overflowY: "auto", maxHeight: 260, paddingRight: 8 }}
                  className="custom-scroll"
                >
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
                      style={{ fontSize: 12, color: "var(--color-text-muted)" }}
                    >
                      No skills listed.
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* RIGHT COL: Education + Location */}
            <div className="profile-right-col">
              {/* EDUCATION */}
              <div
                ref={eduR.ref}
                className="profile-edu-wrap"
                style={{ flex: 1, minWidth: 0 }}
              >
                <Card
                  variants={riseFromBottom(0.3)}
                  animate={eduR.inView ? "show" : "hidden"}
                  style={{ padding: "20px", minHeight: 120, height: "100%" }}
                >
                  <SectionLabel>Education</SectionLabel>
                  <div
                    style={{
                      overflowY: "auto",
                      maxHeight: 200,
                      paddingRight: 8,
                    }}
                    className="custom-scroll"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {educationData.length > 0 ? (
                        educationData.map((edu, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              gap: 10,
                              alignItems: "flex-start",
                            }}
                          >
                            <div
                              style={{
                                marginTop: 2,
                                color: "#8b5cf6",
                                flexShrink: 0,
                              }}
                            >
                              <GraduationCap size={14} />
                            </div>
                            <div>
                              <div
                                className="profile-edu-degree"
                                style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "var(--color-text)",
                                }}
                              >
                                {edu.Degree}
                              </div>
                              <div
                                className="profile-edu-inst"
                                style={{
                                  fontSize: 11,
                                  color: "var(--color-text-muted)",
                                  marginTop: 2,
                                }}
                              >
                                {edu.Institution}
                              </div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#8b5cf6",
                                  marginTop: 2,
                                }}
                              >
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
                          }}
                        >
                          No education details.
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              {/* LOCATION */}
              <div
                ref={addrR.ref}
                className="profile-addr-wrap"
                style={{ flex: "0 0 auto", minWidth: 0 }}
              >
                <Card
                  variants={riseFromBottom(0.4)}
                  animate={addrR.inView ? "show" : "hidden"}
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: 90,
                  }}
                >
                  <SectionLabel>Location</SectionLabel>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ color: "#8b5cf6", flexShrink: 0 }}>
                      <MapPin size={18} />
                    </div>
                    <p
                      className="profile-addr-txt"
                      style={{
                        fontSize: 12,
                        color: "var(--color-text-muted)",
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
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
