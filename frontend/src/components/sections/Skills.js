"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Code2,
  Layers,
  Palette,
  Camera,
  Music2,
  Telescope,
  Dumbbell,
  Terminal,
  GitBranch,
  Globe,
  MapPin,
  Clock,
  Wifi,
  Database,
  Cpu,
} from "lucide-react";

// ─── Section bounds ────────────────────────────────────────────────────────
const SECTION_START = 0.4;
const SECTION_END = 0.65;
const SECTION_SPAN = SECTION_END - SECTION_START;

// ─── Nav labels ────────────────────────────────────────────────────────────
const NAV_ITEMS = ["Skills", "Hobbies", "Tools", "Location", "Projects"];

const SLIDE_THRESHOLDS = [
  [0.0, 0.1], // page 0 (Skills)
  [0.18, 0.28], // page 1 (Hobbies)
  [0.38, 0.48], // page 2 (Tools)
  [0.56, 0.66], // page 3 (Location)
  [0.74, 0.84], // page 4 (Projects)
];

const ACTIVE_AT = [0, ...SLIDE_THRESHOLDS.slice(1).map(([start]) => start)];

// ─────────────────────────────────────────────────────────────────────────────
// Page content components
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_GROUPS = [
  {
    label: "Languages",
    icon: <Code2 size={14} />,
    items: ["TypeScript", "JavaScript", "Python", "Rust", "SQL"],
  },
  {
    label: "Frameworks",
    icon: <Layers size={14} />,
    items: ["Next.js", "React", "Node.js", "Fastify", "GraphQL"],
  },
  {
    label: "Styling",
    icon: <Palette size={14} />,
    items: ["Tailwind CSS", "Framer Motion", "GSAP", "CSS Modules"],
  },
  {
    label: "Infrastructure",
    icon: <Database size={14} />,
    items: ["PostgreSQL", "Redis", "Docker", "Vercel", "AWS S3"],
  },
];

function SkillsPage() {
  useEffect(() => {
    if (document.getElementById("marquee-keyframes")) return;
    const style = document.createElement("style");
    style.id = "marquee-keyframes";
    style.textContent = `
      @keyframes marquee-left  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      @keyframes marquee-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
    `;
    document.head.appendChild(style);
  }, []);

  const rows = [
    {
      items: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "GraphQL",
        "Fastify",
      ],
      dir: "left",
      speed: "18s",
    },
    {
      items: ["PostgreSQL", "Redis", "Docker", "Vercel", "AWS S3", "Supabase"],
      dir: "right",
      speed: "22s",
    },
    {
      items: [
        "GSAP",
        "Framer Motion",
        "Tailwind CSS",
        "CSS Modules",
        "Figma",
        "Three.js",
      ],
      dir: "left",
      speed: "16s",
    },
    {
      items: [
        "Python",
        "Rust",
        "SQL",
        "Bash",
        "Go",
        "WebSockets",
        "REST",
        "tRPC",
      ],
      dir: "right",
      speed: "20s",
    },
  ];

  return (
    <div style={{ ...styles.pageInner, overflow: "hidden" }}>
      <div style={styles.pageLabel}>01 / Skills</div>
      <h2 style={styles.pageTitle}>Technical Expertise</h2>
      <p style={styles.pageSubtitle}>
        Full-stack engineer with a bias for the frontend and a love for
        well-architected systems.
      </p>

      <div
        style={{
          marginTop: "28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "18px",
          overflow: "hidden",
        }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{ overflow: "hidden", position: "relative" }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "60px",
                zIndex: 2,
                background:
                  "linear-gradient(to right, var(--color-bg, #0f0c18), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: "60px",
                zIndex: 2,
                background:
                  "linear-gradient(to left, var(--color-bg, #0f0c18), transparent)",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "0px",
                width: "max-content",
                animation: `${row.dir === "left" ? "marquee-left" : "marquee-right"} ${row.speed} linear infinite`,
              }}>
              {[0, 1].map((copy) => (
                <div key={copy} style={{ display: "flex", gap: "0px" }}>
                  {row.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: "var(--color-text)",
                        opacity: 0.12,
                        padding: "0 28px",
                        whiteSpace: "nowrap",
                        textTransform: "uppercase",
                        transition: "opacity 0.2s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.opacity = "0.9")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.opacity = "0.12")
                      }>
                      {item}
                      <span
                        style={{
                          marginLeft: "28px",
                          opacity: 0.3,
                          color: "#a855f7",
                        }}>
                        ·
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const HOBBIES = [
  {
    icon: <Camera size={22} />,
    name: "Photography",
    desc: "Street & documentary — finding narratives in everyday chaos.",
  },
  {
    icon: <Music2 size={22} />,
    name: "Music Production",
    desc: "Electronic compositions, lo-fi beats, and ambient soundscapes.",
  },
  {
    icon: <Telescope size={22} />,
    name: "Astronomy",
    desc: "Amateur stargazing and reading about cosmology and deep-space physics.",
  },
  {
    icon: <Dumbbell size={22} />,
    name: "Calisthenics",
    desc: "Bodyweight training — strength through movement.",
  },
];

function HobbiesPage() {
  return (
    <div style={styles.pageInner}>
      <div style={styles.pageLabel}>02 / Hobbies</div>
      <h2 style={styles.pageTitle}>Beyond the Code</h2>
      <p style={styles.pageSubtitle}>
        The things that feed curiosity, creativity, and a healthy offline life.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px",
          marginTop: "28px",
          flex: 1,
        }}>
        {HOBBIES.map((h) => (
          <div key={h.name} style={styles.hobbyCard}>
            <div style={styles.hobbyIcon}>{h.icon}</div>
            <div style={styles.hobbyName}>{h.name}</div>
            <div style={styles.hobbyDesc}>{h.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const TOOLS = [
  { icon: <Terminal size={20} />, name: "VS Code" },
  { icon: <GitBranch size={20} />, name: "GitHub" },
  { icon: <Globe size={20} />, name: "Vercel" },
  { icon: <Database size={20} />, name: "Supabase" },
  { icon: <Cpu size={20} />, name: "Docker" },
  { icon: <Layers size={20} />, name: "Linear" },
  { icon: <Code2 size={20} />, name: "Warp" },
];

function ToolsPage() {
  return (
    <div style={styles.pageInner}>
      <div style={styles.pageLabel}>03 / Tools</div>
      <h2 style={styles.pageTitle}>My Daily Stack</h2>
      <p style={styles.pageSubtitle}>
        The tools I reach for every day — chosen for speed, clarity, and craft.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginTop: "28px",
          flex: 1,
        }}>
        {TOOLS.map((t) => (
          <div key={t.name} style={styles.toolCard}>
            <div style={styles.toolIcon}>{t.icon}</div>
            <div style={styles.toolName}>{t.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LocationPage() {
  return (
    <div style={styles.pageInner}>
      <div style={styles.pageLabel}>04 / Location</div>
      <h2 style={styles.pageTitle}>Based in Kolkata</h2>
      <p style={styles.pageSubtitle}>
        India&apos;s cultural capital — open to remote collaboration across time
        zones.
      </p>

      <div
        style={{
          marginTop: "28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}>
        <div style={styles.mapCard}>
          <div style={styles.mapGrid} />
          <div style={styles.mapPin}>
            <MapPin size={18} color="#a855f7" />
            <span style={styles.mapPinLabel}>Kolkata, WB</span>
          </div>
          <div style={styles.mapLat}>22.5726° N, 88.3639° E</div>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={styles.infoCard}>
            <Clock
              size={16}
              style={{ color: "#a855f7", marginBottom: "6px" }}
            />
            <div style={styles.infoLabel}>Timezone</div>
            <div style={styles.infoValue}>IST · UTC+5:30</div>
          </div>
          <div style={styles.infoCard}>
            <Wifi size={16} style={{ color: "#a855f7", marginBottom: "6px" }} />
            <div style={styles.infoLabel}>Availability</div>
            <div style={styles.infoValue}>Open to Remote</div>
          </div>
          <div style={styles.infoCard}>
            <Globe
              size={16}
              style={{ color: "#a855f7", marginBottom: "6px" }}
            />
            <div style={styles.infoLabel}>Overlap</div>
            <div style={styles.infoValue}>EU AM · US AM</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const PROJECTS = [
  {
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    title: "DevCanvas",
    description:
      "A real-time collaborative code editor with live preview, WebSocket sync, and multi-cursor support built for distributed teams.",
    tags: ["Next.js", "WebSockets", "Monaco"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    title: "Pulse Dashboard",
    description:
      "Analytics platform processing 2M+ events/day with customisable widgets, edge caching, and sub-second query performance.",
    tags: ["React", "PostgreSQL", "Redis"],
  },
  {
    image:
      "https://images.unsplash.com/photo-1618788372246-79faff0c3742?w=800&q=80",
    title: "Aura Design System",
    description:
      "Component library spanning 60+ primitives with dark/light theming, full a11y compliance, and Figma token sync.",
    tags: ["TypeScript", "Storybook", "Figma"],
  },
];

function ProjectsPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % PROJECTS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  const project = PROJECTS[current];

  return (
    <div style={{ ...styles.pageInner, gap: 0 }}>
      <div style={styles.pageLabel}>05 / Projects</div>
      <h2 style={styles.pageTitle}>Selected Work</h2>
      <p style={styles.pageSubtitle}>
        A few things built with care — each one a different kind of problem.
      </p>

      <div
        style={{
          marginTop: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}>
        <div
          style={{
            flex: 1,
            borderRadius: "14px",
            overflow: "hidden",
            position: "relative",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            minHeight: 0,
          }}>
          <img
            key={current}
            src={project.image}
            alt={project.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: 0,
              animation: "carouselFadeIn 0.5s ease forwards",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,8,18,0.7) 0%, transparent 60%)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
                marginBottom: "4px",
              }}>
              {project.title}
            </div>
            <div
              style={{
                fontSize: "12.5px",
                color: "rgba(255,255,255,0.45)",
                lineHeight: 1.55,
                marginBottom: "10px",
              }}>
              {project.description}
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {project.tags.map((t) => (
                <span key={t} style={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              paddingBottom: "2px",
            }}>
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: "6px",
                  height: i === current ? "22px" : "6px",
                  borderRadius: "3px",
                  background:
                    i === current ? "#a855f7" : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "height 0.3s ease, background 0.3s ease",
                  boxShadow:
                    i === current ? "0 0 8px rgba(168,85,247,0.6)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

if (
  typeof document !== "undefined" &&
  !document.getElementById("carousel-keyframes")
) {
  const s = document.createElement("style");
  s.id = "carousel-keyframes";
  s.textContent = `@keyframes carouselFadeIn { from { opacity:0; transform:scale(1.03) } to { opacity:1; transform:scale(1) } }`;
  document.head.appendChild(s);
}

const PAGE_COMPONENTS = [
  SkillsPage,
  HobbiesPage,
  ToolsPage,
  LocationPage,
  ProjectsPage,
];
const PAGE_BG = [
  "var(--color-bg)",
  "var(--color-bg)",
  "var(--color-bg)",
  "var(--color-bg)",
  "var(--color-bg)",
];

// ─────────────────────────────────────────────────────────────────────────────
// Portal content
// ─────────────────────────────────────────────────────────────────────────────
function PortalContent() {
  const wrapperRef = useRef(null);
  const rightPanelRef = useRef(null);
  const leftPanelRef = useRef(null);
  const pageRefs = useRef(PAGE_COMPONENTS.map(() => React.createRef()));
  const navRefs = useRef(NAV_ITEMS.map(() => React.createRef()));
  const activeRef = useRef(0);

  useEffect(() => {
    // Initial state: page 0 active, no pages overlapped yet
    applyNavStyles(navRefs.current, 0);
    applyPageBorders(pageRefs.current, 0, 0);
  }, []);

  useEffect(() => {
    const handleBgScroll = (e) => {
      const globalProgress = e.detail;
      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const lp = Math.max(
        0,
        Math.min(1, (globalProgress - SECTION_START) / SECTION_SPAN),
      );
      const inSection =
        globalProgress >= SECTION_START && globalProgress <= SECTION_END;

      wrapper.style.opacity = 1;
      wrapper.style.visibility = inSection ? "visible" : "hidden";

      // Right panel fades in independently
      const rightPanel = rightPanelRef.current;
      if (rightPanel) {
        const rightOpacity =
          lp < 0.25 ? lp / 0.25 : lp > 0.9 ? 1 - (lp - 0.9) / 0.1 : 1;
        rightPanel.style.opacity = rightOpacity;
      }

      // Left panel fadeout

      const leftPanel = leftPanelRef.current;
      if (leftPanel) {
        const leftOpacity = lp > 0.9 ? 1 - (lp - 0.9) / 0.1 : 1;
        leftPanel.style.opacity = leftOpacity;
      }

      // Page slide animations
      pageRefs.current.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const [tStart, tEnd] = SLIDE_THRESHOLDS[i];
        const slideProgress = Math.max(
          0,
          Math.min(1, (lp - tStart) / (tEnd - tStart)),
        );
        const ty = (1 - slideProgress) * 100;
        el.style.transform = `translateY(${ty}%)`;
      });

      // Active nav + page border update
      let active = 0;
      for (let i = ACTIVE_AT.length - 1; i >= 0; i--) {
        if (lp >= ACTIVE_AT[i]) {
          active = i;
          break;
        }
      }
      applyPageBorders(pageRefs.current, active, lp);
      if (activeRef.current !== active) {
        activeRef.current = active;
        applyNavStyles(navRefs.current, active);
      }
    };

    window.addEventListener("bgscroll", handleBgScroll);
    return () => window.removeEventListener("bgscroll", handleBgScroll);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        opacity: 0,
        visibility: "hidden",
        pointerEvents: "none",
        zIndex: 998,
        transition: "opacity 0.3s ease",
      }}>
      {/* ── LEFT: stacked content pages ──────────────────────────────────── */}
      <div ref={leftPanelRef} style={styles.leftPanel}>
        <div style={styles.leftFrame}>
          {PAGE_COMPONENTS.map((PageComp, i) => (
            <div
              key={i}
              ref={pageRefs.current[i]}
              style={{
                position: "absolute",
                inset: 0,
                zIndex: i,
                // Page 0 starts as active → --color-border; rest are neutral until they slide in
                border: "1px solid var(--color-border)",
                borderRadius: "inherit",
                background: PAGE_BG[i],
                willChange: "transform",
                transform: "translateY(100%)",
                transition:
                  "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.35s ease",
                overflow: "hidden",
              }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "10%",
                  right: "10%",
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, rgba(168,85,247,0.5), transparent)",
                }}
              />
              <PageComp />
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: fixed nav panel ───────────────────────────────────────── */}
      <div ref={rightPanelRef} style={{ ...styles.rightPanel, opacity: 0 }}>
        <div style={styles.navList}>
          {NAV_ITEMS.map((label, i) => (
            <div
              key={label}
              ref={navRefs.current[i]}
              style={{
                ...styles.navItem,
                // Active (i===0) → --color-border; inactive → --color-accent
                border:
                  i === 0
                    ? "1px solid var(--color-border)"
                    : "1px solid var(--color-border-muted)",
                transform: i === 0 ? "translateX(4px)" : "translateX(0px)",
                background:
                  i === 0 ? "rgba(168,85,247,0.08)" : "var(--glass-bg)",
              }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: i === 0 ? "#a855f7" : "rgba(128,128,128,0.5)",
                  transition: "color 0.35s ease",
                  fontFamily: "monospace",
                }}>
                0{i + 1}
              </span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color:
                    i === 0
                      ? "var(--color-text)"
                      : "var(--color-text-muted, rgba(128,128,128,0.6))",
                  transition: "color 0.35s ease",
                  letterSpacing: "-0.02em",
                }}>
                {label}
              </span>
              <div
                style={{
                  marginLeft: "auto",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: i === 0 ? "#a855f7" : "transparent",
                  boxShadow: i === 0 ? "0 0 8px rgba(168,85,247,0.8)" : "none",
                  transition: "background 0.35s ease, box-shadow 0.35s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Apply nav active styles via refs ────────────────────────────────────────
// Active nav item  → border: var(--color-border)
// Inactive nav items → border: var(--color-accent)
// Box shadow removed from all nav items
function applyNavStyles(refs, activeIndex) {
  refs.forEach((ref, i) => {
    const el = ref.current;
    if (!el) return;
    const isActive = i === activeIndex;

    el.style.background = "var(--color-bg)";

    el.style.borderColor = isActive
      ? "var(--color-border)"
      : "var(--color-border-muted)";
    el.style.transform = isActive ? "translateX(4px)" : "translateX(0px)";

    const [indexSpan, labelSpan, dot] = el.children;
    if (indexSpan)
      indexSpan.style.color = isActive ? "#a855f7" : "rgba(128,128,128,0.5)";
    if (labelSpan) {
      labelSpan.style.color = isActive
        ? "var(--color-text)"
        : "var(--color-text-muted, rgba(128,128,128,0.6))";
    }
    if (dot) {
      dot.style.background = isActive ? "#a855f7" : "transparent";
      dot.style.boxShadow = isActive ? "0 0 8px rgba(168,85,247,0.8)" : "none";
    }
  });
}

// ─── Apply page border colors based on active index ──────────────────────────

function applyPageBorders(refs, activeIndex, lp) {
  refs.forEach((ref, i) => {
    const el = ref.current;
    if (!el) return;

    if (i > activeIndex) {
      // Not yet arrived — keep neutral
      el.style.borderColor = "var(--color-border)";
    } else if (i === activeIndex) {
      // Active page — hold --color-border until the NEXT page starts sliding over it
      const nextSlideStart = SLIDE_THRESHOLDS[i + 1]?.[0];
      const nextIsSliding =
        nextSlideStart !== undefined && lp >= nextSlideStart;
      el.style.borderColor = nextIsSliding
        ? "var(--color-border-muted)"
        : "var(--color-border)";
    } else {
      // Fully buried beneath active page
      el.style.borderColor = "var(--color-border-muted)";
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export
// ─────────────────────────────────────────────────────────────────────────────
export default function Skills() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {mounted && createPortal(<PortalContent />, document.body)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = {
  // ── Layout ────────────────────────────────────────────────────────────────
  leftPanel: {
    flex: "0 0 62%",
    padding: "36px 28px 36px 40px",
    display: "flex",
    alignItems: "stretch",
  },
  leftFrame: {
    flex: 1,
    position: "relative",
    borderRadius: "20px",
    overflow: "hidden",
  },
  rightPanel: {
    flex: "0 0 38%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "36px 40px 36px 20px",
  },
  navList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px 20px",
    borderRadius: "14px",
    // border and background set inline per-item (initial) and via applyNavStyles
    // boxShadow intentionally removed
    color: "var(--color-text)",
    transition:
      "background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
    cursor: "default",
  },

  // ── Page inner layout ──────────────────────────────────────────────────────
  pageInner: {
    padding: "36px 40px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  pageLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "#7c3aed",
    marginBottom: "10px",
    fontFamily: "monospace",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: 700,
    color: "var(--color-text)",
    letterSpacing: "-0.03em",
    lineHeight: 1.15,
    margin: 0,
    marginBottom: "10px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "var(--color-text-muted, rgba(255,255,255,0.45))",
    lineHeight: 1.6,
    margin: 0,
    maxWidth: "480px",
  },

  // ── Skills page ────────────────────────────────────────────────────────────
  skillGroup: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "16px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  skillGroupHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  skillGroupLabel: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "var(--color-text-muted, rgba(128,128,128,0.7))",
  },
  tag: {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--color-text)",
    background: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.2)",
    borderRadius: "20px",
    padding: "4px 11px",
    letterSpacing: "0.02em",
  },

  // ── Hobbies page ───────────────────────────────────────────────────────────
  hobbyCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    transition: "border-color 0.2s ease",
  },
  hobbyIcon: { color: "#a855f7", marginBottom: "4px" },
  hobbyName: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--color-text)",
    letterSpacing: "-0.01em",
  },
  hobbyDesc: {
    fontSize: "12.5px",
    color: "var(--color-text-muted, rgba(128,128,128,0.6))",
    lineHeight: 1.55,
  },

  // ── Tools page ─────────────────────────────────────────────────────────────
  toolCard: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "18px 12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  toolIcon: {
    color: "#a855f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "rgba(168,85,247,0.1)",
    border: "1px solid rgba(168,85,247,0.2)",
  },
  toolName: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--color-text-muted, rgba(128,128,128,0.7))",
    letterSpacing: "0.02em",
  },

  // ── Location page ──────────────────────────────────────────────────────────
  mapCard: {
    flex: 1,
    position: "relative",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    overflow: "hidden",
    minHeight: "160px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mapGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(168,85,247,0.06) 1px, transparent 1px)
    `,
    backgroundSize: "32px 32px",
  },
  mapPin: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "16px 24px",
    background: "rgba(10,8,18,0.75)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(168,85,247,0.3)",
    borderRadius: "40px",
    boxShadow: "0 0 30px rgba(168,85,247,0.15)",
  },
  mapPinLabel: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--color-text)",
    letterSpacing: "-0.01em",
  },
  mapLat: {
    position: "absolute",
    bottom: "12px",
    right: "16px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.25)",
    fontFamily: "monospace",
    letterSpacing: "0.04em",
  },
  infoCard: {
    flex: 1,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#fff",
    letterSpacing: "-0.01em",
  },
};
