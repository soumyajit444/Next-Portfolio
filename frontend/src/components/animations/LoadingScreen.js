"use client";

import { useEffect, useState, useRef } from "react";

/* ─── Module-level constants (computed once, same on SSR & client) ─── */
const CX = 200,
  CY = 200,
  R = 130;
const r4 = (n) => Math.round(n * 10000) / 10000;

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const rad = (((i / 72) * 360 - 90) * Math.PI) / 180;
  const isMajor = i % 6 === 0;
  const r1 = isMajor ? 155 : 148;
  return {
    x1: r4(CX + r1 * Math.cos(rad)),
    y1: r4(CY + r1 * Math.sin(rad)),
    x2: r4(CX + 162 * Math.cos(rad)),
    y2: r4(CY + 162 * Math.sin(rad)),
    major: isMajor,
  };
});

const toRad = (deg) => ((deg - 90) * Math.PI) / 180;

const arcPath = (pct) => {
  const angle = Math.min(Math.max(0.01, pct) * 360, 359.999);
  const x1 = r4(CX + R * Math.cos(toRad(0)));
  const y1 = r4(CY + R * Math.sin(toRad(0)));
  const x2 = r4(CX + R * Math.cos(toRad(angle)));
  const y2 = r4(CY + R * Math.sin(toRad(angle)));
  return `M ${x1} ${y1} A ${R} ${R} 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2}`;
};

const getLabel = (p) => {
  if (p < 25) return "Design";
  if (p < 50) return "Develop";
  if (p < 75) return "Deploy";
  return "Deliver";
};

const PHASES = ["Design", "Develop", "Deploy", "Deliver"];

/* ─────────────────────────────────────────────────────────────────── */

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const DURATION = 3000;
    const ease = (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const t = Math.min((now - startRef.current) / DURATION, 1);
      setProgress(Math.floor(ease(t) * 100));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(() => onComplete?.(), 900);
        }, 500);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [onComplete]);

  const pct = progress / 100;
  const label = getLabel(progress);

  return (
    <>
      {/* Only @keyframes live here — Tailwind has no syntax for these */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes dotSpin     { to { stroke-dashoffset: -40; } }
        @keyframes subtlePulse { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes countFlicker {
          0%,94%,100%{opacity:1} 95%{opacity:.6} 97%{opacity:1} 98%{opacity:.7}
        }
        @keyframes labelFade {
          from { opacity:0; transform:translateY(4px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Root overlay */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#080808] transition-opacity duration-[850ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "all" : "none",
          fontFamily: "'DM Sans', sans-serif",
        }}>
        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)",
          }}
        />

        {/* Brand — top right */}
        <div
          className="absolute right-11 top-9 leading-none text-white/85"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 32,
            letterSpacing: "0.04em",
          }}>
          SOUMYAJIT SENGUPTA
        </div>

        {/* SVG orb */}
        <div className="relative flex flex-col items-center">
          <svg width="400" height="400" viewBox="0 0 400 400">
            <defs>
              <linearGradient
                id="arcGrad"
                x1="1"
                y1="0"
                x2="0"
                y2="1"
                gradientUnits="objectBoundingBox">
                <stop offset="0%" stopColor="#4F8EF7" />
                <stop offset="40%" stopColor="#38D9D9" />
                <stop offset="75%" stopColor="#9B6DFF" />
                <stop offset="100%" stopColor="#C96FCC" />
              </linearGradient>
              <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="3"
                  result="blur"
                />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Spinning dotted outer ring */}
            <circle
              cx="200"
              cy="200"
              r="176"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
              strokeDasharray="1.5 6"
              strokeLinecap="round"
              style={{
                animation: "dotSpin 12s linear infinite",
                transformOrigin: "200px 200px",
              }}
            />

            {/* Tick marks */}
            {TICKS.map((tk, i) => (
              <line
                key={i}
                x1={tk.x1}
                y1={tk.y1}
                x2={tk.x2}
                y2={tk.y2}
                stroke={
                  tk.major ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.15)"
                }
                strokeWidth={tk.major ? 1.5 : 0.75}
                strokeLinecap="round"
              />
            ))}

            {/* Arc track */}
            <circle
              cx="200"
              cy="200"
              r={R}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
            />

            {/* Progress arc — client-only */}
            {isMounted && pct > 0.005 && (
              <path
                d={arcPath(pct)}
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                filter="url(#arcGlow)"
              />
            )}

            {/* Head dot — client-only */}
            {isMounted &&
              pct > 0.02 &&
              (() => {
                const rad = ((pct * 360 - 90) * Math.PI) / 180;
                const hx = r4(CX + R * Math.cos(rad));
                const hy = r4(CY + R * Math.sin(rad));
                return (
                  <g>
                    <circle
                      cx={hx}
                      cy={hy}
                      r={8}
                      fill="#38D9D9"
                      opacity="0.15"
                    />
                    <circle
                      cx={hx}
                      cy={hy}
                      r={4}
                      fill="#38D9D9"
                      opacity="0.5"
                    />
                    <circle
                      cx={hx}
                      cy={hy}
                      r={2}
                      fill="#ffffff"
                      opacity="0.9"
                    />
                  </g>
                );
              })()}
          </svg>

          {/* Counter + phase label — centred over SVG */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div>
              <span
                className="select-none text-white"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 88,
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                  animation: "countFlicker 5s ease-in-out infinite",
                }}>
                {progress}
              </span>
              <span
                className="ml-[3px] align-super font-light text-white/60"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 20 }}>
                %
              </span>
            </div>

            <p
              key={label}
              className="mt-3.5 uppercase text-white/30"
              style={{
                fontSize: 10,
                letterSpacing: "0.3em",
                animation:
                  "labelFade 0.35s ease both, subtlePulse 2s ease-in-out infinite",
              }}>
              {label}
            </p>
          </div>
        </div>

        {/* Tagline — bottom left */}
        <p
          className="absolute bottom-10 left-11 font-light uppercase leading-[1.9] text-white/30"
          style={{ fontSize: 11, letterSpacing: "0.18em" }}>
          Making high-quality
          <br />
          projects since 2022
        </p>

        {/* Phase dots — bottom right */}
        <div className="absolute bottom-11 right-11 flex items-center gap-1.5">
          {PHASES.map((phase) => (
            <div
              key={phase}
              title={phase}
              className="h-[5px] w-[5px] rounded-full transition-colors duration-300"
              style={{
                background:
                  isMounted && label === phase
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
