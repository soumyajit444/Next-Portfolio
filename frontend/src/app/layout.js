import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Background from "@/components/animations/Background";
import SplashCursor from "@/components/animations/SplashCursor";
import Header from "@/components/layout/Header";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={workSans.variable} data-theme="light">
      <body suppressHydrationWarning>
        {/* <ThemeToggle /> */}
        <Header />

        <Background />
        {/* Cursor effect */}
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
      </body>
    </html>
  );
}
