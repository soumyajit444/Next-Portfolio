"use client";

import { createContext, useContext, useRef, useState, useEffect } from "react";

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const audio = new Audio("/audio/bg_audio.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = true; // always start muted
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      // First interaction — kick off playback
      if (!started) {
        audio.play().catch(() => {});
        setStarted(true);
      }
      audio.muted = false;
      setMuted(false);
    } else {
      audio.muted = true;
      setMuted(true);
    }
  };

  return (
    <AudioCtx.Provider value={{ muted, toggle }}>{children}</AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);
