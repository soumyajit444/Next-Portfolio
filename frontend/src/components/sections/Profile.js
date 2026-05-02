"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  motion,
  useInView,
  useAnimation,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── viewport reveal hook ─── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { once: true, amount: threshold });
  useEffect(() => {
    if (inView) controls.start("show");
  }, [inView, controls]);
  return { ref, controls };
}

/* ─── motion variants ─── */
const fadeUp = (d = 0) => ({
  hidden: { opacity: 0, y: 36, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  },
});
const fadeLeft = (d = 0) => ({
  hidden: { opacity: 0, x: -50, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  },
});
const fadeRight = (d = 0) => ({
  hidden: { opacity: 0, x: 50, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: d },
  },
});

/* ─── animated skill bar ─── */
function SkillBar({ label, pct, delay, dark }) {
  const { ref, controls } = useReveal();
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
          }}>
          {label}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>
          {pct}%
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: 3,
          borderRadius: 99,
          background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>
        <motion.div
          initial={{ width: 0 }}
          animate={controls}
          variants={{
            show: {
              width: `${pct}%`,
              transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1], delay },
            },
          }}
          style={{
            height: "100%",
            borderRadius: 99,
            background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
          }}
        />
      </div>
    </div>
  );
}

/* ─── glass card ─── */
function Card({ children, style = {}, variants, animate }) {
  return (
    <motion.div
      variants={variants}
      animate={animate}
      initial="hidden"
      whileHover={{
        y: -3,
        scale: 1.01,
        transition: { type: "spring", stiffness: 220, damping: 18 },
      }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        /* Single semi-transparent background — no double layering */
        background: "var(--glass-bg)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.4)",
        ...style,
      }}>
      {/* Top-edge glare — simulates the refracted light of real glass */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 30%, transparent 60%)",
          zIndex: 1,
        }}
      />

      {/* Blue tint radial — gives it that cool-toned glass look */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 25% 0%, rgba(59,130,246,0.09) 0%, transparent 65%)",
          zIndex: 3,
        }}
      />

      <div className="relative z-10">{children}</div>
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
        marginBottom: 14,
      }}>
      <div
        style={{
          width: 16,
          height: 2,
          borderRadius: 99,
          background: "linear-gradient(90deg,#3b82f6,#06b6d4)",
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#60a5fa",
        }}>
        {children}
      </span>
    </div>
  );
}

/* ─── icon box ─── */
function IconBox({ icon }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 9,
        background: "rgba(59,130,246,0.1)",
        border: "1px solid rgba(59,130,246,0.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 15,
        flexShrink: 0,
      }}>
      {icon}
    </div>
  );
}

/* ─── scatter destinations per card (vw/vh units as multipliers) ─── */
const SCATTER = {
  profile: { x: -120, y: -80, r: -25 },
  hobbies: { x: -140, y: 60, r: 18 },
  bio: { x: 60, y: -100, r: 12 },
  skills: { x: -100, y: 120, r: -20 },
  address: { x: 40, y: 130, r: 15 },
  contact: { x: 140, y: 80, r: -10 },
};

/* ─── ScatterCard wrapper ─── */
function ScatterCard({ scatterKey, scrollProgress, children, style = {} }) {
  const s = SCATTER[scatterKey];

  const x = useTransform(scrollProgress, [0, 1], [0, s.x * 8]);
  const y = useTransform(scrollProgress, [0, 1], [0, s.y * 8]);
  const rotate = useTransform(scrollProgress, [0, 1], [0, s.r]);
  const opacity = useTransform(scrollProgress, [0, 0.6, 1], [1, 0.3, 0]);
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.7]);

  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });
  const springR = useSpring(rotate, { stiffness: 80, damping: 20 });
  const springO = useSpring(opacity, { stiffness: 80, damping: 20 });
  const springS = useSpring(scale, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
        rotate: springR,
        opacity: springO,
        scale: springS,
        willChange: "transform, opacity",
        ...style,
      }}>
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
const Profile = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return document.documentElement.getAttribute("data-theme") || "light";
  });

  useEffect(() => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(currentTheme);
    const observer = new MutationObserver(() => {
      const updatedTheme =
        document.documentElement.getAttribute("data-theme") || "light";
      setTheme(updatedTheme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const dark = theme === "dark";
  const txt = "var(--color-text)";
  const muted = "var(--color-text-muted)";

  /* reveal hooks */
  const profileR = useReveal();
  const skillsR = useReveal();
  const bioR = useReveal();
  const hobbyR = useReveal();
  const addrR = useReveal();
  const contactR = useReveal();

  /* ── scroll progress for scatter ── */
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["end end", "start start"],
  });

  const adjustedProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={sectionRef} style={{ height: "250vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 36px",
          fontFamily: "var(--font-primary)",
          color: txt,
          boxSizing: "border-box",
          overflow: "hidden",
        }}>
        {/* ── OUTER GRID ── */}
        <div
          style={{
            width: "100%",
            maxWidth: 1060,
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 22,
            alignItems: "stretch",
          }}>
          {/* ════ LEFT COLUMN ════ */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              height: "100%",
              alignSelf: "stretch",
            }}>
            {/* PROFILE CARD */}
            <ScatterCard
              scatterKey="profile"
              scrollProgress={adjustedProgress}
              style={{
                flex: "3 1 0",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}>
              <div
                ref={profileR.ref}
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}>
                <Card
                  variants={fadeLeft(0)}
                  animate={profileR.controls}
                  style={{
                    padding: "26px 18px 20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                    textAlign: "center",
                    flex: 1,
                    boxSizing: "border-box",
                  }}>
                  <div
                    style={{
                      position: "relative",
                      width: 84,
                      height: 84,
                      flexShrink: 0,
                    }}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 9,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        position: "absolute",
                        inset: -5,
                        borderRadius: "50%",
                        // background:
                        //   "conic-gradient(#3b82f6,#06b6d4,#8b5cf6,#ec4899,#3b82f6)",
                        opacity: 0.75,
                      }}
                    />
                    <div
                      style={{
                        position: "relative",
                        width: 84,
                        height: 84,
                        borderRadius: "50%",
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.06)",
                        border: "3px solid rgba(8,12,20,0.95)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 36,
                      }}>
                      🧑‍💻
                    </div>
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: "#34d399",
                        border: "2px solid #080c14",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                    }}>
                    <p
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.24em",
                        fontWeight: 700,
                        color: "#60a5fa",
                        textTransform: "uppercase",
                        margin: 0,
                      }}>
                      Profile
                    </p>
                    <h2
                      style={{
                        fontFamily: "var(--font-primary)",
                        fontSize: 15,
                        fontWeight: 700,
                        margin: 0,
                        color: txt,
                      }}>
                      Alex Rivers
                    </h2>
                    <p style={{ fontSize: 11, color: muted, margin: 0 }}>
                      Creative Developer
                    </p>
                  </div>
                </Card>
              </div>
            </ScatterCard>

            {/* SKILLS CARD */}
            <ScatterCard
              scatterKey="hobbies"
              scrollProgress={adjustedProgress}
              style={{
                flex: "2 1 0",
                minHeight: 0,
                display: "flex",
                flexDirection: "column",
              }}>
              <div
                ref={hobbyR.ref}
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column",
                }}>
                <Card
                  variants={fadeLeft(0.1)}
                  animate={hobbyR.controls}
                  style={{
                    padding: "20px 18px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    height: "100%",
                    flex: 1,
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}>
                  <SectionLabel>Hobbies</SectionLabel>
                  <div
                    className="custom-scroll"
                    style={{ overflowY: "auto", flex: 1, paddingRight: 6 }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}>
                      {[
                        {
                          icon: "📸",
                          label: "Photography",
                          sub: "Short captions, filmography",
                        },
                        {
                          icon: "🥾",
                          label: "Hiking",
                          sub: "Hiking and the great outdoors",
                        },
                      ].map((h) => (
                        <motion.div
                          key={h.label}
                          whileHover={{
                            x: 4,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                          }}>
                          <IconBox icon={h.icon} />
                          <div>
                            <p
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: txt,
                                margin: "0 0 2px",
                              }}>
                              {h.label}
                            </p>
                            <p
                              style={{
                                fontSize: 9,
                                color: muted,
                                margin: 0,
                                lineHeight: 1.45,
                              }}>
                              {h.sub}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </ScatterCard>
          </div>
          {/* end LEFT */}

          {/* ════ RIGHT COLUMN ════ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* BIO */}
            <ScatterCard scatterKey="bio" scrollProgress={adjustedProgress}>
              <div ref={bioR.ref}>
                {/* <motion.h1
                  variants={fadeUp(0)}
                  animate={bioR.controls}
                  initial="hidden"
                  style={{
                    fontFamily: "var(--font-primary)",
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    margin: "0 0 14px",
                    color: txt,
                  }}>
                  MY PROFILE
                </motion.h1> */}
                <Card
                  variants={fadeRight(0.07)}
                  animate={bioR.controls}
                  style={{
                    padding: "20px 22px",
                    height: 150,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <SectionLabel>My Bio</SectionLabel>
                  <div
                    style={{ overflowY: "auto", flex: 1, paddingRight: 6 }}
                    className="custom-scroll">
                    <p
                      style={{
                        fontSize: 12,
                        lineHeight: 1.85,
                        color: muted,
                        margin: 0,
                      }}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </p>
                  </div>
                </Card>
              </div>
            </ScatterCard>

            {/* ── Skills / ADDRESS / CONTACT ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)",
                gap: 18,
                alignItems: "stretch",
              }}>
              {/* LEFT 60% — SKILLS */}
              <ScatterCard
                scatterKey="skills"
                scrollProgress={adjustedProgress}>
                <div ref={skillsR.ref}>
                  <Card
                    variants={fadeLeft(0.1)}
                    animate={skillsR.controls}
                    style={{
                      padding: "18px 16px",
                      height: 230,
                      display: "flex",
                      flexDirection: "column",
                    }}>
                    <SectionLabel>Skills</SectionLabel>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        flex: 1,
                        justifyContent: "center",
                      }}>
                      {[
                        { label: "React", pct: 92 },
                        { label: "Next.js", pct: 88 },
                        { label: "Tailwind", pct: 95 },
                        { label: "TypeScript", pct: 80 },
                      ].map((s, i) => (
                        <SkillBar
                          key={s.label}
                          label={s.label}
                          pct={s.pct}
                          delay={i * 0.09}
                          dark={dark}
                        />
                      ))}
                    </div>
                  </Card>
                </div>
              </ScatterCard>

              {/* RIGHT 40% — ADDRESS + CONTACT stacked */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                  height: 230,
                  minWidth: 0,
                }}>
                {/* ADDRESS */}
                <ScatterCard
                  scatterKey="address"
                  scrollProgress={adjustedProgress}
                  style={{
                    flex: 0.9,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <div
                    ref={addrR.ref}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}>
                    <Card
                      variants={fadeLeft(0.1)}
                      animate={addrR.controls}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}>
                      <SectionLabel>Address</SectionLabel>
                      <div
                        className="custom-scroll"
                        style={{ overflowY: "auto", flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 10,
                            }}>
                            <IconBox icon="📍" />
                            <div>
                              <p
                                style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: txt,
                                  margin: "0 0 2px",
                                }}>
                                123 Design Street
                              </p>
                              <p
                                style={{
                                  fontSize: 10,
                                  color: muted,
                                  margin: 0,
                                }}>
                                Creative City, 90210
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </ScatterCard>

                {/* CONTACT */}
                <ScatterCard
                  scatterKey="contact"
                  scrollProgress={adjustedProgress}
                  style={{
                    flex: 1.1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <div
                    ref={contactR.ref}
                    style={{
                      flex: 1,
                      minHeight: 0,
                      display: "flex",
                      flexDirection: "column",
                    }}>
                    <Card
                      variants={fadeLeft(0.1)}
                      animate={contactR.controls}
                      style={{
                        flex: 1,
                        padding: "14px 16px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                      }}>
                      <SectionLabel>Contact Info</SectionLabel>
                      <div className="custom-scroll" style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: 12,
                          }}>
                          {[
                            {
                              icon: "✉️",
                              label: "Email",
                              val: "alex@rivers.dev",
                            },
                            {
                              icon: "📞",
                              label: "Phone",
                              val: "+1 (555) 000-0000",
                            },
                            {
                              icon: "💼",
                              label: "LinkedIn",
                              val: "linkedin.com/in/alexrivers",
                            },
                          ].map((c) => (
                            <motion.div
                              key={c.label}
                              whileHover={{
                                y: -3,
                                transition: { type: "spring", stiffness: 300 },
                              }}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 2,
                                padding: 4,
                                cursor: "pointer",
                              }}
                              title={c.val} // ✅ tooltip
                            >
                              <IconBox icon={c.icon} />

                              <p
                                style={{
                                  fontSize: 9,
                                  fontWeight: 600,
                                  letterSpacing: "0.12em",
                                  textTransform: "uppercase",
                                  color: muted,
                                  margin: 0,
                                  textAlign: "center",
                                }}>
                                {c.label}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                </ScatterCard>
              </div>
              {/* end RIGHT 40% */}
            </div>

            {/* end bottom grid */}
          </div>
          {/* end RIGHT */}
        </div>
      </div>
    </div>
  );
};

export default Profile;
