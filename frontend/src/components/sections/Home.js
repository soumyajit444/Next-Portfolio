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
      delayChildren: 0.05, // Reduced delay for snappier feel
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

export default function Home({ scrollProgress = 0, profile, isLoaded }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [splineError, setSplineError] = useState(false);
  const splineContainerRef = useRef(null);

  // State to control text animation trigger
  const [triggerAnimation, setTriggerAnimation] = useState(false);

  // 1. Handle Theme & Mounting
  useEffect(() => {
    setMounted(true);
    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") || "light";
    setTheme(getTheme());

    const observer = new MutationObserver(() => {
      setTheme(getTheme());
      setSplineError(false);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  // 2. TRIGGER ANIMATION IMMEDIATELY WHEN LOADED
  useEffect(() => {
    if (isLoaded) {
      // No timeout needed. As soon as the loader unmounts/fades, this runs.
      setTriggerAnimation(true);
    }
  }, [isLoaded]);

  // 3. Handle Spline Scale Animation
  useEffect(() => {
    if (!splineContainerRef.current) return;
    const scale = 1 + scrollProgress * 0.3;
    splineContainerRef.current.style.transform = `scale(${scale})`;
  }, [scrollProgress]);

  if (!mounted) return null;

  // 4. Prepare Dynamic Data
  const firstName = profile?.FirstName || "Soumyajit";
  const lastName = profile?.LastName || "Sengupta";
  const bio =
    profile?.Bio || "Building scalable, high-performance web applications...";
  const yearsExp = profile?.YearsOfExperience || 0;
  const skillsCount = profile?.Skills?.length || 0;

  const jobRoles = profile?.CurrentJobRole
    ? [profile.CurrentJobRole]
    : ["Frontend Engineer", "UI Developer", "React JS Developer"];

  const skillNames = profile?.Skills?.map((s) => s.Name) || [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind",
  ];

  const LIGHT_SCENE = "/light-chips.spline";
  const DARK_SCENE = "/dark-chips.spline";
  const scene = theme === "dark" ? DARK_SCENE : LIGHT_SCENE;

  return (
    <section
      className="w-full h-full flex flex-col md:flex-row items-center justify-between"
      style={{
        // Ensure background matches the loader's bg color for seamlessness
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-primary)",
      }}>
      {/* LEFT SIDE */}
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: "4rem",
          paddingRight: "2rem",
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
          position: "relative",
          zIndex: 10,
        }}>
        {/* TEXT CONTAINER */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={triggerAnimation ? "visible" : "hidden"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}>
          {/* Label / Typewriter */}
          <motion.div variants={itemVariants} style={{ marginBottom: "1rem" }}>
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

          {/* Heading - First Name */}
          <motion.h1
            variants={itemVariants}
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

          {/* Heading - Last Name */}
          <motion.h1
            variants={itemVariants}
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-accent)",
              margin: 0,
              marginBottom: "2rem",
            }}>
            {lastName}
          </motion.h1>

          {/* Description / Bio */}
          <motion.p
            variants={itemVariants}
            style={{
              fontSize: "1rem",
              lineHeight: 1.75,
              color: "var(--color-text-muted)",
              maxWidth: "90%",
              marginBottom: "1rem",
            }}>
            {bio}
          </motion.p>
        </motion.div>

        {/* Tech Marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: triggerAnimation ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ marginBottom: "2rem", width: "60%", overflow: "hidden" }}>
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

        {/* Buttons & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: triggerAnimation ? 1 : 0,
            y: triggerAnimation ? 0 : 20,
          }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ display: "flex", gap: "12px", marginBottom: "2rem" }}>
          <button
            style={{
              padding: "12px 28px",
              background: "var(--color-text)",
              color: "var(--color-bg)",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}>
            Download Resume
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
                  style={{ width: "0.5px", background: "var(--color-border)" }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* RIGHT SIDE (Spline) */}
      <div
        style={{
          width: "50%",
          height: "100%",
          overflow: "visible",
          position: "relative",
        }}>
        {/* Spline Container with Fade In */}
        <motion.div
          ref={splineContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: triggerAnimation ? 1 : 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }} // Slower fade for smooth integration
          style={{
            width: "120%",
            height: "100%",
            transformOrigin: "center center",
            willChange: "transform, opacity",
            // Remove transition here because Framer Motion handles it
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

        {/* Fade buffer */}
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
