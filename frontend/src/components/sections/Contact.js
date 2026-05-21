"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";

// ── Scroll Section Constants ─────────────────────────────────────────────────
const SECTION_START = 0.82;
const SECTION_END = 1;
const SECTION_SPAN = SECTION_END - SECTION_START;

// ── Shared style tokens ────────────────────────────────────────────────────────
const VIOLET = "#7033fc";
const VIOLET_LT = "#c084fc";
const EASE_SHARP = "cubic-bezier(0.77,0,0.18,1)";

// ── Breakpoint Hook ───────────────────────────────────────────────────────────
function useBreakpoint() {
  const getBreakpoint = (w) => {
    if (w < 480) return "mobile";
    if (w < 768) return "tablet";
    if (w < 1024) return "laptop";
    return "desktop";
  };

  const [bp, setBp] = useState(() =>
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth)
      : "desktop",
  );

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return bp;
}

// ── Responsive helpers ────────────────────────────────────────────────────────
const isMobileOrTablet = (bp) => bp === "mobile" || bp === "tablet";
const isMobile = (bp) => bp === "mobile";

// ── Panel glass style ─────────────────────────────────────────────────────────
const getPanelStyle = (bp) => ({
  background: "var(--header-bg)",
  backdropFilter: "blur(12px) saturate(160%)",
  WebkitBackdropFilter: "blur(12px) saturate(160%)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  padding: isMobile(bp) ? "14px 14px 16px" : "26px 28px 28px",
  boxShadow: "var(--card-shadow)",
  position: "relative",
  overflow: "hidden",
  height: isMobileOrTablet(bp) ? "auto" : 400,
  zIndex: 10,
});

// Top shimmer line inside panels
const PanelShimmer = () => (
  <span
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 1,
      background:
        "linear-gradient(90deg, transparent, rgba(139,92,246,0.5) 50%, transparent)",
      display: "block",
      pointerEvents: "none",
    }}
  />
);

// Field panel with scroll-synced reveal
function FieldPanel({ focused, children, style, revealProgress }) {
  const opacity = Math.min(1, Math.max(0, (revealProgress - 0.1) / 0.35));
  const translateY = revealProgress < 0.45 ? 12 * (1 - opacity) : 0;

  return (
    <div
      style={{
        background: focused
          ? "rgba(139,92,246,0.06)"
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(139,92,246,0.38)" : "var(--color-accent)"}`,
        borderRadius: 10,
        overflow: "hidden",
        padding: "13px 16px 11px",
        position: "relative",
        transition:
          "opacity 0.06s linear, transform 0.06s linear, background 0.25s ease, border-color 0.25s ease",
        zIndex: 20,
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: "opacity, transform",
        ...style,
      }}>
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.35) 50%, transparent)",
          display: "block",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

// Base input style
const inputStyle = {
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: 14,
  fontWeight: 500,
  color: "var(--color-text-muted)",
  width: "100%",
  caretColor: VIOLET,
  display: "block",
  position: "relative",
  zIndex: 20,
};

// ── Contact item config with icons ─────────────────────────────────────────────
const getContactItems = (contactInfo) => [
  {
    id: "email",
    label: "EMAIL",
    value: contactInfo?.Email || "Not provided",
    href: contactInfo?.Email ? `mailto:${contactInfo.Email}` : "#",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LINKEDIN",
    value: contactInfo?.LinkedIn?.replace(/^https?:\/\//, "") || "Not provided",
    href: contactInfo?.LinkedIn || "#",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    id: "phone",
    label: "PHONE",
    value: contactInfo?.PhoneNo || "Not provided",
    href: contactInfo?.PhoneNo ? `tel:${contactInfo.PhoneNo}` : "#",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.72 6.72l1.46-1.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.04z" />
      </svg>
    ),
  },
];

// ── Desktop: Animated Contact Item (full row with label + value) ──────────────
function ContactItemDesktop({
  c,
  idx,
  revealProgress,
  hoveredContact,
  setHoveredContact,
}) {
  const isHov = hoveredContact === c.id;
  const isLast = idx === 2;

  const itemRevealStart = 0.25 + idx * 0.12;
  const itemOpacity = Math.min(
    1,
    Math.max(0, (revealProgress - itemRevealStart) / 0.4),
  );
  const itemTranslateX =
    revealProgress < itemRevealStart + 0.4 ? 14 * (1 - itemOpacity) : 0;

  return (
    <a
      key={c.id}
      href={c.href}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 0",
        borderBottom: isLast ? "none" : "1px solid var(--color-border)",
        textDecoration: "none",
        color: "var(--color-text)",
        position: "relative",
        overflow: "hidden",
        cursor: c.href !== "#" ? "pointer" : "not-allowed",
        zIndex: 20,
        opacity: c.href === "#" ? 0.6 : itemOpacity,
        transform: `translateX(${itemTranslateX}px)`,
        transition: "opacity 0.06s linear, transform 0.06s linear",
        willChange: "opacity, transform",
      }}
      onMouseEnter={() => c.href !== "#" && setHoveredContact(c.id)}
      onMouseLeave={() => setHoveredContact(null)}
      target={c.id === "linkedin" && c.href !== "#" ? "_blank" : undefined}
      rel="noreferrer">
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: `linear-gradient(180deg, ${VIOLET}, ${VIOLET_LT})`,
          transform: isHov ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "bottom",
          transition: `transform 0.3s ${EASE_SHARP}`,
          display: "block",
        }}
      />
      <div
        style={{
          width: 34,
          height: 34,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isHov ? VIOLET_LT : "var(--color-text)",
          transition: "color 0.25s, transform 0.3s",
          flexShrink: 0,
          marginLeft: 10,
          transform: isHov ? "rotate(-8deg) scale(1.1)" : "none",
        }}>
        {c.icon}
      </div>
      <div style={{ flex: 1, paddingLeft: 12 }}>
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "var(--color-text-muted)",
            display: "block",
            marginBottom: 2,
          }}>
          {c.label}
        </span>
        <span
          style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}>
          {c.value}
        </span>
      </div>
      <svg
        style={{
          opacity: isHov && c.href !== "#" ? 1 : 0,
          transform:
            isHov && c.href !== "#"
              ? "translate(0, 0)"
              : "translate(-8px, 8px)",
          transition: "opacity 0.25s, transform 0.25s",
          color: "rgba(139,92,246,0.8)",
          marginRight: 4,
          flexShrink: 0,
        }}
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8">
        <path d="M2 14L14 2M14 2H5M14 2v9" />
      </svg>
    </a>
  );
}

// ── Mobile: Icon-only contact row with tap-to-reveal ─────────────────────────
function ContactIconRow({ contacts, revealProgress }) {
  const [activeId, setActiveId] = useState(null);

  const rowOpacity = Math.min(1, Math.max(0, (revealProgress - 0.25) / 0.4));

  const handleIconClick = (c) => {
    if (c.href === "#") return;
    // Toggle tooltip; if already open, navigate
    if (activeId === c.id) {
      // Second tap → navigate
      if (c.id === "linkedin") {
        window.open(c.href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = c.href;
      }
    } else {
      setActiveId(c.id);
    }
  };

  // Close tooltip when tapping outside
  useEffect(() => {
    if (!activeId) return;
    const close = (e) => {
      if (!e.target.closest(".contact-icon-btn")) setActiveId(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [activeId]);

  return (
    <div
      style={{
        opacity: rowOpacity,
        transition: "opacity 0.06s linear",
        willChange: "opacity",
        background: "var(--header-bg)",
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        border: "1px solid var(--color-border)",
        borderRadius: 16,
        padding: "16px 20px",
        position: "relative",
        overflow: "visible",
        boxShadow: "var(--card-shadow)",
        zIndex: 10,
      }}>
      <PanelShimmer />

      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}>
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--color-text)",
            letterSpacing: "-0.01em",
          }}>
          My Contacts
        </span>
        {/* Status dot */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 10px #4ade80",
              animation: "pulse 2.5s ease-in-out infinite",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 8,
              letterSpacing: "0.12em",
              color: "var(--color-text-muted)",
            }}>
            OPEN TO WORK
          </span>
        </span>
      </div>

      {/* Icons row */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-around",
        }}>
        {contacts.map((c, idx) => {
          const isActive = activeId === c.id;
          const itemRevealStart = 0.3 + idx * 0.1;
          const itemOpacity = Math.min(
            1,
            Math.max(0, (revealProgress - itemRevealStart) / 0.35),
          );

          return (
            <div
              key={c.id}
              style={{ position: "relative", flex: 1, textAlign: "center" }}>
              {/* Tooltip bubble */}
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--color-bg)",
                    border: `1px solid ${VIOLET}55`,
                    borderRadius: 10,
                    padding: "8px 14px",
                    minWidth: 160,
                    maxWidth: 220,
                    zIndex: 200,
                    animation: "tooltipIn 0.18s ease",
                    boxShadow: `0 4px 24px rgba(112,51,252,0.25)`,
                    pointerEvents: "none",
                  }}>
                  {/* Caret */}
                  <span
                    style={{
                      position: "absolute",
                      bottom: -6,
                      left: "50%",
                      transform: "translateX(-50%) rotate(45deg)",
                      width: 10,
                      height: 10,
                      background: "var(--color-bg)",
                      border: `1px solid ${VIOLET}55`,
                      borderTop: "none",
                      borderLeft: "none",
                      display: "block",
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      color: "var(--color-text-muted)",
                      display: "block",
                      marginBottom: 3,
                    }}>
                    {c.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--color-text)",
                      display: "block",
                      wordBreak: "break-all",
                      lineHeight: 1.4,
                    }}>
                    {c.value}
                  </span>
                </div>
              )}

              {/* Icon button */}
              <button
                type="button"
                className="contact-icon-btn"
                onClick={() => handleIconClick(c)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: isActive
                    ? `rgba(112,51,252,0.18)`
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isActive ? `${VIOLET}88` : "var(--color-border)"}`,
                  color: isActive ? VIOLET_LT : "var(--color-text)",
                  cursor: c.href !== "#" ? "pointer" : "not-allowed",
                  opacity: c.href === "#" ? 0.4 : itemOpacity,
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                  transition:
                    "background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.18s ease, opacity 0.06s linear",
                  boxShadow: isActive
                    ? `0 0 16px rgba(112,51,252,0.3)`
                    : "none",
                  outline: "none",
                  willChange: "opacity, transform",
                }}>
                {c.icon}
              </button>

              {/* Label below icon */}
              <span
                style={{
                  display: "block",
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  color: isActive ? VIOLET_LT : "var(--color-text-muted)",
                  marginTop: 6,
                  transition: "color 0.2s ease",
                }}>
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Contact Content (rendered inside portal) ─────────────────────────────
function ContactContent({ profile, revealProgress }) {
  const bp = useBreakpoint();

  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [titleHovered, setTitleHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const canvasRef = useRef(null);

  const contactInfo = profile?.ContactInfo || {};
  const CONTACTS = useMemo(() => getContactItems(contactInfo), [contactInfo]);

  // ── Responsive derived values ─────────────────────────────────────────────
  const isSmall = isMobileOrTablet(bp);
  const isTiny = isMobile(bp);

  const gridCols = isSmall ? "1fr" : "1fr 340px";

  const titleFontSize = isTiny
    ? "22px"
    : isSmall
      ? "30px"
      : bp === "laptop"
        ? "clamp(28px, 3.5vw, 44px)"
        : "clamp(34px, 4vw, 52px)";

  const formInnerGrid = isTiny ? "1fr" : "1fr 1fr";

  // Tighter textarea on mobile to keep everything in viewport
  const textareaMinHeight = isTiny ? 62 : isSmall ? 80 : 150;

  const computedPanelStyle = getPanelStyle(bp);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame,
      t = 0;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.003;
      const cols = 8,
        rows = 5;
      const cw = canvas.width / cols,
        ch = canvas.height / rows;
      for (let i = 0; i <= cols; i++) {
        const x = i * cw,
          wave = Math.sin(t + i * 0.4) * 6;
        ctx.beginPath();
        ctx.moveTo(x + wave, 0);
        ctx.lineTo(x - wave, canvas.height);
        ctx.strokeStyle = `rgba(139,92,246,${0.04 + Math.abs(Math.sin(t + i)) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        const y = j * ch,
          wave = Math.sin(t + j * 0.6) * 6;
        ctx.beginPath();
        ctx.moveTo(0, y + wave);
        ctx.lineTo(canvas.width, y - wave);
        ctx.strokeStyle = `rgba(139,92,246,${0.04 + Math.abs(Math.sin(t + j)) * 0.04})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const handleChange = (e) =>
    setFormState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSendMessage = () => {
    const { name, phone, email, message } = formState;
    const recipientEmail = profile?.ContactInfo?.Email;
    const firstName = profile?.FirstName || "there";

    if (!recipientEmail) {
      alert(
        "Recipient email not available. Please check your profile settings.",
      );
      return;
    }
    if (!name || !email || !message) {
      alert("Please fill in your Name, Email, and Message to proceed.");
      return;
    }

    const subject = `New Message from ${name} - Portfolio Inquiry`;
    const body =
      `Hi ${firstName},\n\n${message}\n\nBest regards,\n${name}\nPhone No.: ${phone || "Not provided"}\nEmail: ${email}`.trim();

    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const encodedTo = encodeURIComponent(recipientEmail);

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
    const mailtoUrl = `mailto:${encodedTo}?subject=${encodedSubject}&body=${encodedBody}`;

    const gmailWindow = window.open(gmailUrl, "_blank", "noopener,noreferrer");
    const checkFallback = () => {
      setTimeout(() => {
        if (
          !gmailWindow ||
          gmailWindow.closed ||
          typeof gmailWindow.closed === "undefined"
        ) {
          window.location.href = mailtoUrl;
        }
      }, 1500);
    };
    checkFallback();

    setSent(true);
    setTimeout(() => setSent(false), 3500);
    setFormState({ name: "", phone: "", email: "", message: "" });
  };

  // ── Scroll-synced reveal values ───────────────────────────────────────────
  const titleReveal = revealProgress;
  const formPanelReveal = Math.min(
    1,
    Math.max(0, (revealProgress - 0.12) / 0.35),
  );
  const contactsPanelReveal = Math.min(
    1,
    Math.max(0, (revealProgress - 0.15) / 0.35),
  );
  const submitBtnReveal = Math.min(
    1,
    Math.max(0, (revealProgress - 0.45) / 0.3),
  );
  const statusReveal = Math.min(1, Math.max(0, (revealProgress - 0.55) / 0.3));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        @keyframes tooltipIn { from { opacity: 0; transform: translateX(-50%) translateY(6px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .pf-input::placeholder, .pf-textarea::placeholder { color: var(--color-text-muted); font-weight: 400; }

        @media (max-width: 479px) {
          .contact-status-text {
            font-size: 8px !important;
            letter-spacing: 0.08em !important;
          }
          .contact-send-btn {
            padding: 11px 20px !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <section
        style={{
          color: "#fff",

          /* ── compact responsive spacing ── */
          paddingTop: isTiny
            ? "56px"
            : isSmall
              ? "60px"
              : bp === "laptop"
                ? "64px"
                : "72px",

          paddingRight: isTiny
            ? "14px"
            : isSmall
              ? "20px"
              : bp === "laptop"
                ? "40px"
                : "60px",

          paddingBottom: isTiny
            ? "14px"
            : isSmall
              ? "20px"
              : bp === "laptop"
                ? "96px"
                : "100px",

          paddingLeft: isTiny
            ? "14px"
            : isSmall
              ? "20px"
              : bp === "laptop"
                ? "40px"
                : "60px",

          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",

          width: "100%",
          maxWidth: 1400,

          /* ── FIX FOR MOBILE TRIMMING ── */
          minHeight: "100dvh",
          height: "100dvh",

          boxSizing: "border-box",

          display: "flex",
          flexDirection: "column",

          /* desktop centered, mobile stretched */
          justifyContent: isSmall ? "space-around" : "center",

          /* allow proper scrolling on shorter devices */
          overflowY: isSmall ? "auto" : "hidden",
          overflowX: "hidden",

          WebkitOverflowScrolling: "touch",

          pointerEvents: "none",
          zIndex: 1000,
        }}>
        <div
          style={{
            pointerEvents: revealProgress > 0 ? "auto" : "none",
            width: "100%",
            /* ── VERTICAL SPACE-AROUND FOR MOBILE: Two main blocks ── */
            display: isSmall ? "flex" : "block",
            flexDirection: isSmall ? "column" : undefined,
            justifyContent: isSmall ? "space-around" : undefined,
            minHeight: isSmall ? "100%" : undefined,
          }}>
          {/* ── HEADER ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              marginBottom: isTiny ? 16 : isSmall ? 22 : 44,
              display: "flex",
              alignItems: "flex-end",
              gap: 32,
              opacity: titleReveal,
              transform: `translateY(${(1 - titleReveal) * 28}px)`,
              transition: "opacity 0.06s linear, transform 0.06s linear",
              willChange: "opacity, transform",
              /* On mobile, let header shrink to fit content within space-around */
              flexShrink: isSmall ? 0 : undefined,
            }}>
            <div
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}>
              <h2
                style={{
                  fontSize: titleFontSize,
                  fontWeight: 200,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  cursor: "default",
                  display: "inline-block",
                }}>
                <span
                  style={{
                    display: "inline-block",
                    background: `linear-gradient(90deg, ${VIOLET} 0%, ${VIOLET_LT} 50%, var(--color-text) 50%, var(--color-text) 100%)`,
                    backgroundSize: "200% 100%",
                    backgroundPosition: titleHovered ? "0% 0" : "100% 0",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    transition: `background-position 0.20s ${EASE_SHARP}`,
                  }}>
                  Let's Connect
                </span>
                <span
                  style={{
                    display: "block",
                    height: 2,
                    marginTop: 7,
                    background: "var(--color-text-muted)",
                    borderRadius: 2,
                    position: "relative",
                    overflow: "hidden",
                  }}>
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, ${VIOLET}, ${VIOLET_LT})`,
                      transform: titleHovered ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left",
                      transition: `transform 0.20s ${EASE_SHARP}`,
                      borderRadius: 2,
                      display: "block",
                    }}
                  />
                </span>
              </h2>
            </div>
          </div>

          {/* ── MAIN GRID / FLEX CONTAINER ── */}
          <div
            style={{
              /* On mobile: flex column with space-around for vertical distribution */
              display: isSmall ? "flex" : "grid",
              flexDirection: isSmall ? "column" : undefined,
              justifyContent: isSmall ? "space-around" : undefined,
              /* On desktop: grid with two columns */
              gridTemplateColumns: isSmall ? undefined : gridCols,
              gap: isTiny ? 12 : 22,
              position: "relative",
              zIndex: 10,
              alignItems: isSmall ? "stretch" : "start",
              /* Ensure children can grow/shrink properly for space-around */
              flex: isSmall ? 1 : undefined,
              minHeight: isSmall ? 0 : undefined,
            }}>
            {/* ── LEFT: Form ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                opacity: formPanelReveal,
                transform: `translateY(${(1 - formPanelReveal) * 22}px)`,
                transition: "opacity 0.06s linear, transform 0.06s linear",
                willChange: "opacity, transform",
                /* Allow form block to size naturally within space-around */
                flex: isSmall ? "0 0 auto" : undefined,
              }}>
              <div style={computedPanelStyle}>
                <PanelShimmer />
                <h3
                  style={{
                    fontSize: isTiny ? 13 : 16,
                    fontWeight: 700,
                    color: "var(--color-text)",
                    margin: isTiny ? "0 0 14px 0" : "0 0 20px 0",
                    letterSpacing: "-0.01em",
                    opacity: formPanelReveal,
                    transform: `translateY(${(1 - formPanelReveal) * 12}px)`,
                    transition: "opacity 0.06s linear, transform 0.06s linear",
                    willChange: "opacity, transform",
                  }}>
                  Send a Message
                </h3>

                {/* Name + Phone row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: formInnerGrid,
                    gap: 10,
                    marginBottom: 10,
                  }}>
                  <FieldPanel
                    focused={focused === "name"}
                    revealProgress={revealProgress}>
                    <input
                      className="pf-input"
                      style={{ ...inputStyle, fontSize: isTiny ? 13 : 14 }}
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={handleChange}
                      onFocus={() => setFocused("name")}
                      onBlur={() => setFocused(null)}
                      autoComplete="off"
                    />
                  </FieldPanel>
                  <FieldPanel
                    focused={focused === "phone"}
                    revealProgress={revealProgress}>
                    <input
                      className="pf-input"
                      style={{ ...inputStyle, fontSize: isTiny ? 13 : 14 }}
                      name="phone"
                      type="text"
                      placeholder="Contact Number"
                      value={formState.phone}
                      onChange={handleChange}
                      onFocus={() => setFocused("phone")}
                      onBlur={() => setFocused(null)}
                      autoComplete="off"
                    />
                  </FieldPanel>
                </div>

                <FieldPanel
                  focused={focused === "email"}
                  style={{ marginBottom: 10 }}
                  revealProgress={revealProgress}>
                  <input
                    className="pf-input"
                    style={{ ...inputStyle, fontSize: isTiny ? 13 : 14 }}
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formState.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    autoComplete="off"
                  />
                </FieldPanel>

                <FieldPanel
                  focused={focused === "message"}
                  revealProgress={revealProgress}>
                  <textarea
                    className="pf-textarea"
                    style={{
                      ...inputStyle,
                      fontSize: isTiny ? 13 : 14,
                      resize: "none",
                      minHeight: textareaMinHeight,
                      lineHeight: 1.6,
                    }}
                    name="message"
                    placeholder="Your Message"
                    value={formState.message}
                    onChange={handleChange}
                    onFocus={() => setFocused("message")}
                    onBlur={() => setFocused(null)}
                  />
                </FieldPanel>
              </div>

              {/* Submit button row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginTop: isTiny ? 12 : 18,
                  position: "relative",
                  zIndex: 10,
                  opacity: submitBtnReveal,
                  transform: `translateY(${(1 - submitBtnReveal) * 12}px)`,
                  transition: "opacity 0.06s linear, transform 0.06s linear",
                  willChange: "opacity, transform",
                  flexWrap: "wrap",
                }}>
                <button
                  type="button"
                  className="contact-send-btn"
                  onClick={handleSendMessage}
                  onMouseEnter={() => setBtnHovered(true)}
                  onMouseLeave={() => setBtnHovered(false)}
                  style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "13px 30px",
                    background: "var(--color-text)",
                    border: `1px solid ${btnHovered ? VIOLET : "var(--color-accent)"}`,
                    color: "var(--color-bg)",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "border-color 0.3s ease",
                    clipPath:
                      "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                  }}>
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(135deg, ${VIOLET}, #6d28d9)`,
                      transform: btnHovered
                        ? "translateX(0)"
                        : "translateX(-101%)",
                      transition: `transform 0.4s ${EASE_SHARP}`,
                      zIndex: 0,
                    }}
                  />
                  <span style={{ position: "relative", zIndex: 1 }}>
                    SEND MESSAGE
                  </span>
                  <svg
                    style={{
                      width: 13,
                      height: 13,
                      position: "relative",
                      zIndex: 1,
                      transition: "transform 0.3s ease",
                      transform: btnHovered ? "translate(3px, -3px)" : "none",
                    }}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8">
                    <path d="M2 14L14 2M14 2H5M14 2v9" />
                  </svg>
                </button>
                {sent && (
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      color: "#4ade80",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      animation: "fadeIn 0.4s ease",
                    }}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    MESSAGE SENT
                  </span>
                )}
              </div>
            </div>

            {/* ── RIGHT: Contacts panel ─────────────────────────────────────
                Desktop/laptop: full list rows (unchanged)
                Mobile/tablet : compact icon row with tap-to-reveal
            ────────────────────────────────────────────────────────────── */}
            {isSmall ? (
              /* ── MOBILE / TABLET: icon-only row ── */
              <div
                style={{
                  opacity: contactsPanelReveal,
                  transform: `translateY(${(1 - contactsPanelReveal) * 22}px)`,
                  transition: "opacity 0.06s linear, transform 0.06s linear",
                  willChange: "opacity, transform",
                  /* Allow contacts block to size naturally within space-around */
                  flex: isSmall ? "0 0 auto" : undefined,
                }}>
                <ContactIconRow
                  contacts={CONTACTS}
                  revealProgress={revealProgress}
                />
              </div>
            ) : (
              /* ── DESKTOP / LAPTOP: full list (original) ── */
              <div
                style={{
                  ...computedPanelStyle,
                  opacity: contactsPanelReveal,
                  transform: `translateY(${(1 - contactsPanelReveal) * 22}px)`,
                  transition: "opacity 0.06s linear, transform 0.06s linear",
                  willChange: "opacity, transform",
                }}>
                <PanelShimmer />
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-text)",
                    margin: "0 0 20px 0",
                    letterSpacing: "-0.01em",
                    display: "block",
                  }}>
                  My Contacts
                </span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {CONTACTS.map((c, idx) => (
                    <ContactItemDesktop
                      key={c.id}
                      c={c}
                      idx={idx}
                      revealProgress={revealProgress}
                      hoveredContact={hoveredContact}
                      setHoveredContact={setHoveredContact}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginTop: 60,
                    paddingTop: 18,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    opacity: statusReveal,
                    transform: `translateY(${(1 - statusReveal) * 8}px)`,
                    transition: "opacity 0.06s linear, transform 0.06s linear",
                    willChange: "opacity, transform",
                  }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 10px #4ade80",
                      animation: "pulse 2.5s ease-in-out infinite",
                      flexShrink: 0,
                      display: "inline-block",
                    }}
                  />
                  <span
                    className="contact-status-text"
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      color: "var(--color-text-muted)",
                    }}>
                    OPEN TO WORK · RESPONSE WITHIN 24H
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      </section>
    </>
  );
}

// ── Main Export: Portal-wrapped Contact Section ───────────────────────────────
export default function ContactSection({ profile }) {
  const [revealProgress, setRevealProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleBgScroll = (e) => {
      const globalProgress = e.detail;
      let localProgress = (globalProgress - SECTION_START) / SECTION_SPAN;
      localProgress = Math.max(0, Math.min(1, localProgress));
      const easedProgress = localProgress * (3 - 2 * localProgress);
      setRevealProgress(easedProgress);
    };

    window.addEventListener("bgscroll", handleBgScroll);
    return () => window.removeEventListener("bgscroll", handleBgScroll);
  }, []);

  if (!profile) return null;

  return (
    <div
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
          <ContactContent profile={profile} revealProgress={revealProgress} />,
          document.body,
        )}
    </div>
  );
}
