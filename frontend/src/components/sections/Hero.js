"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm opacity-50">
      Loading 3D...
    </div>
  ),
});

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [splineError, setSplineError] = useState(false);

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

  if (!mounted) return null;

  const LIGHT_SCENE =
    "https://prod.spline.design/TVQvHCm6eDFG6vqy/scene.splinecode";
  const DARK_SCENE =
    "https://prod.spline.design/MfaVLvpv2dL5UwUb/scene.splinecode";
  const scene = theme === "dark" ? DARK_SCENE : LIGHT_SCENE;

  return (
    <section
      className="w-full h-full flex flex-col md:flex-row items-center justify-between"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-primary)",
        // NO padding here — moved to inner wrapper below
      }}>
      {/* LEFT SIDE — padding lives here now, not on the section */}
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
        }}>
        {/* Label row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "2.5rem",
          }}>
          <span
            style={{
              display: "inline-block",
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
            }}>
            Frontend Engineer
          </span>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-text)",
              margin: 0,
            }}>
            Soumyajit
          </h1>
          <h1
            style={{
              fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-accent)",
              margin: 0,
            }}>
            Sengupta
          </h1>
        </div>

        {/* Subheading */}
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "var(--color-text-muted)",
            maxWidth: "440px",
            margin: "0 0 2.5rem",
          }}>
          Building scalable, high-performance web applications with a focus on
          modern UI/UX, clean architecture, and efficient state management.
        </p>

        {/* Tech pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "3rem",
          }}>
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Redux Toolkit",
            "Tailwind",
            "Git",
          ].map((tech) => (
            <span
              key={tech}
              style={{
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                padding: "6px 14px",
                border: "0.5px solid var(--color-border)",
                color: "var(--color-accent)",
                borderRadius: "2px",
              }}>
              {tech}
            </span>
          ))}
        </div>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "4rem" }}>
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
            View Projects
          </button>
          <button
            style={{
              padding: "12px 28px",
              background: "transparent",
              color: "var(--color-text-muted)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: "0.5px solid var(--color-border)",
              borderRadius: "2px",
              cursor: "pointer",
            }}>
            Contact Me
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", alignItems: "stretch", gap: "2rem" }}>
          {[
            { value: "3+", label: "Years exp." },
            { value: "15+", label: "Skills" },
            { value: "∞", label: "Cups of coffee" },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              style={{ display: "flex", alignItems: "stretch", gap: "2rem" }}>
              <div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: "var(--color-text)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
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
                    alignSelf: "stretch",
                    background: "var(--color-border)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{ width: "50%", height: "100%" }}>
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
      </div>
    </section>
  );
}
