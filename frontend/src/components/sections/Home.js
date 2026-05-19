"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import Marquee from "react-fast-marquee";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm opacity-50">
      Loading 3D...
    </div>
  ),
});

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Resize re-trigger variants: snap in instantly, no stagger/delay
const containerVariantsInstant = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      staggerChildren: 0,
      delayChildren: 0,
    },
  },
};

const itemVariantsInstant = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export default function Home({ scrollProgress = 0, profile, isLoaded }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [splineError, setSplineError] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); // ← Download state
  const splineContainerRef = useRef(null);
  const [triggerAnimation, setTriggerAnimation] = useState(false);
  const hasAnimatedRef = useRef(false);

  // 1. Handle Theme, Mounting & Responsive
  useEffect(() => {
    setMounted(true);

    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(getTheme());

    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => {
        if (prev !== mobile) {
          if (hasAnimatedRef.current) {
            setTriggerAnimation(false);
            requestAnimationFrame(() => setTriggerAnimation(true));
          }
        }
        return mobile;
      });
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const observer = new MutationObserver(() => {
      setTheme(getTheme());
      setSplineError(false);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // 2. Trigger animation when loaded
  useEffect(() => {
    if (isLoaded) {
      setTriggerAnimation(true);
      hasAnimatedRef.current = true;
    }
  }, [isLoaded]);

  // 3. Handle Spline Scale Animation (desktop only)
  useEffect(() => {
    if (!splineContainerRef.current || isMobile) return;
    const scale = 1 + scrollProgress * 0.3;
    splineContainerRef.current.style.transform = `scale(${scale})`;
  }, [scrollProgress, isMobile]);

  // ── Resume Download Handler ──
  const handleDownloadResume = async () => {
    const resumeUrl = profile?.Resume?.url;
    const fileName = profile?.Resume?.fileName || "Soumyajit_Sengupta_Resume";

    if (!resumeUrl) {
      alert("Resume not available yet. Please check back later.");
      return;
    }

    setIsDownloading(true);

    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) throw new Error("Failed to fetch resume");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      // Ensure proper file extension
      const fileExt = fileName.includes(".") ? "" : ".pdf";
      link.download = `${fileName}${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      // Fallback: open in new tab
      window.open(resumeUrl, "_blank");
      alert(
        "Opening resume in new tab. If download doesn't start, right-click and 'Save As'.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return null;

  // Pick animation variants
  const cVariants = hasAnimatedRef.current
    ? containerVariantsInstant
    : containerVariants;
  const iVariants = hasAnimatedRef.current ? itemVariantsInstant : itemVariants;

  // 4. Prepare Dynamic Data
  const firstName = profile?.FirstName || "Soumyajit";
  const lastName = profile?.LastName || "Sengupta";
  const bio =
    profile?.Bio || "Building scalable, high-performance web applications...";
  const yearsExp = profile?.YearsOfExperience || 0;
  const skillsCount = profile?.Skills?.length || 0;

  const jobRoles =
    Array.isArray(profile?.JobRoles) && profile.JobRoles.length > 0
      ? profile.JobRoles
      : [
          "Job Role not added yet",
          "Please wait for next update",
          "Profile under development",
        ];

  const skillNames =
    Array.isArray(profile?.Skills) && profile.Skills.length > 0
      ? profile.Skills.map((s) => s?.Name).filter(Boolean)
      : ["Skill yet to be added, profile under development."];

  const LIGHT_SCENE = "/light-chips.spline";
  const DARK_SCENE = "/dark-chips.spline";
  const scene = theme === "dark" ? DARK_SCENE : LIGHT_SCENE;

  /* ─────────────────────────────────────────
     MOBILE LAYOUT
  ───────────────────────────────────────── */
  if (isMobile) {
    return (
      <section
        style={{
          width: "100%",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "var(--font-primary)",
          overflowX: "hidden",
        }}>
        {/* ── TOP: Spline ── */}
        <div
          style={{
            width: "100%",
            height: "30vh",
            position: "relative",
            flexShrink: 0,
            overflow: "hidden",
          }}>
          <motion.div
            ref={splineContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: triggerAnimation ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "100%",
              transformOrigin: "center center",
              willChange: "transform, opacity",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)",
            }}>
            {!splineError ? (
              <Spline
                key={theme}
                scene={scene}
                onError={(e) => {
                  console.error("Spline Error:", e);
                  setSplineError(true);
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  padding: "0 1.5rem",
                }}>
                <div>
                  <p style={{ fontSize: "1rem", fontWeight: 500 }}>
                    3D Preview Unavailable
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      marginTop: "8px",
                      color: "var(--color-text-muted)",
                    }}>
                    Something went wrong while loading the animation.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── BOTTOM: Three-zone flex layout ── */}
        <div
          style={{
            width: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "1rem 1.5rem 1.5rem",
            textAlign: "center",
            boxSizing: "border-box",
          }}>
          {/* ── ZONE 1 (TOP): Name + Role ── */}
          <motion.div
            variants={cVariants}
            initial="hidden"
            animate={triggerAnimation ? "visible" : "hidden"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}>
            <motion.div variants={iVariants} style={{ marginBottom: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}>
                <span
                  style={{
                    width: "20px",
                    height: "1px",
                    background: "var(--color-text-muted)",
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--color-accent)",
                    minHeight: "1.2em",
                  }}>
                  <Typewriter
                    words={jobRoles}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </span>
                <span
                  style={{
                    width: "20px",
                    height: "1px",
                    background: "var(--color-text-muted)",
                  }}
                />
              </div>
            </motion.div>

            <motion.h1
              variants={iVariants}
              style={{
                fontSize: "clamp(2.2rem, 10vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
                color: "var(--color-text)",
              }}>
              {firstName}
            </motion.h1>

            <motion.h1
              variants={iVariants}
              style={{
                fontSize: "clamp(2.2rem, 10vw, 3rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--color-accent)",
                margin: 0,
              }}>
              {lastName}
            </motion.h1>
          </motion.div>

          {/* ── ZONE 2 (CENTER): Bio + Marquee ── */}
          <motion.div
            variants={cVariants}
            initial="hidden"
            animate={triggerAnimation ? "visible" : "hidden"}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              flex: 1,
              justifyContent: "center",
            }}>
            <motion.p
              variants={iVariants}
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.75,
                color: "var(--color-text-muted)",
                maxWidth: "90%",
                marginBottom: "1rem",
              }}>
              {bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: triggerAnimation ? 1 : 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                width: "100%",
                overflow: "hidden",
              }}>
              <Marquee
                gradient={false}
                speed={40}
                pauseOnHover={true}
                direction="right"
                className="flex items-center">
                {skillNames.map((tech, index) => (
                  <span
                    key={`${tech}-${index}`}
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "5px 12px",
                      border: "0.5px solid var(--color-border)",
                      color: "var(--color-accent)",
                      borderRadius: "2px",
                      marginRight: "10px",
                      display: "inline-block",
                    }}>
                    {tech}
                  </span>
                ))}
              </Marquee>
            </motion.div>
          </motion.div>

          {/* ── ZONE 3 (BOTTOM): Buttons + Stats ── */}
          <div style={{ width: "100%" }}>
            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: triggerAnimation ? 1 : 0,
                y: triggerAnimation ? 0 : 20,
              }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "1.25rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}>
              {/* Download Resume Button - MOBILE */}
              <button
                onClick={handleDownloadResume}
                disabled={isDownloading}
                style={{
                  padding: "11px 24px",
                  background: isDownloading
                    ? "var(--color-text-muted)"
                    : "var(--color-text)",
                  color: "var(--color-bg)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  border: "none",
                  borderRadius: "2px",
                  cursor: isDownloading ? "not-allowed" : "pointer",
                  opacity: isDownloading ? 0.7 : 1,
                  transition: "opacity 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                {isDownloading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  "Download Resume"
                )}
              </button>

              <button
                style={{
                  padding: "11px 24px",
                  background: "transparent",
                  color: "var(--color-text-muted)",
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  border: "0.5px solid var(--color-border)",
                  borderRadius: "2px",
                  cursor: "pointer",
                }}>
                Contact Me
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: triggerAnimation ? 1 : 0 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              style={{
                display: "flex",
                gap: "1.5rem",
                justifyContent: "center",
              }}>
              {[
                { value: `${yearsExp}+`, label: "Years exp." },
                { value: `${skillsCount}+`, label: "Skills" },
                { value: "∞", label: "Cups of coffee" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  style={{ display: "flex", gap: "1.5rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        marginBottom: "4px",
                      }}>
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "var(--color-accent)",
                      }}>
                      {stat.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        width: "0.5px",
                        background: "var(--color-border)",
                      }}
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────
     DESKTOP / TABLET LAYOUT
  ───────────────────────────────────────── */
  return (
    <section
      className="w-full h-full flex flex-col md:flex-row items-center justify-between"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-primary)",
      }}>
      {/* ── LEFT COLUMN ── */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingLeft: "clamp(2rem, 5vw, 4rem)",
          paddingRight: "2rem",
          paddingTop: "clamp(4.5rem, 8vh, 6rem)",
          paddingBottom: "clamp(2rem, 4vh, 3rem)",
          position: "relative",
          zIndex: 10,
          boxSizing: "border-box",
        }}>
        {/* ── ZONE 1 (TOP): Role typewriter + Name ── */}
        <motion.div
          variants={cVariants}
          initial="hidden"
          animate={triggerAnimation ? "visible" : "hidden"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          <motion.div variants={iVariants} style={{ marginBottom: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  width: "28px",
                  height: "1px",
                  background: "var(--color-text-muted)",
                }}
              />
              <span
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  minHeight: "1.2em",
                }}>
                <Typewriter
                  words={jobRoles}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={70}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={iVariants}
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "var(--color-text)",
            }}>
            {firstName}
          </motion.h1>

          <motion.h1
            variants={iVariants}
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-accent)",
              margin: 0,
            }}>
            {lastName}
          </motion.h1>
        </motion.div>

        {/* ── ZONE 2 (CENTER): Bio + Marquee ── */}
        <motion.div
          variants={cVariants}
          initial="hidden"
          animate={triggerAnimation ? "visible" : "hidden"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "1rem",
          }}>
          <motion.p
            variants={iVariants}
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "var(--color-text-muted)",
              maxWidth: "90%",
              marginBottom: "1rem",
              margin: 0,
              marginBottom: "1rem",
            }}>
            {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: triggerAnimation ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            style={{ width: "60%", overflow: "hidden" }}>
            <Marquee
              gradient={false}
              speed={40}
              pauseOnHover={true}
              direction="right"
              className="flex items-center">
              {skillNames.map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    padding: "6px 14px",
                    border: "0.5px solid var(--color-border)",
                    color: "var(--color-accent)",
                    borderRadius: "2px",
                    marginRight: "12px",
                    display: "inline-block",
                  }}>
                  {tech}
                </span>
              ))}
            </Marquee>
          </motion.div>
        </motion.div>

        {/* ── ZONE 3 (BOTTOM): Buttons + Stats ── */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: triggerAnimation ? 1 : 0,
              y: triggerAnimation ? 0 : 20,
            }}
            transition={{ delay: 0.8, duration: 0.5 }}
            style={{ display: "flex", gap: "12px" }}>
            {/* Download Resume Button - DESKTOP */}
            <button
              onClick={handleDownloadResume}
              disabled={isDownloading}
              onMouseEnter={(e) => {
                if (!isDownloading) {
                  e.currentTarget.style.background = "#6d28d9";
                }
              }}
              onMouseLeave={(e) => {
                if (!isDownloading) {
                  e.currentTarget.style.background = "var(--color-text)";
                }
              }}
              style={{
                padding: "12px 28px",
                background: isDownloading
                  ? "var(--color-text-muted)"
                  : "var(--color-text)",
                color: "var(--color-bg)",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "none",
                borderRadius: "2px",
                cursor: isDownloading ? "not-allowed" : "pointer",
                opacity: isDownloading ? 0.7 : 1,
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}>
              {isDownloading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                  </svg>
                  Downloading...
                </>
              ) : (
                "Download Resume"
              )}
            </button>

            <button
              style={{
                padding: "12px 28px",
                background: "transparent",
                color: "var(--color-text-muted)",
                fontSize: "12px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                border: "0.5px solid var(--color-border)",
                borderRadius: "2px",
                cursor: "pointer",
              }}>
              Contact Me
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: triggerAnimation ? 1 : 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            style={{ display: "flex", gap: "2rem" }}>
            {[
              { value: `${yearsExp}+`, label: "Years exp." },
              { value: `${skillsCount}+`, label: "Skills" },
              { value: "∞", label: "Cups of coffee" },
            ].map((stat, i, arr) => (
              <div key={stat.label} style={{ display: "flex", gap: "2rem" }}>
                <div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}>
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: "var(--color-accent)",
                    }}>
                    {stat.label}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: "0.5px",
                      background: "var(--color-border)",
                    }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT COLUMN: Spline ── */}
      <div
        style={{
          width: "50%",
          height: "100%",
          overflow: "visible",
          position: "relative",
        }}>
        <motion.div
          ref={splineContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: triggerAnimation ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            width: "120%",
            height: "100%",
            transformOrigin: "center center",
            willChange: "transform, opacity",
            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)",
          }}>
          {!splineError ? (
            <Spline
              key={theme}
              scene={scene}
              onError={(e) => {
                console.error("Spline Error:", e);
                setSplineError(true);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-center px-6">
              <div>
                <p className="text-lg font-medium">3D Preview Unavailable</p>
                <p
                  className="text-sm mt-2"
                  style={{ color: "var(--color-text-muted)" }}>
                  Something went wrong while loading the animation.
                </p>
              </div>
            </div>
          )}
        </motion.div>

        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "10%",
            height: "100%",
            pointerEvents: "none",
            background:
              "linear-gradient(to right, rgba(0,0,0,0), var(--color-bg))",
          }}
        />
      </div>
    </section>
  );
}
