"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const INNER_W_VW = 118;
const END_X_PERCENT = -((INNER_W_VW - 100) / INNER_W_VW) * 100;

export default function Background() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const innerRef = useRef(null);

  useEffect(() => {
    setMounted(true);

    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") || "light";

    const updateTheme = () => setIsDark(getTheme() === "dark");
    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mounted || !innerRef.current) return;

    const el = innerRef.current;
    // quickSetter skips the GSAP tween overhead — just sets the value directly
    const setX = gsap.quickSetter(el, "xPercent");

    const handleBgScroll = (e) => {
      setX(e.detail * END_X_PERCENT);
    };

    window.addEventListener("bgscroll", handleBgScroll);
    return () => window.removeEventListener("bgscroll", handleBgScroll);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      suppressHydrationWarning
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
      <div
        ref={innerRef}
        style={{
          width: `${INNER_W_VW}vw`,
          height: "100%",
          willChange: "transform",
        }}>
        <img
          src={isDark ? "/dark-netweb.png" : "/light-netweb.png"}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "left center",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
