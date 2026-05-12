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
// Returns a string: "mobile" | "tablet" | "laptop" | "desktop"
// mobile  : < 480px
// tablet  : 480px – 767px
// laptop  : 768px – 1023px
// desktop : >= 1024px
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

// ── Panel glass style (height responsive) ─────────────────────────────────────
const getPanelStyle = (bp) => ({
  background: "var(--header-bg)",
  backdropFilter: "blur(12px) saturate(160%)",
  WebkitBackdropFilter: "blur(12px) saturate(160%)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  padding: isMobile(bp) ? "18px 16px 20px" : "26px 28px 28px",
  boxShadow: "var(--card-shadow)",
  position: "relative",
  overflow: "hidden",
  // Fixed 400px on desktop/laptop, auto on mobile/tablet so content fits
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
        transition: "background 0.25s ease, border-color 0.25s ease",
        zIndex: 20,
        opacity,
        transform: `translateY(${translateY}px)`,
        // eslint-disable-next-line react/no-unknown-property
        transition:
          "opacity 0.06s linear, transform 0.06s linear, background 0.25s ease, border-color 0.25s ease",
        willChange: "opacity, transform",
        ...style,
      }}
    >
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
        strokeWidth="1.5"
      >
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
        strokeWidth="1.5"
      >
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
        strokeWidth="1.5"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6.72 6.72l1.46-1.46a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.04z" />
      </svg>
    ),
  },
];

// ── Animated Contact Item Component ───────────────────────────────────────────
function ContactItem({
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
      rel="noreferrer"
    >
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
        }}
      >
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
          }}
        >
          {c.label}
        </span>
        <span
          style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text)" }}
        >
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
        strokeWidth="1.8"
      >
        <path d="M2 14L14 2M14 2H5M14 2v9" />
      </svg>
    </a>
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
  const isSmall = isMobileOrTablet(bp); // mobile or tablet  → stack
  const isTiny = isMobile(bp); // mobile only       → tightest spacing

  // Grid layout
  const gridCols = isSmall ? "1fr" : "1fr 340px";

  // Title font size — clamp handled per breakpoint
  const titleFontSize = isTiny
    ? "28px"
    : isSmall
      ? "32px"
      : bp === "laptop"
        ? "clamp(28px, 3.5vw, 44px)"
        : "clamp(34px, 4vw, 52px)";

  // Name/phone grid — single column on mobile
  const formInnerGrid = isTiny ? "1fr" : "1fr 1fr";

  // Textarea min-height
  const textareaMinHeight = isTiny ? 110 : 150;

  // Panel style (height-aware)
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

  // ── Handle Send Message with Gmail + mailto fallback ─────────────────────────
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
    if (gmailWindow) {
      gmailWindow.addEventListener("blur", () => {}, { once: true });
    }

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
        .pf-input::placeholder, .pf-textarea::placeholder { color: var(--color-text-muted); font-weight: 400; }

        /* ── Responsive overrides via media queries ─────────────────────── */

        /* Scrollable overflow on small screens so portal content is reachable */
        @media (max-width: 767px) {
          .contact-section-inner {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
          }
        }

        /* Status badge text: wrap gracefully on tiny screens */
        @media (max-width: 479px) {
          .contact-status-text {
            font-size: 8px !important;
            letter-spacing: 0.08em !important;
          }
          /* Button text shrink */
          .contact-send-btn {
            padding: 11px 20px !important;
            font-size: 11px !important;
          }
        }
      `}</style>

      <section
        className="contact-section-inner"
        style={{
          color: "#fff",
          // ── NO shorthand `padding` here — expanded to avoid React conflict ──
          // Header is fixed ~60-72px tall; add extra clearance on small screens
          paddingTop: isTiny
            ? "88px" // mobile: 88px clears the ~60px header + breathing room
            : isSmall
              ? "80px" // tablet: same logic
              : bp === "laptop"
                ? "64px" // laptop
                : "72px", // desktop (original)
          paddingRight: isTiny
            ? "16px"
            : isSmall
              ? "28px"
              : bp === "laptop"
                ? "40px"
                : "60px",
          paddingBottom: isTiny
            ? "80px"
            : isSmall
              ? "88px"
              : bp === "laptop"
                ? "96px"
                : "100px",
          paddingLeft: isTiny
            ? "16px"
            : isSmall
              ? "28px"
              : bp === "laptop"
                ? "40px"
                : "60px",
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 1400,
          minHeight: "100vh",
          maxHeight: isSmall ? "100vh" : "unset",
          overflowY: isSmall ? "auto" : "unset",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: isSmall ? "flex-start" : "center",
          pointerEvents: "none",
          zIndex: 1000,
        }}
      >
        <div style={{ pointerEvents: "auto", width: "100%" }}>
          {/* ── HEADER ── */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              marginBottom: isTiny ? 24 : isSmall ? 32 : 44,
              display: "flex",
              alignItems: "flex-end",
              gap: 32,
              opacity: titleReveal,
              transform: `translateY(${(1 - titleReveal) * 28}px)`,
              transition: "opacity 0.06s linear, transform 0.06s linear",
              willChange: "opacity, transform",
            }}
          >
            <div
              onMouseEnter={() => setTitleHovered(true)}
              onMouseLeave={() => setTitleHovered(false)}
            >
              <h2
                style={{
                  fontSize: titleFontSize,
                  fontWeight: 200,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  margin: 0,
                  cursor: "default",
                  display: "inline-block",
                }}
              >
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
                  }}
                >
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
                  }}
                >
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

          {/* ── MAIN GRID ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: gridCols,
              gap: isTiny ? 16 : 22,
              position: "relative",
              zIndex: 10,
              alignItems: "start",
            }}
          >
            {/* ── LEFT: Form ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                opacity: formPanelReveal,
                transform: `translateY(${(1 - formPanelReveal) * 22}px)`,
                transition: "opacity 0.06s linear, transform 0.06s linear",
                willChange: "opacity, transform",
              }}
            >
              <div style={computedPanelStyle}>
                <PanelShimmer />
                <h3
                  style={{
                    fontSize: isTiny ? 14 : 16,
                    fontWeight: 700,
                    color: "var(--color-text)",
                    margin: "0 0 20px 0",
                    letterSpacing: "-0.01em",
                    opacity: formPanelReveal,
                    transform: `translateY(${(1 - formPanelReveal) * 12}px)`,
                    transition: "opacity 0.06s linear, transform 0.06s linear",
                    willChange: "opacity, transform",
                  }}
                >
                  Send a Message
                </h3>
                {/* Name + Phone row — stacks to 1 col on mobile */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: formInnerGrid,
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <FieldPanel
                    focused={focused === "name"}
                    revealProgress={revealProgress}
                  >
                    <input
                      className="pf-input"
                      style={inputStyle}
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
                    revealProgress={revealProgress}
                  >
                    <input
                      className="pf-input"
                      style={inputStyle}
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
                  style={{ marginBottom: 12 }}
                  revealProgress={revealProgress}
                >
                  <input
                    className="pf-input"
                    style={inputStyle}
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
                  revealProgress={revealProgress}
                >
                  <textarea
                    className="pf-textarea"
                    style={{
                      ...inputStyle,
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
                  marginTop: 18,
                  position: "relative",
                  zIndex: 10,
                  opacity: submitBtnReveal,
                  transform: `translateY(${(1 - submitBtnReveal) * 12}px)`,
                  transition: "opacity 0.06s linear, transform 0.06s linear",
                  willChange: "opacity, transform",
                  flexWrap: "wrap", // so "MESSAGE SENT" badge wraps on tiny screens
                }}
              >
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
                  }}
                >
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
                    strokeWidth="1.8"
                  >
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
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    MESSAGE SENT
                  </span>
                )}
              </div>
            </div>

            {/* ── RIGHT: Contacts panel ── */}
            <div
              style={{
                ...computedPanelStyle,
                // On stacked layout, don't force 400px — auto height already set via getPanelStyle
                opacity: contactsPanelReveal,
                transform: `translateY(${(1 - contactsPanelReveal) * 22}px)`,
                transition: "opacity 0.06s linear, transform 0.06s linear",
                willChange: "opacity, transform",
              }}
            >
              <PanelShimmer />
              <span
                style={{
                  fontSize: isTiny ? 14 : 16,
                  fontWeight: 700,
                  color: "var(--color-text)",
                  margin: "0 0 20px 0",
                  letterSpacing: "-0.01em",
                  display: "block",
                }}
              >
                My Contacts
              </span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {CONTACTS.map((c, idx) => (
                  <ContactItem
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
                  // On desktop push to bottom of 400px panel; on mobile just margin
                  marginTop: isSmall ? 24 : 60,
                  paddingTop: 18,
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  opacity: statusReveal,
                  transform: `translateY(${(1 - statusReveal) * 8}px)`,
                  transition: "opacity 0.06s linear, transform 0.06s linear",
                  willChange: "opacity, transform",
                }}
              >
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
                  }}
                >
                  OPEN TO WORK · RESPONSE WITHIN 24H
                </span>
              </div>
            </div>
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

  // ── SYNCED SCROLL LISTENER (Perfect fade-in/fade-out) ─────────────────────
  useEffect(() => {
    const handleBgScroll = (e) => {
      const globalProgress = e.detail;

      // Calculate local progress (0 → 1) within contact section
      let localProgress = (globalProgress - SECTION_START) / SECTION_SPAN;
      localProgress = Math.max(0, Math.min(1, localProgress));

      // Symmetric smoothstep easing: identical curve for both directions
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
      }}
    >
      {mounted &&
        createPortal(
          <ContactContent profile={profile} revealProgress={revealProgress} />,
          document.body,
        )}
    </div>
  );
}
