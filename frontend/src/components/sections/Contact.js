"use client";

import { useState, useRef, useEffect } from "react";

const CONTACTS = [
  {
    id: "email",
    label: "EMAIL",
    value: "your-email@gmail.com",
    href: "mailto:your-email@gmail.com",
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
    value: "linkedin.com/in/yourprofile",
    href: "https://linkedin.com/in/yourprofile",
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
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
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

// ── Shared style tokens ────────────────────────────────────────────────────────
// const FONT_SYNE = "'Syne', sans-serif";
// const FONT_MONO = "'DM Mono', monospace";
const VIOLET = "#7033fc";
const VIOLET_LT = "#c084fc";
const EASE_SHARP = "cubic-bezier(0.77,0,0.18,1)";

// Panel glass style (reused for form + contacts)
const panelStyle = {
  background: "var(--header-bg)",
  backdropFilter: "blur(12px) saturate(160%)",
  WebkitBackdropFilter: "blur(12px) saturate(160%)",
  border: "1px solid var(--color-border)",
  borderRadius: 16,
  padding: "26px 28px 28px",
  boxShadow: "var(--card-shadow))",
  position: "relative",
  overflow: "hidden",
  // keep panels above canvas at all times
  height: 400,
  zIndex: 10,
};

// Top shimmer line inside panels (replaces ::before)
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

// Field panel (email / message wrappers)
function FieldPanel({ focused, children, style }) {
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
        transition: "background 0.25s, border-color 0.25s",
        zIndex: 20,
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

// Base input style (no background, border, outline)
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

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);
  const [hoveredContact, setHoveredContact] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [titleHovered, setTitleHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);
  const canvasRef = useRef(null);

  // Canvas animation
  useEffect(() => {
    setMounted(true);
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
  const handleSubmit = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    setFormState({ name: "", phone: "", email: "", message: "" });
  };

  // Mount animation helper
  const mountAnim = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "none" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <>
      {/*
        Minimal style block — ONLY for:
        1. Font import
        2. @keyframes (can't be inline)
        3. ::placeholder (pseudo-element, can't be inline)
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .pf-input::placeholder,
        .pf-textarea::placeholder {
          color: var(--color-text-muted);
          font-weight: 400;
        }
      `}</style>

      {/* ── ROOT ── */}
      <section
        style={{
          color: "#fff",
          padding: "72px 60px 100px",
          position: "relative",
          overflow: "hidden",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}>
        {/* Canvas — z-index 0, pointer-events none so it never blocks interaction */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ── HEADER ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            marginBottom: 44,
            display: "flex",
            alignItems: "flex-end",
            gap: 32,
            ...mountAnim(0),
          }}>
          {/* Title */}
          <div
            onMouseEnter={() => setTitleHovered(true)}
            onMouseLeave={() => setTitleHovered(false)}>
            <h2
              style={{
                fontSize: "clamp(34px, 4vw, 52px)",
                fontWeight: 200,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                margin: 0,
                cursor: "default",
                display: "inline-block",
              }}>
              {/* Gradient sweep on hover */}
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

              {/* Underline with animated violet fill (real child replaces ::after) */}
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

        {/* ── MAIN GRID ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 22,
            position: "relative",
            zIndex: 10,
            alignItems: "start",
          }}>
          {/* ── LEFT: Form ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              ...mountAnim(100),
            }}>
            {/* Glass panel */}
            <div style={panelStyle}>
              <PanelShimmer />

              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--color-text)",
                  margin: "0 0 20px 0",
                  letterSpacing: "-0.01em",
                }}>
                Send a Message
              </h3>

              {/* ── Name + Phone row ── */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1px 1fr",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--color-accent)",
                  borderRadius: 10,
                  overflow: "hidden",
                  marginBottom: 12,
                  position: "relative",
                  zIndex: 20,
                }}>
                {/* Top shimmer */}
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

                {/* Name */}
                <div
                  style={{
                    padding: "13px 16px 11px",
                    background:
                      focused === "name"
                        ? "rgba(139,92,246,0.06)"
                        : "transparent",
                    transition: "background 0.25s",
                  }}>
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
                </div>

                {/* Divider */}
                <div style={{ background: "var(--color-accent)" }} />

                {/* Phone */}
                <div
                  style={{
                    padding: "13px 16px 11px",
                    background:
                      focused === "phone"
                        ? "rgba(139,92,246,0.06)"
                        : "transparent",
                    transition: "background 0.25s",
                  }}>
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
                </div>
              </div>

              {/* ── Email ── */}
              <FieldPanel
                focused={focused === "email"}
                style={{ marginBottom: 12 }}>
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

              {/* ── Message ── */}
              <FieldPanel focused={focused === "message"}>
                <textarea
                  className="pf-textarea"
                  style={{
                    ...inputStyle,
                    resize: "none",
                    minHeight: 150,
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

            {/* ── Submit row (outside panel) ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginTop: 18,
                position: "relative",
                zIndex: 10,
              }}>
              <button
                type="button"
                onClick={handleSubmit}
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
                  transition: "border-color 0.3s",
                  clipPath:
                    "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))",
                }}>
                {/* Hover fill (replaces ::before) */}
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
                    transition: "transform 0.3s",
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

          {/* ── RIGHT: Contacts panel ── */}
          <div style={{ ...panelStyle, ...mountAnim(200) }}>
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

            {/* Contact list */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {CONTACTS.map((c, idx) => {
                const isHov = hoveredContact === c.id;
                const isLast = idx === CONTACTS.length - 1;
                return (
                  <a
                    key={c.id}
                    href={c.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "14px 0",
                      borderBottom: isLast
                        ? "none"
                        : "1px solid var(--color-border)",
                      textDecoration: "none",
                      color: "var(--color-text)",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      zIndex: 20,
                    }}
                    onMouseEnter={() => setHoveredContact(c.id)}
                    onMouseLeave={() => setHoveredContact(null)}
                    target={c.id === "linkedin" ? "_blank" : undefined}
                    rel="noreferrer">
                    {/* Left accent bar (replaces ::before) */}
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

                    {/* Icon */}
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

                    {/* Info */}
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
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--color-text)",
                        }}>
                        {c.value}
                      </span>
                    </div>

                    {/* Arrow */}
                    <svg
                      style={{
                        opacity: isHov ? 1 : 0,
                        transform: isHov
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
              })}
            </div>

            {/* Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 60,
                paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.08)",
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
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: "var(--color-text-muted)",
                }}>
                OPEN TO WORK · RESPONSE WITHIN 24H
              </span>
            </div>
          </div>
        </div>
        {/* end main grid */}
      </section>
    </>
  );
}
