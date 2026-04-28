"use client";

import { useAudio } from "./AudioProvider";
import { Volume2, VolumeX } from "lucide-react";

export default function SoundToggle() {
  const { muted, toggle } = useAudio();

  return (
    <button
      onClick={toggle}
      aria-label={muted ? "Unmute background audio" : "Mute background audio"}
      title={muted ? "Unmute" : "Mute"}
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
  );
}
