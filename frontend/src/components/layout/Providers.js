"use client";

import { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

import Background from "@/components/animations/Background";
import SplashCursor from "@/components/animations/SplashCursor";
import Header from "@/components/layout/Header";
import { AudioProvider } from "@/components/ui/AudioProvider";

const particlesInit = async (engine) => {
  await loadSlim(engine);
};

export default function Providers({ children }) {
  const pathname = usePathname();

  const shouldHideHeader =
    pathname === "/" ||
    pathname?.startsWith("/profile-management") ||
    pathname?.startsWith("/create-profile");

  return (
    <ParticlesProvider init={particlesInit}>
      <AudioProvider>
        {!shouldHideHeader && <Header />}

        <Background />

        <SplashCursor
          DENSITY_DISSIPATION={3.5}
          VELOCITY_DISSIPATION={2}
          PRESSURE={0.1}
          CURL={3}
          SPLAT_RADIUS={0.2}
          SPLAT_FORCE={6000}
          COLOR_UPDATE_SPEED={10}
          SHADING
          RAINBOW_MODE={false}
          COLOR="#4900d0"
        />

        {children}

        <Toaster position="top-right" richColors />
      </AudioProvider>
    </ParticlesProvider>
  );
}
