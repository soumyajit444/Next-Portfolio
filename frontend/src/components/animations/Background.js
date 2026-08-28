"use client";

import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";

export default function Background() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") || "light";

    const updateTheme = () => {
      setIsDark(getTheme() === "dark");
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
      },

      background: {
        color: "transparent",
      },

      fpsLimit: 60,

      particles: {
        number: {
          value: 45,
          density: {
            enable: true,
            area: 1200,
          },
        },

        paint: {
          fill: {
            color: {
              value: isDark ? "#ffffff" : "#000000",
            },
          },
        },

        shape: {
          type: "circle",
        },

        opacity: {
          value: 0.7,
        },

        size: {
          value: {
            min: 2,
            max: 4,
          },
        },

        links: {
          enable: true,
          distance: 300,
          color: isDark ? "#ffffff" : "#000000",
          opacity: 0.35,
          width: 2.5,
        },

        move: {
          enable: true,
          speed: 0.6,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "bounce",
          },
        },
      },

      detectRetina: true,
    }),
    [isDark],
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
      <Particles
        key={isDark ? "dark" : "light"}
        id="portfolio-particles"
        options={options}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
