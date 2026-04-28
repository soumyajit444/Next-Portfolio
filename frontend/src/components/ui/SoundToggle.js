"use client";

import { useAudio } from "./AudioProvider";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const { muted, toggle } = useAudio();

  return (
    <>
      <style>{`
        .sound-toggle-wrapper {
          position: relative;
          display: inline-flex;
        }
        .sound-toggle-wrapper::after {
          content: attr(data-tooltip);
          position: absolute;
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          background: var(--color-text);
          color: var(--color-bg);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          white-space: nowrap;
          padding: 4px 9px;
          border-radius: 6px;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .sound-toggle-wrapper::before {
          content: "";
          position: absolute;
          top: calc(100% + 3px);
          border-bottom-color: var(--color-text);
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          border: 4px solid transparent;
          
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .sound-toggle-wrapper:hover::after,
        .sound-toggle-wrapper:hover::before {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}</style>

      <div
        className="sound-toggle-wrapper"
        data-tooltip={
          muted ? "Unmute Background Audio" : "Mute Background Audio"
        }>
        <button
          onClick={toggle}
          aria-label={
            muted ? "Unmute background audio" : "Mute background audio"
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
            transition: "opacity 0.2s",
            color: "var(--color-text)",
            opacity: muted ? 0.4 : 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.opacity = muted ? "0.4" : "1")
          }>
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </>
  );
}
