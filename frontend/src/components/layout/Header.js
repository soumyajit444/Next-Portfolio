"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SoundToggle from "@/components/ui/SoundToggle";

const navLinks = [
  { label: "HOME", index: 0, id: "home" },
  { label: "PROFILE", index: 1, id: "profile" },
  { label: "SKILLS", index: 2, id: "skills" },
  { label: "EXPERIENCE", index: 3, id: "experience" },
  { label: "CONTACT", index: 4, id: "contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const close = (e) => {
      if (!e.target.closest(".header-nav-root")) setMenuOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  const linkStyle = {
    color: "var(--color-text-muted)",
    fontSize: "11px",
    fontWeight: "600",
    letterSpacing: "0.11em",
    textDecoration: "none",
    transition: "color 0.2s",
    display: "inline-block",
  };

  const handleNavClick = (e, link) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIndex(link.index);

    if (typeof window.scrollToSection === "function") {
      window.scrollToSection(link.index);
    }

    if (window.history.replaceState) {
      window.history.replaceState(null, "", `#${link.id}`);
    }

    setMenuOpen(false);
  };

  return (
    <>
      <header
        className="header-nav-root"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          // Use separate padding props to avoid shorthand conflict
          paddingTop: scrolled ? "10px" : "16px",
          paddingBottom: scrolled ? "10px" : "16px",
          paddingLeft: "24px",
          paddingRight: "24px",
          transition: "padding 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <nav
          className="header-nav-pill"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "auto",
            width: "100%",
            maxWidth: scrolled ? 700 : 1440,
            paddingTop: "8px",
            paddingBottom: "8px",
            paddingLeft: "18px",
            paddingRight: "18px",
            borderRadius: "2rem",
            gap: "24px",
            background: scrolled ? "var(--header-bg)" : "transparent",
            backdropFilter: scrolled ? "blur(12px) saturate(160%)" : "none",
            WebkitBackdropFilter: scrolled
              ? "blur(12px) saturate(160%)"
              : "none",
            border: scrolled
              ? "1px solid var(--header-border)"
              : "1px solid transparent",
            boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.30)" : "none",
            transition: [
              "max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              "background 0.4s ease",
              "backdrop-filter 0.4s ease",
              "border-color 0.4s ease",
              "box-shadow 0.4s ease",
            ].join(", "),
          }}
        >
          {/* ── Desktop: Portfolio brand (left) ── */}
          {/* ── Mobile: hidden here, shown on right via CSS ── */}
          <Link
            href="/"
            className="header-brand-desktop"
            style={{
              color: "var(--color-text)",
              fontWeight: scrolled ? "700" : "100",
              fontSize: scrolled ? "1rem" : "2rem",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              fontFamily: "var(--font-primary)",
              flexShrink: 0,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "font-size, font-weight",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.55")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Portfolio
          </Link>

          {/* ── Desktop nav links ── */}
          <div
            className="header-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              marginLeft: "auto",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.id}`}
                style={{
                  ...linkStyle,
                  color:
                    activeIndex === link.index
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                }}
                onClick={(e) => handleNavClick(e, link)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    activeIndex === link.index
                      ? "var(--color-text)"
                      : "var(--color-text-muted)")
                }
              >
                <span className="roll-wrapper">
                  <span className="roll-track">
                    <span className="roll-item">{link.label}</span>
                    <span className="roll-item" aria-hidden="true">
                      {link.label}
                    </span>
                    <span className="roll-item" aria-hidden="true">
                      {link.label}
                    </span>
                    <span className="roll-item" aria-hidden="true">
                      {link.label}
                    </span>
                  </span>
                </span>
              </a>
            ))}
          </div>

          {/* ── Desktop: Sound + Theme toggles ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
              marginLeft: "4px",
            }}
            className="header-right"
          >
            <SoundToggle />
            <ThemeToggle />
          </div>

          {/* ── Mobile row: ONLY "Portfolio" button — top-right, acts as menu trigger ── */}
          {/* Hidden on desktop via CSS. No hamburger — Portfolio IS the toggle. */}
          <div className="mobile-nav-row">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              style={{
                marginLeft: "auto", // pushes to the right
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: 0,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {/* "Portfolio" label */}
              <span
                style={{
                  color: "var(--color-text)",
                  fontWeight: "700",
                  fontSize: "1rem",
                  letterSpacing: "-0.02em",
                  fontFamily: "var(--font-primary)",
                  transition: "opacity 0.2s",
                  opacity: menuOpen ? 0.6 : 1,
                }}
              >
                Portfolio
              </span>
              {/* Small chevron that flips when open */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                stroke="var(--color-text-muted)"
                strokeWidth="1.6"
                strokeLinecap="round"
                style={{
                  transition: "transform 0.25s ease",
                  transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
                  marginTop: "1px",
                  flexShrink: 0,
                }}
              >
                <path d="M2 3.5L5 6.5L8 3.5" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* ── Dropdown menu ── */}
      {menuOpen && (
        <div
          className="header-nav-root header-dropdown"
          style={{
            position: "fixed",
            top: "68px",
            left: "16px",
            right: "16px",
            zIndex: 9998,
            background: "var(--header-bg)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid var(--header-border)",
            borderRadius: "20px",
            paddingTop: "6px",
            paddingBottom: "6px",
            paddingLeft: 0,
            paddingRight: 0,
            boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
            animation: "dropdownIn 0.22s cubic-bezier(0.16,1,0.3,1) both",
          }}
        >
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                ...linkStyle,
                display: "flex",
                alignItems: "center",
                paddingTop: "13px",
                paddingBottom: "13px",
                paddingLeft: "20px",
                paddingRight: "20px",
                borderBottom:
                  i < navLinks.length - 1
                    ? "1px solid rgba(255,255,255,0.06)"
                    : "none",
                color:
                  activeIndex === link.index
                    ? "var(--color-text)"
                    : "var(--color-text-muted)",
                gap: "12px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-text)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color =
                  activeIndex === link.index
                    ? "var(--color-text)"
                    : "var(--color-text-muted)")
              }
            >
              {/* Active indicator dot */}
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background:
                    activeIndex === link.index ? "#7033fc" : "transparent",
                  border:
                    activeIndex === link.index
                      ? "none"
                      : "1px solid rgba(255,255,255,0.2)",
                  flexShrink: 0,
                  transition: "background 0.2s",
                  display: "inline-block",
                }}
              />
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        /* ── Roll animation ──────────────────────────────── */
        .roll-wrapper {
          overflow: hidden;
          height: 1.2em;
          line-height: 1.2;
          display: inline-flex;
          vertical-align: middle;
          perspective: 450px;
          cursor: pointer;
        }
        .roll-track {
          display: flex;
          flex-direction: column;
          will-change: transform;
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .roll-item {
          display: block;
          white-space: nowrap;
          backface-visibility: hidden;
          transform-origin: center center;
        }
        .roll-wrapper:hover .roll-track {
          transition: none;
          animation: smooth3DRoll 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes smooth3DRoll {
          0%      { transform: translateY(0)     rotateX(0deg)   scale(1);    }
          20%     { transform: translateY(-60%)  rotateX(-14deg) scale(0.97); }
          33.33%  { transform: translateY(-100%) rotateX(0deg)   scale(1);    }
          53.33%  { transform: translateY(-160%) rotateX(-14deg) scale(0.97); }
          66.66%  { transform: translateY(-200%) rotateX(0deg)   scale(1);    }
          86.66%  { transform: translateY(-260%) rotateX(-14deg) scale(0.97); }
          100%    { transform: translateY(-300%) rotateX(0deg)   scale(1);    }
        }

        /* ── Dropdown slide-in ───────────────────────────── */
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }

        /* ── Desktop: show links + toggles, hide mobile row ─ */
        .header-brand-desktop { display: inline-block !important; }
        .header-links         { display: flex !important; }
        .header-right         { display: flex !important; }
        .mobile-nav-row       { display: none !important; }

        /* ── Mobile (≤600px): shrink nav to pill around "Portfolio" only ── */
        @media (max-width: 600px) {
          .header-brand-desktop { display: none !important; }
          .header-links         { display: none !important; }
          .header-right         { display: none !important; }
          .mobile-nav-row {
            display: flex !important;
            align-items: center;
            width: 100%;
          }
          /* The header flex container: right-align the pill */
          .header-nav-pill {
            width: fit-content !important;
            min-width: unset !important;
            max-width: unset !important;
            margin-left: auto !important;
            margin-right: 0 !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
        }
        /* ── Mobile dropdown: right-aligned, auto-width to match pill ── */
        @media (max-width: 600px) {
          .header-dropdown {
            left: auto !important;
            right: 16px !important;
            min-width: 180px !important;
            width: auto !important;
          }
        }
      `}</style>
    </>
  );
}
