"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import Marquee from "react-fast-marquee";
import { Typewriter } from "react-simple-typewriter";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm opacity-50">
      Loading 3D...
    </div>
  ),
});

export default function Home({ scrollProgress = 0 }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [splineError, setSplineError] = useState(false);
  const splineContainerRef = useRef(null);

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

  useEffect(() => {
    if (!splineContainerRef.current) return;
    const scale = 1 + scrollProgress * 0.3;
    splineContainerRef.current.style.transform = `scale(${scale})`;
  }, [scrollProgress]);

  if (!mounted) return null;

  const LIGHT_SCENE = "/light-chips.spline";
  const DARK_SCENE = "/dark-chips.spline";
  const scene = theme === "dark" ? DARK_SCENE : LIGHT_SCENE;

  const skills = [
    "React",
    "Next.js",
    "TypeScript",
    "Redux Toolkit",
    "Tailwind",
    "Git",
    "Node.js",
    "GraphQL",
    "Framer Motion",
  ];

  return (
    <section
      className="w-full h-full flex flex-col md:flex-row items-center justify-between"
      style={{
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
        }}>
        {/* Label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "2rem",
          }}>
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
            }}>
            <Typewriter
              words={[
                "Frontend Engineer",
                "UI Developer",
                "React JS Developer",
              ]}
              loop={0} // 0 = infinite loop
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1500}
            />
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

        {/* Description */}
        <p
          style={{
            fontSize: "1rem",
            lineHeight: 1.75,
            color: "var(--color-text-muted)",
            maxWidth: "440px",
            marginBottom: "2.5rem",
          }}>
          Building scalable, high-performance web applications with a focus on
          modern UI/UX, clean architecture, and efficient state management.
        </p>

        {/* Tech Marquee */}
        <div
          style={{
            marginBottom: "3rem",
            width: "100%",
            overflow: "hidden", // Ensures marquee stays within bounds
          }}>
          <Marquee
            gradient={false} // Disabled gradient to match your clean border style
            speed={40}
            pauseOnHover={true}
            direction="right" // Sliding towards right as requested
            className="flex items-center">
            {skills.map((tech, index) => (
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
                  marginRight: "12px", // Spacing between items in marquee
                  display: "inline-block",
                }}>
                {tech}
              </span>
            ))}
          </Marquee>
        </div>

        {/* Buttons */}
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
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "2rem" }}>
          {[
            { value: "3+", label: "Years exp." },
            { value: "15+", label: "Skills" },
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
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          width: "50%",
          height: "100%",
          overflow: "visible",
          position: "relative",
        }}>
        {/* Extended background */}
        <div
          ref={splineContainerRef}
          style={{
            width: "120%",
            height: "100%",
            transformOrigin: "center center",
            willChange: "transform",
            transition: "transform 0.1s linear",

            WebkitMaskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
            maskImage:
              "linear-gradient(to right, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
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
        </div>

        {/* Fade buffer (only extra 10%) */}
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
