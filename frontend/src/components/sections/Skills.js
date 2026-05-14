"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Terminal, Globe, MapPin, Clock, Wifi, Sparkles } from "lucide-react";

// Import amCharts utility and component
import SkillsPackedCircle from "@/components/ui/SkillsPackedCircle";

// ─── Section bounds (UNCHANGED) ───────────────────────────────────────────
const SECTION_START = 0.4;
const SECTION_END = 0.65;
const SECTION_SPAN = SECTION_END - SECTION_START;

// ─── Nav labels (4 pages) ─────────────────────────────────────────────────
const NAV_ITEMS = ["Skills", "Tools", "Projects", "Location"];

// 4 pages spread evenly across local progress [0.0 → 1.0]
// Each slide animates in over a 0.12-wide window, spaced 0.25 apart
const SLIDE_THRESHOLDS = [
  [0.0, 0.12], // page 0 — Skills
  [0.25, 0.37], // page 1 — Tools
  [0.5, 0.62], // page 2 — Location
  [0.75, 0.87], // page 3 — Projects
];

const ACTIVE_AT = [0, ...SLIDE_THRESHOLDS.slice(1).map(([start]) => start)];

// ─────────────────────────────────────────────────────────────────────────────
// Page content components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SkillsPage - Uses amCharts packed circle visualization
 */
function SkillsPage({ profile }) {
  const skills = profile?.Skills || [];

  const handleSkillClick = (skill) => {
    console.log("Skill clicked:", skill);
    window.dispatchEvent(
      new CustomEvent("skillSelected", {
        detail: { skillName: skill.Name, rating: skill.Rating },
      }),
    );
  };

  if (!skills || skills.length === 0) {
    return (
      <div style={{ ...styles.pageInner, overflow: "hidden" }}>
        <div style={styles.pageLabel}>01 / Skills</div>
        <h2 style={styles.pageTitle}>Technical Expertise</h2>
        <p style={styles.pageSubtitle}>
          Interactive skill visualization — bubble size reflects proficiency
          rating.
        </p>
        <div
          style={{
            marginTop: "24px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}>
          <div style={styles.emptyStateContainer}>
            <div style={styles.emptyStateCircle}>
              <Sparkles size={32} style={styles.emptyStateIcon} />
            </div>
            <p style={styles.emptyStateText}>No skills added</p>
            <p style={styles.emptyStateSubtext}>
              Skills will appear here once added to your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.pageInner, overflow: "hidden" }}>
      <div style={styles.pageLabel}>01 / Skills</div>
      <h2 style={styles.pageTitle}>Technical Expertise</h2>
      <p style={styles.pageSubtitle}>
        Interactive skill visualization — bubble size reflects proficiency
        rating.
      </p>
      <div
        style={{
          marginTop: "24px",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transform: "translateZ(0)",
          willChange: "auto",
          pointerEvents: "auto",
        }}>
        <SkillsPackedCircle
          skills={skills}
          containerId="skills-packed-chart"
          height="380px"
          onSkillClick={handleSkillClick}
          enableInteractions={false}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "16px",
          fontSize: "11px",
          color: "var(--color-text-muted, rgba(128,128,128,0.6))",
        }}>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#10b981",
            }}
          />
          Expert (9-10)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#3b82f6",
            }}
          />
          Proficient (7-8)
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#f59e0b",
            }}
          />
          Learning (1-6)
        </span>
      </div>
    </div>
  );
}

// ─── Tools Word Cloud ────────────────────────────────────────────────────────

function useWordCloud(words, width, height) {
  const [placed, setPlaced] = useState([]);

  useEffect(() => {
    if (!words || words.length === 0) return;

    Promise.all([
      import("d3").catch(() => null),
      import("d3-cloud").catch(() => null),
    ]).then(([d3Module, cloudModule]) => {
      if (!d3Module || !cloudModule) {
        const fallback = words.map((w, i) => ({
          text: w,
          size: 18,
          x: width / 2 + ((i % 3) - 1) * 120,
          y: height / 2 + Math.floor(i / 3) * 40 - 40,
          rotate: 0,
        }));
        setPlaced(fallback);
        return;
      }

      const d3 = d3Module;
      const cloud = cloudModule.default || cloudModule;

      const baseMin = words.length > 8 ? 14 : 16;
      const baseMax = words.length > 8 ? 32 : 38;

      const sizeScale = d3
        .scaleLinear()
        .domain([0, words.length - 1])
        .range([baseMax, baseMin]);

      cloud()
        .size([width, height])
        .words(words.map((text, i) => ({ text, size: sizeScale(i) })))
        .padding(10)
        .rotate(() => (Math.random() > 0.75 ? -30 : 0))
        .font("monospace")
        .fontSize((d) => d.size)
        .on("end", (output) => setPlaced(output))
        .start();
    });
  }, [words, width, height]);

  return placed;
}

function ToolsPage({ profile }) {
  const tools = profile?.IndustryTools || [];
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ width: 480, height: 320 });

  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    if (width > 0 && height > 0) setDims({ width, height });
  }, []);

  const placed = useWordCloud(tools, dims.width, dims.height);

  const COLORS = [
    "#a855f7",
    "#c084fc",
    "#7c3aed",
    "#d8b4fe",
    "#e879f9",
    "#818cf8",
    "#a78bfa",
  ];
  const getColor = (i) => COLORS[i % COLORS.length];

  if (tools.length === 0) {
    return (
      <div style={styles.pageInner}>
        <div style={styles.pageLabel}>02 / Tools</div>
        <h2 style={styles.pageTitle}>My Daily Stack</h2>
        <p style={styles.pageSubtitle}>
          The tools I reach for every day — chosen for speed, clarity, and
          craft.
        </p>
        <div
          style={{
            marginTop: "24px",
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <div style={styles.emptyStateContainer}>
            <div style={styles.emptyStateCircle}>
              <Terminal size={28} style={styles.emptyStateIcon} />
            </div>
            <p style={styles.emptyStateText}>No tools added</p>
            <p style={styles.emptyStateSubtext}>
              Industry tools will appear here once added to your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ ...styles.pageInner, overflow: "hidden" }}>
      <div style={styles.pageLabel}>02 / Tools</div>
      <h2 style={styles.pageTitle}>My Daily Stack</h2>
      <p style={styles.pageSubtitle}>
        The tools I reach for every day — chosen for speed, clarity, and craft.
      </p>

      <div
        ref={containerRef}
        style={{
          flex: 1,
          marginTop: "20px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {placed.length > 0 ? (
          <svg
            width={dims.width}
            height={dims.height}
            viewBox={`${-dims.width / 2} ${-dims.height / 2} ${dims.width} ${dims.height}`}
            style={{ overflow: "visible", display: "block" }}>
            {placed.map((word, i) => (
              <text
                key={word.text}
                textAnchor="middle"
                transform={`translate(${word.x ?? 0},${word.y ?? 0}) rotate(${word.rotate ?? 0})`}
                style={{
                  fontSize: `${word.size}px`,
                  fontFamily: "monospace",
                  fontWeight: i < 3 ? 700 : 500,
                  fill: getColor(i),
                  opacity: 1,
                  cursor: "default",
                  userSelect: "none",
                  letterSpacing: "0.03em",
                }}
                onMouseEnter={(e) => {
                  e.target.style.filter = "drop-shadow(0 0 8px currentColor)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.filter = "none";
                }}>
                {word.text}
              </text>
            ))}
          </svg>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#a855f7",
                    opacity: 0.4,
                    animation: `cloudPulse 1.2s ease-in-out infinite ${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: "12px",
                color: "rgba(168,85,247,0.5)",
                fontFamily: "monospace",
              }}>
              computing layout…
            </span>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "12px",
          paddingBottom: "4px",
        }}>
        <span
          style={{
            fontSize: "11px",
            fontFamily: "monospace",
            color: "rgba(168,85,247,0.5)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
          {tools.length} tool{tools.length !== 1 ? "s" : ""} in stack
        </span>
      </div>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function ProjectsPage({ profile }) {
  const projects = profile?.Projects || [];
  const [currentProject, setCurrentProject] = useState(0);
  const [currentMedia, setCurrentMedia] = useState(0);
  const [fadingMedia, setFadingMedia] = useState(false);
  const [fadingProject, setFadingProject] = useState(false);

  const hasProjects = projects.length > 0;
  const isMultiProject = projects.length > 1;
  const project = projects[currentProject];
  const mediaList = project?.Media || [];
  const hasMultiMedia = mediaList.length > 1;

  // Auto-cycle media within a project, then advance project
  useEffect(() => {
    if (!hasProjects) return;
    if (!hasMultiMedia && !isMultiProject) return;

    const interval = setInterval(() => {
      const isLastMedia = currentMedia >= mediaList.length - 1;

      if (!isLastMedia) {
        // Fade to next media in same project
        setFadingMedia(true);
        setTimeout(() => {
          setCurrentMedia((m) => m + 1);
          setFadingMedia(false);
        }, 350);
      } else if (isMultiProject) {
        // Last media — advance to next project
        setFadingProject(true);
        setTimeout(() => {
          setCurrentProject((p) => (p + 1) % projects.length);
          setCurrentMedia(0);
          setFadingProject(false);
        }, 400);
      } else {
        // Single project, loop media
        setFadingMedia(true);
        setTimeout(() => {
          setCurrentMedia(0);
          setFadingMedia(false);
        }, 350);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [
    currentMedia,
    currentProject,
    mediaList.length,
    hasMultiMedia,
    isMultiProject,
    hasProjects,
    projects.length,
  ]);

  // Reset media index when project changes manually
  const goToProject = (idx) => {
    if (idx === currentProject) return;
    setFadingProject(true);
    setTimeout(() => {
      setCurrentProject(idx);
      setCurrentMedia(0);
      setFadingProject(false);
    }, 400);
  };

  // ── Fallback ────────────────────────────────────────────────────────────────
  if (!hasProjects) {
    return (
      <div style={styles.pageInner}>
        <div style={styles.pageLabel}>04 / Projects</div>
        <h2 style={styles.pageTitle}>Selected Work</h2>
        <p style={styles.pageSubtitle}>
          A few things built with care — each one a different kind of problem.
        </p>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
          }}>
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "rgba(168,85,247,0.06)",
              border: "1px dashed rgba(168,85,247,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <svg
              width="38"
              height="38"
              viewBox="0 0 24 24"
              fill="none"
              stroke="rgba(168,85,247,0.5)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--color-text)",
                margin: "0 0 6px",
              }}>
              Project details yet to be added
            </p>
            <p
              style={{
                fontSize: "12.5px",
                color: "var(--color-text-muted)",
                margin: 0,
                lineHeight: 1.6,
              }}>
              Currently in development — check back soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const mediaItem = mediaList[currentMedia];
  const links = project?.Links || [];
  const hasLinks = links.length > 0;

  return (
    <div style={{ ...styles.pageInner, gap: 0 }}>
      <div style={styles.pageLabel}>04 / Projects</div>

      {/* ── Project info + nav ──────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "16px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "4px",
              flexWrap: "wrap",
            }}>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--color-text)",
                letterSpacing: "-0.03em",
                opacity: fadingProject ? 0 : 1,
                transition: "opacity 0.35s ease",
                lineHeight: 1.15,
                margin: 0,
                marginBottom: "10px",
              }}>
              {project.Name}
            </h2>

            {/* Live / GitHub links */}
            {hasLinks &&
              links.map((link, li) => {
                const isGithub = link?.url?.includes("github");
                return (
                  <a
                    key={li}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "#a855f7",
                      background: "rgba(168,85,247,0.1)",
                      border: "1px solid rgba(168,85,247,0.25)",
                      borderRadius: "20px",
                      padding: "3px 10px",
                      textDecoration: "none",
                      letterSpacing: "0.02em",
                      transition:
                        "background 0.2s ease, border-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(168,85,247,0.2)";
                      e.currentTarget.style.borderColor =
                        "rgba(168,85,247,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(168,85,247,0.1)";
                      e.currentTarget.style.borderColor =
                        "rgba(168,85,247,0.25)";
                    }}>
                    {isGithub ? (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.37.6.1.82-.26.82-.57v-2c-3.34.72-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.06 1.82 2.8 1.3 3.48.99.1-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.68.83.57C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
                    ) : (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    )}
                    {isGithub ? "GitHub" : "Live"}
                  </a>
                );
              })}
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "var(--color-text-muted, rgba(255,255,255,0.45))",
              lineHeight: 1.6,
              opacity: fadingProject ? 0 : 1,
              transition: "opacity 0.35s ease",
              margin: 0,
              maxWidth: "480px",
            }}>
            {project.Description}
          </p>
        </div>

        {/* Project dots (only if multiple projects) */}
        {isMultiProject && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              paddingBottom: "2px",
              flexShrink: 0,
            }}>
            {projects.map((_, pi) => (
              <button
                key={pi}
                onClick={() => goToProject(pi)}
                style={{
                  width: "6px",
                  height: pi === currentProject ? "22px" : "6px",
                  borderRadius: "3px",
                  background:
                    pi === currentProject ? "#a855f7" : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "height 0.3s ease, background 0.3s ease",
                  boxShadow:
                    pi === currentProject
                      ? "0 0 8px rgba(168,85,247,0.6)"
                      : "none",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minHeight: 0,
        }}>
        {/* ── Media area ─────────────────────────────────────────────── */}
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
          {mediaItem ? (
            mediaItem.resourceType === "video" ? (
              <video
                key={`${currentProject}-${currentMedia}`}
                src={mediaItem.url}
                autoPlay
                muted
                loop={false}
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: fadingMedia || fadingProject ? 0 : 1,
                  transition: "opacity 0.35s ease",
                }}
              />
            ) : (
              <img
                key={`${currentProject}-${currentMedia}`}
                src={mediaItem.url}
                alt={project.Name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  opacity: fadingMedia || fadingProject ? 0 : 1,
                  transition: "opacity 0.35s ease",
                }}
              />
            )
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.15)",
                fontSize: "13px",
              }}>
              No media
            </div>
          )}

          {/* bottom gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(10,8,18,0.65) 0%, transparent 55%)",
              pointerEvents: "none",
            }}
          />

          {/* Media dots (bottom-left of image) */}
          {hasMultiMedia && (
            <div
              style={{
                position: "absolute",
                bottom: "12px",
                left: "14px",
                display: "flex",
                gap: "5px",
                zIndex: 2,
              }}>
              {mediaList.map((_, mi) => (
                <div
                  key={mi}
                  style={{
                    width: mi === currentMedia ? "18px" : "6px",
                    height: "6px",
                    borderRadius: "3px",
                    background:
                      mi === currentMedia ? "#a855f7" : "rgba(255,255,255,0.3)",
                    transition: "width 0.3s ease, background 0.3s ease",
                    boxShadow:
                      mi === currentMedia
                        ? "0 0 6px rgba(168,85,247,0.7)"
                        : "none",
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Location ─────────────────────────────────────────────────────────────────

function LocationPage({ profile }) {
  const address = profile?.Address || {};
  const pin = address.Pin;
  const state = address.State || "";
  const country = address.Country || "India";
  const street = address.Street || "";

  const [geoData, setGeoData] = useState(null);
  const [geoLoading, setGeoLoading] = useState(true);

  useEffect(() => {
    if (!pin) {
      setGeoLoading(false);
      return;
    }

    fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${pin}&country=${encodeURIComponent(country)}&format=json&limit=1&addressdetails=1`,
      { headers: { "Accept-Language": "en" } },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.length) setGeoData(data[0]);
      })
      .catch(() => {})
      .finally(() => setGeoLoading(false));
  }, [pin, country]);

  /* ── Derived display values ────────────────────────────────── */
  const lat = geoData ? parseFloat(geoData.lat) : null;
  const lon = geoData ? parseFloat(geoData.lon) : null;

  // Prefer suburb → city → town → county → state from Nominatim addressdetails
  const addr = geoData?.address || {};
  const cityName =
    addr.suburb || addr.city || addr.town || addr.county || state || "—";

  const latStr =
    lat != null ? `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}` : "—";
  const lonStr =
    lon != null ? `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? "E" : "W"}` : "—";

  // google map embedded
  const gmSrc =
    lat != null && lon != null
      ? `https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed`
      : null;

  // Fallback Google Maps link (opens in new tab)
  const fullAddress = [street, state, pin, country].filter(Boolean).join(", ");
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  /* ── Displayed city title ──────────────────────────────────── */
  const pageTitle = geoLoading ? "Locating…" : `Based in ${cityName}`;

  return (
    <div style={styles.pageInner}>
      <div style={styles.pageLabel}>03 / Location</div>
      <h2 style={styles.pageTitle}>{pageTitle}</h2>
      <p style={styles.pageSubtitle}>
        {street || state
          ? `${state}${country ? `, ${country}` : ""} — open to remote collaboration across time zones.`
          : "Open to remote collaboration across time zones."}
      </p>

      <div
        style={{
          marginTop: "28px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}>
        {/* ── Map card ──────────────────────────────────────────── */}
        <div style={styles.mapCard}>
          {geoLoading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}>
              <span
                style={{
                  fontSize: "12px",
                  color: "rgba(168,85,247,0.6)",
                  fontFamily: "monospace",
                }}>
                Geocoding {pin}…
              </span>
            </div>
          )}

          {/* GM iframe */}
          {gmSrc && (
            <iframe
              src={gmSrc}
              title="Location map"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "inherit",
                opacity: geoLoading ? 0 : 0.85,
                transition: "opacity 0.4s ease",
              }}
            />
          )}

          {/* Fallback grid when no coords yet */}
          {!gmSrc && <div style={styles.mapGrid} />}

          {/* Coordinates */}
          <div style={styles.mapLat}>
            {latStr}, {lonStr}
          </div>

          {/* Open in Google Maps */}
          {/* <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              top: "12px",
              right: "14px",
              fontSize: "10px",
              fontFamily: "monospace",
              color: "var(--color-text)",
              letterSpacing: "0.06em",
              textDecoration: "none",
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(6px)",
              padding: "3px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(168,85,247,0.25)",
            }}>
            Open ↗
          </a> */}
        </div>

        {/* ── Info row ──────────────────────────────────────────── */}
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

// ─── Inject keyframes ─────────────────────────────────────────────────────────

if (
  typeof document !== "undefined" &&
  !document.getElementById("carousel-keyframes")
) {
  const s = document.createElement("style");
  s.id = "carousel-keyframes";
  s.textContent = `@keyframes carouselFadeIn { from { opacity:0; transform:scale(1.03) } to { opacity:1; transform:scale(1) } }`;
  document.head.appendChild(s);
}

if (
  typeof document !== "undefined" &&
  !document.getElementById("wordcloud-keyframes")
) {
  const s = document.createElement("style");
  s.id = "wordcloud-keyframes";
  s.textContent = `
    @keyframes cloudPulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50%       { opacity: 0.9; transform: scale(1.3); }
    }
  `;
  document.head.appendChild(s);
}

if (
  typeof document !== "undefined" &&
  !document.getElementById("empty-state-keyframes")
) {
  const s = document.createElement("style");
  s.id = "empty-state-keyframes";
  s.textContent = `
    @keyframes pulse {
      0%, 100% { box-shadow: 0 8px 32px rgba(168, 85, 247, 0.15); transform: scale(1); }
      50%       { box-shadow: 0 12px 48px rgba(168, 85, 247, 0.25); transform: scale(1.02); }
    }
  `;
  document.head.appendChild(s);
}

// ─── Page registry (4 pages) ──────────────────────────────────────────────────

const PAGE_COMPONENTS = [
  SkillsPage, // receives profile
  ToolsPage, // receives profile
  ProjectsPage, // static
  LocationPage, // static
];

const PAGE_BG = Array(4).fill("var(--color-bg)");

// Pages that need the profile prop
const PROFILE_PAGE_INDICES = new Set([0, 1, 2, 3]);

// ─────────────────────────────────────────────────────────────────────────────
// Portal content
// ─────────────────────────────────────────────────────────────────────────────
function PortalContent({ profile }) {
  const wrapperRef = useRef(null);
  const rightPanelRef = useRef(null);
  const leftPanelRef = useRef(null);
  const pageRefs = useRef(PAGE_COMPONENTS.map(() => React.createRef()));
  const navRefs = useRef(NAV_ITEMS.map(() => React.createRef()));
  const activeRef = useRef(0);

  useEffect(() => {
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

      const rightPanel = rightPanelRef.current;
      if (rightPanel) {
        const rightOpacity =
          lp < 0.25 ? lp / 0.25 : lp > 0.9 ? 1 - (lp - 0.9) / 0.1 : 1;
        rightPanel.style.opacity = rightOpacity;
      }

      const leftPanel = leftPanelRef.current;
      if (leftPanel) {
        const leftOpacity = lp > 0.9 ? 1 - (lp - 0.9) / 0.1 : 1;
        leftPanel.style.opacity = leftOpacity;
      }

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

      pageRefs.current.forEach((ref, i) => {
        if (ref.current) {
          ref.current.style.pointerEvents = i === active ? "auto" : "none";
        }
      });
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
                pointerEvents: "none",
                zIndex: i,
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
              {PROFILE_PAGE_INDICES.has(i) ? (
                <PageComp profile={profile} />
              ) : (
                <PageComp />
              )}
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

// ─── Nav + border helpers ──────────────────────────────────────────────────────

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
    if (labelSpan)
      labelSpan.style.color = isActive
        ? "var(--color-text)"
        : "var(--color-text-muted, rgba(128,128,128,0.6))";
    if (dot) {
      dot.style.background = isActive ? "#a855f7" : "transparent";
      dot.style.boxShadow = isActive ? "0 0 8px rgba(168,85,247,0.8)" : "none";
    }
  });
}

function applyPageBorders(refs, activeIndex, lp) {
  refs.forEach((ref, i) => {
    const el = ref.current;
    if (!el) return;
    if (i > activeIndex) {
      el.style.borderColor = "var(--color-border)";
    } else if (i === activeIndex) {
      const nextSlideStart = SLIDE_THRESHOLDS[i + 1]?.[0];
      const nextIsSliding =
        nextSlideStart !== undefined && lp >= nextSlideStart;
      el.style.borderColor = nextIsSliding
        ? "var(--color-border-muted)"
        : "var(--color-border)";
    } else {
      el.style.borderColor = "var(--color-border-muted)";
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Default export
// ─────────────────────────────────────────────────────────────────────────────
export default function Skills({ profile }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {mounted &&
        createPortal(<PortalContent profile={profile} />, document.body)}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = {
  leftPanel: {
    flex: "0 0 62%",
    padding: "36px 28px 36px 40px",
    display: "flex",
    alignItems: "stretch",
  },
  leftFrame: {
    flex: 1,
    position: "relative",
    pointerEvents: "auto",
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
  navList: { display: "flex", flexDirection: "column", gap: "10px" },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px 20px",
    borderRadius: "14px",
    color: "var(--color-text)",
    transition:
      "background 0.35s ease, border-color 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1)",
    cursor: "default",
  },
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
    background: "var(--color-glass)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(168,85,247,0.5)",
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
    background: "var(--color-bg-muted)",
    border: "1px solid var(--color-border)",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  infoLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--color-text-muted)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--color-text)",
    letterSpacing: "-0.01em",
  },
  emptyStateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    padding: "32px 24px",
    textAlign: "center",
  },
  emptyStateCircle: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    background:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(168, 85, 247, 0.1))",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(168, 85, 247, 0.15)",
    animation: "pulse 3s ease-in-out infinite",
  },
  emptyStateIcon: { color: "#a855f7", opacity: 0.9 },
  emptyStateText: {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--color-text)",
    margin: 0,
    letterSpacing: "-0.01em",
  },
  emptyStateSubtext: {
    fontSize: "13px",
    color: "var(--color-text-muted, rgba(128,128,128,0.6))",
    margin: 0,
    maxWidth: "280px",
    lineHeight: 1.5,
  },
};
