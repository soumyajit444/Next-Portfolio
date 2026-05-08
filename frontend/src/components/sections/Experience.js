"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";

const SECTION_START = 0.62;
const SECTION_END = 0.8;
const SECTION_SPAN = SECTION_END - SECTION_START;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Format date from ISO string to "MMM YYYY"
// ─────────────────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return "Present";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Transform API work experience to UI format (STATIC nodeAt for 2 items)
// ─────────────────────────────────────────────────────────────────────────────
const transformExperiences = (workExperiences) => {
  if (!workExperiences || workExperiences.length === 0) return [];

  // Take only first 2 experiences and map to static layout
  return workExperiences.slice(0, 2).map((exp, index) => {
    const startDate = formatDate(exp.StartDate);
    const endDate = exp.EndDate ? formatDate(exp.EndDate) : "Present";

    // STATIC nodeAt positions - matching your original design
    const staticNodePositions = [0.13, 0.56];
    const staticSides = ["right", "left"];

    return {
      id: exp._id || index,
      side: staticSides[index], // right, then left
      date: `${startDate} – ${endDate}`,
      role: exp.Role,
      company: exp.CompanyName,
      location: exp.WorkLocation,
      description: exp.Description,
      tags: exp.KeySkills || [],
      nodeAt: staticNodePositions[index], // FIXED: 0.13, 0.56
    };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// ProgressLine
// ─────────────────────────────────────────────────────────────────────────────
function ProgressLine({ experiences }) {
  const lineTrackRef = useRef(null);
  const lineFillRef = useRef(null);

  // Initialize refs for exactly 2 experiences (static)
  const nodeRefs = useRef([React.createRef(), React.createRef()]);
  const cardRefs = useRef([React.createRef(), React.createRef()]);
  const pillRefs = useRef([React.createRef(), React.createRef()]);

  // reveal state trackers (static length)
  const cardRevealedRef = useRef([false, false]);
  const pillRevealedRef = useRef([false, false]);

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

      // ── opacity envelope ──────────────────────────────────────────────────
      let opacity = 0;
      if (localProgress < 0.08) {
        opacity = localProgress / 0.08;
      } else if (localProgress > 0.82) {
        opacity = 1 - (localProgress - 0.82) / 0.18;
      } else {
        opacity = 1;
      }

      // ── line fill ─────────────────────────────────────────────────────────
      const growProgress = Math.max(
        0,
        Math.min(1, (localProgress - 0.08) / 0.74),
      );
      const lineHeight = growProgress * 100;

      lineTrack.style.opacity = opacity;
      lineFill.style.height = `${lineHeight}vh`;

      // ── node + card + pill reveal (only for 2 items) ─────────────────────
      experiences.slice(0, 2).forEach((exp, i) => {
        const nodeDot = nodeRefs.current[i]?.current;
        const card = cardRefs.current[i]?.current;
        const pill = pillRefs.current[i]?.current;

        if (!nodeDot || !card || !pill) return;

        const activated = growProgress >= exp.nodeAt;
        const pillSide = exp.side === "right" ? "left" : "right";

        // node dot pulse
        nodeDot.style.opacity = activated ? "1" : "0";
        nodeDot.style.transform = activated
          ? "translateX(-50%) scale(1)"
          : "translateX(-50%) scale(0.4)";

        // ── card slide-in ───────────────────────────────────────────────────
        if (activated && !cardRevealedRef.current[i]) {
          cardRevealedRef.current[i] = true;
          card.style.opacity = "1";
          card.style.transform = "translateY(0) translateX(0)";
        }
        if (!activated && cardRevealedRef.current[i]) {
          cardRevealedRef.current[i] = false;
          card.style.opacity = "0";
          card.style.transform =
            exp.side === "right"
              ? "translateY(12px) translateX(16px)"
              : "translateY(12px) translateX(-16px)";
        }

        // ── pill slide-in (SYNCED with card) ────────────────────────────────
        if (activated && !pillRevealedRef.current[i]) {
          pillRevealedRef.current[i] = true;
          pill.style.opacity = "1";
          pill.style.transform = "translateY(0) translateX(0)";
        }
        if (!activated && pillRevealedRef.current[i]) {
          pillRevealedRef.current[i] = false;
          pill.style.opacity = "0";
          pill.style.transform =
            pillSide === "left"
              ? "translateY(12px) translateX(-16px)"
              : "translateY(12px) translateX(16px)";
        }
      });
    };

    window.addEventListener("bgscroll", handleBgScroll);
    return () => window.removeEventListener("bgscroll", handleBgScroll);
  }, [experiences]);

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
      {/* ── Growing purple fill ─────────────────────────────────────────── */}
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
        {/* Glowing tip dot */}
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

      {/* ── Experience nodes + pills + cards (max 2) ─────────────────────── */}
      {experiences.slice(0, 2).map((exp, i) => (
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

          {/* Date pill (animated) */}
          <DatePill exp={exp} pillRef={pillRefs.current[i]} />

          {/* Experience card */}
          <ExperienceCard exp={exp} cardRef={cardRefs.current[i]} />
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DatePill component
// ─────────────────────────────────────────────────────────────────────────────
function DatePill({ exp, pillRef }) {
  const pillSide = exp.side === "right" ? "left" : "right";
  const initialTransform =
    pillSide === "left"
      ? "translateY(12px) translateX(-16px)"
      : "translateY(12px) translateX(16px)";

  return (
    <div
      ref={pillRef}
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
        opacity: 0,
        transform: initialTransform,
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}>
      {exp.date}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExperienceCard component
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
      {/* Role + location */}
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

      {/* Tags/Skills */}
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
// Main Experience component - accepts profile prop
// ─────────────────────────────────────────────────────────────────────────────
export default function Experience({ profile }) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  // Transform API data to UI format with STATIC positions
  const experiences = useMemo(() => {
    return transformExperiences(profile?.WorkExperience || []);
  }, [profile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle empty state gracefully
  if (experiences.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-muted)",
          fontSize: "18px",
        }}>
        No work experience to display.
      </div>
    );
  }

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
      {mounted &&
        createPortal(<ProgressLine experiences={experiences} />, document.body)}
    </div>
  );
}
