"use client";

import ThemeToggle from "../ui/ThemeToggle";
import SoundToggle from "../ui/SoundToggle";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between p-4 z-50">
      <h1 className="font-semibold">Soumyajit</h1>

      <div className="flex gap-3">
        <ThemeToggle />
        <SoundToggle />
      </div>
    </header>
  );
}
