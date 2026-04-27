"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SECTION_START = 0.6;
const SECTION_END = 0.9;
const SECTION_SPAN = SECTION_END - SECTION_START;

// ─────────────────────────────────────────────────────────────────────────────
// Experience data
// ─────────────────────────────────────────────────────────────────────────────
const EXPERIENCES = [
  {
    id: 0,
    side: "right",
    date: "Jan 2021 – Dec 2022",
    role: "Frontend Engineer",
    company: "Acme Corp",
    location: "Remote",
    description:
      "Built and shipped a design system used across 12 product teams. Led migration from class components to hooks, reducing bundle size by 34% and improving Lighthouse scores by 20 points.",
    tags: ["React", "TypeScript", "Figma"],
    // node sits at 25% of the timeline height
    nodeAt: 0.13,
  },
  {
    id: 1,
    side: "left",
    date: "Jan 2023 – Present",
    role: "Senior UI Engineer",
    company: "Nova Studio",
    location: "Kolkata, IN",
    description:
      "Architected a real-time collaboration layer for a SaaS canvas editor. Mentored a team of four engineers and drove a 2× improvement in page-load performance through edge caching and code-splitting strategies.",
    tags: ["Next.js", "WebSockets", "GSAP"],
    // node sits at 70% of the timeline height
    nodeAt: 0.56,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// ProgressLine  (unchanged logic, extended with node dots + cards)
// ─────────────────────────────────────────────────────────────────────────────
function ProgressLine() {
  const lineTrackRef = useRef(null);
  const lineFillRef = useRef(null);
  // store per-experience refs in arrays
  const nodeRefs = useRef(EXPERIENCES.map(() => React.createRef()));
  const cardRefs = useRef(EXPERIENCES.map(() => React.createRef()));
  const cardRevealedRef = useRef(EXPERIENCES.map(() => false));

  useEffect(() => {
    const handleBgScroll = (e) => {
      const globalProgress = e.detail;

      const lineTrack = lineTrackRef.current;
      const lineFill = lineFillRef.current;
      if (!lineTrack || !lineFill) return;

      const localProgress = Math.max(
        0,
        Math.min(1, (globalProgress - SECTION_START) / SECTION_SPAN),
      );

      // ── opacity envelope (identical to original) ──────────────────────────
      let opacity = 0;
      if (localProgress < 0.08) {
        opacity = localProgress / 0.08;
      } else if (localProgress > 0.82) {
        opacity = 1 - (localProgress - 0.82) / 0.18;
      } else {
        opacity = 1;
      }

      // ── line fill (identical to original) ────────────────────────────────
      const growProgress = Math.max(
        0,
        Math.min(1, (localProgress - 0.08) / 0.74),
      );
      const lineHeight = growProgress * 100;

      lineTrack.style.opacity = opacity;
      lineFill.style.height = `${lineHeight}vh`;

      // ── node + card reveal ───────────────────────────────────────────────
      EXPERIENCES.forEach((exp, i) => {
        const nodeDot = nodeRefs.current[i].current;
        const card = cardRefs.current[i].current;
        if (!nodeDot || !card) return;

        // growProgress reaches exp.nodeAt → activate
        const activated = growProgress >= exp.nodeAt;

        // node dot pulse
        nodeDot.style.opacity = activated ? "1" : "0";
        nodeDot.style.transform = activated
          ? "translateX(-50%) scale(1)"
          : "translateX(-50%) scale(0.4)";

        // card slide-in (only trigger once)
        if (activated && !cardRevealedRef.current[i]) {
          cardRevealedRef.current[i] = true;
          card.style.opacity = "1";
          card.style.transform = "translateY(0) translateX(0)";
        }
        if (!activated && cardRevealedRef.current[i]) {
          // allow re-hiding if user scrolls back up
          cardRevealedRef.current[i] = false;
          card.style.opacity = "0";
          card.style.transform =
            exp.side === "right"
              ? "translateY(12px) translateX(16px)"
              : "translateY(12px) translateX(-16px)";
        }
      });
    };

    window.addEventListener("bgscroll", handleBgScroll);
    return () => window.removeEventListener("bgscroll", handleBgScroll);
  }, []);

  return (
    <div
      ref={lineTrackRef}
      style={{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "2px",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        pointerEvents: "none",
        zIndex: 999,
        opacity: 0,
        transition: "opacity 0.3s ease",
      }}>
      {/* ── Growing purple fill (identical to original) ─────────────────── */}
      <div
        ref={lineFillRef}
        style={{
          width: "2px",
          height: "0vh",
          background: "linear-gradient(to bottom, #7c3aed, #a855f7, #c084fc)",
          borderRadius: "0 0 2px 2px",
          transition: "height 0.05s linear",
          boxShadow:
            "0 0 8px rgba(168, 85, 247, 0.6), 0 0 20px rgba(168, 85, 247, 0.25)",
          position: "relative",
        }}>
        {/* Glowing tip dot (identical to original) */}
        <div
          style={{
            position: "absolute",
            bottom: "-4px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#c084fc",
            boxShadow:
              "0 0 12px rgba(192, 132, 252, 0.9), 0 0 24px rgba(168, 85, 247, 0.5)",
          }}
        />
      </div>

      {/* ── Experience nodes pinned at % positions along the line ────────── */}
      {EXPERIENCES.map((exp, i) => (
        <React.Fragment key={exp.id}>
          {/* Node dot on the line */}
          <div
            ref={nodeRefs.current[i]}
            style={{
              position: "absolute",
              top: `${exp.nodeAt * 100}vh`,
              left: "50%",
              transform: "translateX(-50%) scale(0.4)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c3aed, #c084fc)",
              boxShadow:
                "0 0 0 3px rgba(168,85,247,0.25), 0 0 16px rgba(168,85,247,0.6)",
              opacity: 0,
              transition:
                "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              zIndex: 10001,
            }}
          />

          {/* Date pill */}
          <DatePill exp={exp} />

          {/* Experience card */}
          <ExperienceCard exp={exp} cardRef={cardRefs.current[i]} />
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DatePill — rendered via position fixed so it sits on the opposite side
// ─────────────────────────────────────────────────────────────────────────────
function DatePill({ exp }) {
  // pill is on the SAME side as the node label (opposite card)
  // right-side card → pill on left of center; left-side card → pill on right
  const pillSide = exp.side === "right" ? "left" : "right";

  return (
    <div
      style={{
        position: "absolute",
        top: `calc(${exp.nodeAt * 100}vh - 14px)`,
        ...(pillSide === "left"
          ? { right: "calc(50% + 20px)" }
          : { left: "calc(50% + 20px)" }),
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.03em",
        padding: "6px 16px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 14px rgba(124,58,237,0.45)",
        pointerEvents: "none",
        zIndex: 10000,
      }}>
      {exp.date}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExperienceCard
// ─────────────────────────────────────────────────────────────────────────────
function ExperienceCard({ exp, cardRef }) {
  const isRight = exp.side === "right";

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: `calc(${exp.nodeAt * 100}vh - 20px)`,
        ...(isRight
          ? { left: "calc(50% + 28px)" }
          : { right: "calc(50% + 28px)" }),
        height: 280,
        width: 500,
        background: "var(--glass-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(169, 169, 169, 0.61)",
        borderRadius: "16px",
        padding: "22px 24px",
        boxShadow: "var(--card-shadow)",
        opacity: 0,
        transform: isRight
          ? "translateY(12px) translateX(16px)"
          : "translateY(12px) translateX(-16px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        zIndex: 10000,
        textAlign: isRight ? "left" : "right",
      }}>
      {/* Role + company */}
      <div
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--color-text-muted)",
          marginBottom: "2px",
          lineHeight: 1.2,
        }}>
        {exp.role}
        <span
          style={{
            fontWeight: 400,
            color: "#a855f7",
            fontSize: "13px",
            marginLeft: "8px",
          }}>
          ({exp.location})
        </span>
      </div>

      {/* Company name */}
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#7c3aed",
          marginBottom: "10px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}>
        {exp.company}
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, rgba(168,85,247,0.3), transparent)",
          marginBottom: "12px",
        }}
      />

      {/* Description */}
      <div
        style={{
          fontSize: "13.5px",
          color: "var(--color-text)",
          lineHeight: 1.65,
          marginBottom: "14px",
        }}>
        {exp.description}
      </div>

      {/* Tags */}
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          flexWrap: "wrap",
          gap: "6px",
          justifyContent: isRight ? "flex-start" : "flex-end",
        }}>
        {exp.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#7c3aed",
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: "20px",
              padding: "3px 10px",
              letterSpacing: "0.04em",
            }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Experience section (unchanged shell)
// ─────────────────────────────────────────────────────────────────────────────
export default function Experience() {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      {mounted && createPortal(<ProgressLine />, document.body)}
    </div>
  );
}
