"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";

const SECTION_START = 0.62;
const SECTION_END = 0.8;
const SECTION_SPAN = SECTION_END - SECTION_START;

// ─────────────────────────────────────────────────────────────────────────────
// Hook: detect mobile viewport
// ─────────────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

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
// Layout constants
//

// ─────────────────────────────────────────────────────────────────────────────
const NODE_RANGE_START = 0.13;
const NODE_RANGE_END = 0.88;

const SLOT_TOP = 0.13;
const SLOT_BOTTOM = 0.58;
const SLOT_CENTER = 0.36;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Transform API work experience to UI format
// Dynamically chunks experiences into top/bottom pairs (or a single centered
// item), each chunk owning its own scroll-trigger window.
// ─────────────────────────────────────────────────────────────────────────────
const transformExperiences = (workExperiences) => {
  if (!workExperiences || workExperiences.length === 0) return [];

  const total = workExperiences.length;
  const numChunks = Math.ceil(total / 2);

  // Trigger point (along growProgress, 0..1) at which each chunk activates.
  const chunkThresholds = Array.from({ length: numChunks }, (_, c) => {
    if (numChunks === 1) return NODE_RANGE_START;
    return (
      NODE_RANGE_START +
      (c / (numChunks - 1)) * (NODE_RANGE_END - NODE_RANGE_START)
    );
  });

  return workExperiences.map((exp, index) => {
    const startDate = formatDate(exp.StartDate);
    const endDate = exp.EndDate ? formatDate(exp.EndDate) : "Present";

    const chunkIndex = Math.floor(index / 2);
    const isLastChunk = chunkIndex === numChunks - 1;
    const itemsInThisChunk = isLastChunk && total % 2 === 1 ? 1 : 2;

    let slot;
    let pos;
    if (itemsInThisChunk === 1) {
      slot = "center";
      pos = SLOT_CENTER;
    } else if (index % 2 === 0) {
      slot = "top";
      pos = SLOT_TOP;
    } else {
      slot = "bottom";
      pos = SLOT_BOTTOM;
    }

    const triggerStart = chunkThresholds[chunkIndex];
    const triggerEnd =
      chunkIndex + 1 < numChunks ? chunkThresholds[chunkIndex + 1] : Infinity;

    return {
      id: exp._id || index,
      side: index % 2 === 0 ? "right" : "left",
      date: `${startDate} – ${endDate}`,
      role: exp.Role,
      company: exp.CompanyName,
      location: exp.WorkLocation,
      description: exp.Description,
      tags: exp.KeySkills || [],
      slot,
      pos,
      triggerStart,
      triggerEnd,
    };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP: ProgressLine
// ─────────────────────────────────────────────────────────────────────────────
function ProgressLine({ experiences }) {
  const lineTrackRef = useRef(null);
  const lineFillRef = useRef(null);

  const nodeRefs = useRef(experiences.map(() => React.createRef()));
  const cardRefs = useRef(experiences.map(() => React.createRef()));
  const pillRefs = useRef(experiences.map(() => React.createRef()));

  const cardRevealedRef = useRef(experiences.map(() => false));
  const pillRevealedRef = useRef(experiences.map(() => false));

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

      let opacity = 0;
      if (localProgress < 0.08) {
        opacity = localProgress / 0.08;
      } else if (localProgress > 0.82) {
        opacity = 1 - (localProgress - 0.82) / 0.18;
      } else {
        opacity = 1;
      }

      const growProgress = Math.max(
        0,
        Math.min(1, (localProgress - 0.08) / 0.74),
      );
      const lineHeight = growProgress * 100;

      lineTrack.style.opacity = opacity;
      lineFill.style.height = `${lineHeight}vh`;

      experiences.forEach((exp, i) => {
        const nodeDot = nodeRefs.current[i]?.current;
        const card = cardRefs.current[i]?.current;
        const pill = pillRefs.current[i]?.current;

        if (!nodeDot || !card || !pill) return;

        // Active only while growProgress is inside this item's chunk window.
        const activated =
          growProgress >= exp.triggerStart && growProgress < exp.triggerEnd;
        const pillSide = exp.side === "right" ? "left" : "right";

        nodeDot.style.opacity = activated ? "1" : "0";
        nodeDot.style.transform = activated
          ? "translateX(-50%) scale(1)"
          : "translateX(-50%) scale(0.4)";

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

      {experiences.map((exp, i) => (
        <React.Fragment key={exp.id}>
          <div
            ref={nodeRefs.current[i]}
            style={{
              position: "absolute",
              top: `calc(${exp.pos * 100}vh - 6px)`,
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
          <DatePill exp={exp} pillRef={pillRefs.current[i]} />
          <ExperienceCard exp={exp} cardRef={cardRefs.current[i]} />
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP: DatePill
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
        top: `calc(${exp.pos * 100}vh - 14px)`,
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
// DESKTOP: ExperienceCard
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
        top: `calc(${exp.pos * 100}vh - 20px)`,
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
        pointerEvents: "auto",
        zIndex: 10000,
        textAlign: isRight ? "left" : "right",
      }}>
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

      <div
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, rgba(168,85,247,0.3), transparent)",
          marginBottom: "12px",
        }}
      />

      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          fontSize: "13.5px",
          color: "var(--color-text)",
          lineHeight: 1.65,
          marginBottom: "14px",
          paddingRight: "6px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(168,85,247,0.4) transparent",
        }}>
        {exp.description}
      </div>

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
// MOBILE: MobileProgressLine
// ─────────────────────────────────────────────────────────────────────────────
function MobileProgressLine({ experiences }) {
  const lineTrackRef = useRef(null);
  const lineFillRef = useRef(null);

  const nodeRefs = useRef(experiences.map(() => React.createRef()));
  const cardRefs = useRef(experiences.map(() => React.createRef()));
  const pillRefs = useRef(experiences.map(() => React.createRef()));

  const cardRevealedRef = useRef(experiences.map(() => false));
  const pillRevealedRef = useRef(experiences.map(() => false));

  const LINE_LEFT = 24;

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

      let opacity = 0;
      if (localProgress < 0.08) {
        opacity = localProgress / 0.08;
      } else if (localProgress > 0.82) {
        opacity = 1 - (localProgress - 0.82) / 0.18;
      } else {
        opacity = 1;
      }

      const growProgress = Math.max(
        0,
        Math.min(1, (localProgress - 0.08) / 0.74),
      );
      const lineHeight = growProgress * 100;

      lineTrack.style.opacity = opacity;
      lineFill.style.height = `${lineHeight}vh`;

      experiences.forEach((exp, i) => {
        const nodeDot = nodeRefs.current[i]?.current;
        const card = cardRefs.current[i]?.current;
        const pill = pillRefs.current[i]?.current;

        if (!nodeDot || !card || !pill) return;

        // Active only while growProgress is inside this item's chunk window.
        const activated =
          growProgress >= exp.triggerStart && growProgress < exp.triggerEnd;

        nodeDot.style.opacity = activated ? "1" : "0";
        nodeDot.style.transform = activated
          ? "translateX(-50%) scale(1)"
          : "translateX(-50%) scale(0.4)";

        if (activated && !cardRevealedRef.current[i]) {
          cardRevealedRef.current[i] = true;
          card.style.opacity = "1";
          card.style.transform = "translateY(0) translateX(0)";
        }
        if (!activated && cardRevealedRef.current[i]) {
          cardRevealedRef.current[i] = false;
          card.style.opacity = "0";
          card.style.transform = "translateY(12px) translateX(16px)";
        }

        if (activated && !pillRevealedRef.current[i]) {
          pillRevealedRef.current[i] = true;
          pill.style.opacity = "1";
          pill.style.transform = "translateY(0) translateX(0)";
        }
        if (!activated && pillRevealedRef.current[i]) {
          pillRevealedRef.current[i] = false;
          pill.style.opacity = "0";
          pill.style.transform = "translateY(12px) translateX(16px)";
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
        left: `${LINE_LEFT}px`,
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

      {experiences.map((exp, i) => (
        <React.Fragment key={exp.id}>
          <div
            ref={nodeRefs.current[i]}
            style={{
              position: "absolute",
              top: `calc(${exp.pos * 100}vh - 24px)`,
              left: "50%",
              transform: "translateX(-50%) scale(0.4)",
              width: "12px",
              height: "12px",
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

          <MobileDatePill
            exp={exp}
            pillRef={pillRefs.current[i]}
            lineLeft={LINE_LEFT}
          />

          <MobileExperienceCard
            exp={exp}
            cardRef={cardRefs.current[i]}
            lineLeft={LINE_LEFT}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE: MobileDatePill
// ─────────────────────────────────────────────────────────────────────────────
function MobileDatePill({ exp, pillRef }) {
  const contentGap = 14;

  return (
    <div
      ref={pillRef}
      style={{
        position: "absolute",
        top: `calc(${exp.pos * 100}vh - 28px)`,
        left: `calc(50% + ${contentGap}px)`,
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        color: "#fff",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        padding: "3px 10px",
        borderRadius: "20px",
        whiteSpace: "nowrap",
        boxShadow: "0 3px 10px rgba(124,58,237,0.4)",
        pointerEvents: "none",
        zIndex: 10000,
        opacity: 0,
        transform: "translateY(12px) translateX(16px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
      }}>
      {exp.date}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE: MobileExperienceCard
// ─────────────────────────────────────────────────────────────────────────────
function MobileExperienceCard({ exp, cardRef, lineLeft }) {
  const contentGap = 14;
  const cardLeftFromViewport = lineLeft + 1 + contentGap;
  const cardRightMargin = 16;

  const CARD_HEIGHT = 240;

  return (
    <div
      ref={cardRef}
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        top: `calc(${exp.pos * 100}vh)`,
        left: `calc(50% + ${contentGap}px)`,
        width: `calc(100vw - ${cardLeftFromViewport + cardRightMargin}px)`,
        height: `${CARD_HEIGHT}px`,
        overflow: "hidden",
        background: "var(--glass-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(169, 169, 169, 0.45)",
        borderRadius: "12px",
        padding: "12px",
        boxShadow: "var(--card-shadow)",
        opacity: 0,
        transform: "translateY(12px) translateX(16px)",
        transition:
          "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        zIndex: 10000,
        textAlign: "left",
        boxSizing: "border-box",
      }}>
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "6px",
          }}>
          <div>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                lineHeight: 1.2,
                marginBottom: "1px",
              }}>
              {exp.role}
            </div>
            <div
              style={{
                fontSize: "9px",
                fontWeight: 400,
                color: "#a855f7",
              }}>
              {exp.location}
            </div>
          </div>

          <div
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#7c3aed",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textAlign: "right",
              paddingTop: "2px",
            }}>
            {exp.company}
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, rgba(168,85,247,0.35), transparent)",
            marginBottom: "8px",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
        }}>
        <div
          style={{
            fontSize: "11px",
            color: "var(--color-text)",
            lineHeight: 1.3,
            marginBottom: "10px",
          }}>
          {exp.description}
        </div>
      </div>

      <div
        style={{
          flexShrink: 0,
          paddingTop: "6px",
          paddingBottom: "10px",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
        }}>
        {exp.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "#7c3aed",
              background: "rgba(168,85,247,0.1)",
              border: "1px solid rgba(168,85,247,0.25)",
              borderRadius: "20px",
              padding: "2px 8px",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}>
            {tag}
          </span>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "28px",
          background:
            "linear-gradient(to top, var(--glass-bg, rgba(15,15,25,0.95)) 40%, transparent)",
          pointerEvents: "none",
          borderRadius: "0 0 12px 12px",
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Experience component
// ─────────────────────────────────────────────────────────────────────────────
export default function Experience({ profile }) {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  const experiences = useMemo(() => {
    return transformExperiences(profile?.WorkExperience || []);
  }, [profile]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        createPortal(
          isMobile ? (
            <MobileProgressLine experiences={experiences} />
          ) : (
            <ProgressLine experiences={experiences} />
          ),
          document.body,
        )}
    </div>
  );
}
