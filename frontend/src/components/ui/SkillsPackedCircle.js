"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  transformSkillsForAmCharts,
  createPackedCircleChart,
  disposeChart,
} from "@/services/amcharts-utils";

export default function SkillsPackedCircle({
  skills = [],
  containerId = "skills-packed-chart",
  height = "400px",
  onSkillClick = null,
}) {
  const chartInstance = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    if (!skills?.length || typeof window === "undefined") return;

    const chartData = transformSkillsForAmCharts(skills, {
      rootName: "My Skills",
      colorScheme: "rating",
    });

    const chart = createPackedCircleChart(containerId, chartData, {
      minRadius: 4,
      maxRadius: 15,
      manyBodyStrength: -10,
      enableClick: onSkillClick,
      onNodeClick: onSkillClick,
      enableInteractions: true,
    });

    chartInstance.current = chart;
    const timer = setTimeout(() => setIsReady(true), 100);

    return () => {
      clearTimeout(timer);
      disposeChart(chart);
      chartInstance.current = null;
      setIsReady(false);
    };
  }, [skills, containerId, onSkillClick]);

  // Shared container style
  const containerStyle = {
    width: "100%",
    height,
    minHeight: "300px",
    borderRadius: "16px",
    overflow: "hidden",
  };

  // Loading skeleton
  if (!isReady) {
    return (
      <div
        id={containerId}
        style={{
          ...containerStyle,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
    );
  }
  return (
    <div
      id={containerId}
      style={{
        ...containerStyle,
        // ✅ Ensure pointer events work
        pointerEvents: "auto",
        position: "relative",
        zIndex: 1, // Ensure it's above background layers
        // ✅ Prevent scroll hijacking without blocking drag
        touchAction: "pan-y", // Allow vertical scroll, but not pinch-zoom
      }}
      onWheel={(e) => {
        // Only stop propagation if chart is actively being dragged
        // Otherwise let scroll pass through normally
        if (e.target.closest(".amcharts-node")) {
          e.stopPropagation();
        }
      }}
    />
  );
}

if (
  typeof document !== "undefined" &&
  !document.getElementById("amcharts-shimmer")
) {
  const style = document.createElement("style");
  style.id = "amcharts-shimmer";
  style.textContent = `
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }
  `;
  document.head.appendChild(style);
}
