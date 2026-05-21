"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import LoadingScreen from "@/components/animations/LoadingScreen";

gsap.registerPlugin(ScrollTrigger, Observer);

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Fade-in animation for fallback content
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loaded || !mounted) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fallback-content",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      );
    });

    return () => ctx.revert();
  }, [loaded, mounted]);

  return (
    <div
      style={{
        overflow: "hidden",
        position: "relative",
        height: "100vh",
        background: "var(--color-bg, #0a0a0a)",
      }}>
      {/* Loading Screen */}
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {/* Fallback UI - shown after load */}
      {loaded && (
        <div
          className="fallback-content"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            padding: "24px",
            textAlign: "center",
            color: "var(--color-text, #fff)",
            fontFamily: "var(--font-primary, system-ui)",
          }}>
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "var(--color-accent, #7033fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              opacity: "0.9",
            }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
              fontWeight: "700",
              marginBottom: "12px",
              letterSpacing: "-0.02em",
            }}>
            Profile Not Specified
          </h1>

          {/* Message */}
          <p
            style={{
              fontSize: "clamp(0.95rem, 2.5vw, 1.1rem)",
              color: "var(--color-text-muted, #aaa)",
              maxWidth: "480px",
              marginBottom: "32px",
              lineHeight: "1.6",
            }}>
            Please enter the profile URL after the current domain to access your
            desired profile.
            <br />
            <span style={{ opacity: 0.7 }}>
              Example:{" "}
              <code
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "monospace",
                }}>
                your-domain.netlify.app/your-name
              </code>
            </span>
          </p>

          {/* Optional: Footer hint */}
          <p
            style={{
              position: "absolute",
              bottom: "24px",
              fontSize: "0.85rem",
              color: "var(--color-text-dim, #666)",
              opacity: "0.7",
            }}>
            Built with Next.js
          </p>
        </div>
      )}
    </div>
  );
}
