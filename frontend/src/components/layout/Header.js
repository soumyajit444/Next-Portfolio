"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SoundToggle from "@/components/ui/SoundToggle";

const navLinks = [
  { label: "HOME", index: 0, id: "home" },
  { label: "ABOUT", index: 1, id: "about" },
  { label: "SKILLS", index: 2, id: "skills" },
  { label: "WORK", index: 3, id: "experience" },
  { label: "CONTACT", index: 4, id: "contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkStyle = {
    color: "var(--color-text)",
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
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          padding: scrolled ? "10px 24px" : "16px 24px",
          transition: "padding 0.4s ease",
          pointerEvents: "none",
        }}>
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pointerEvents: "auto",
            width: "100%",
            maxWidth: scrolled ? 700 : 1440,
            padding: "8px 18px",
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
          }}>
          <Link
            href="/"
            style={{
              color: "var(--color-text)",
              fontWeight: scrolled ? "700" : "100",
              fontSize: scrolled ? "1rem" : "2rem",
              letterSpacing: "-0.02em",
              textDecoration: "none",
              fontFamily: "var(--font-primary)",
              flexShrink: 0,
              // UPDATED: Added fontSize and fontWeight to transition for smooth morphing
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "font-size, font-weight",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.55")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            Portfolio
          </Link>

          <div
            className="header-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "28px",
              marginLeft: "auto",
            }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={`#${link.id}`}
                style={linkStyle}
                onClick={(e) => handleNavClick(e, link)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--color-text)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--color-text-muted)")
                }>
                {/* 3D Vertical Scroll Wrapper */}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
              paddingX: "4px",
              marginLeft: "4px",
            }}
            className="header-right">
            <SoundToggle />
            <ThemeToggle />
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="hamburger-btn"
            style={{
              display: "none",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "32px",
              height: "32px",
              gap: "5px",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "50%",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: "1.5px",
                  width: i === 1 ? "10px" : "14px",
                  background: "#e0e0e0",
                  borderRadius: "2px",
                  transition: "all 0.25s",
                }}
              />
            ))}
          </button>
        </nav>
      </header>

      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: "24px",
            right: "24px",
            zIndex: 9998,
            background: "var(--header-bg)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid var(--header-border)",
            borderRadius: "20px",
            padding: "6px 0",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
          }}>
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                ...linkStyle,
                display: "block",
                padding: "13px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e0e0e0")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(220,220,220,0.7)")
              }>
              {link.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .header-links { display: flex !important; }
        .header-right { display: flex !important; }
        .hamburger-btn { display: none !important; }

        /* Premium 3D Vertical Scroll Effect */
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
          0% { transform: translateY(0) rotateX(0deg) scale(1); }
          20% { transform: translateY(-60%) rotateX(-14deg) scale(0.97); }
          33.33% { transform: translateY(-100%) rotateX(0deg) scale(1); }
          53.33% { transform: translateY(-160%) rotateX(-14deg) scale(0.97); }
          66.66% { transform: translateY(-200%) rotateX(0deg) scale(1); }
          86.66% { transform: translateY(-260%) rotateX(-14deg) scale(0.97); }
          100% { transform: translateY(-300%) rotateX(0deg) scale(1); }
        }

        @media (max-width: 600px) {
          .header-links { display: none !important; }
          .header-right { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
