"use client";

import { useRef, useState } from "react";

export default function SoundToggle() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setPlaying(!playing);
  };

  return (
    <>
      <button onClick={toggleSound} className="border px-3 py-1 rounded-md">
        {playing ? "Mute" : "Play"}
      </button>

      <audio ref={audioRef} loop>
        <source src="/audio/bg.mp3" type="audio/mpeg" />
      </audio>
    </>
  );
}
