import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Background from "@/components/animations/Background"; // ✅ ADD

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
        <ThemeToggle />

        {/* ✅ GLOBAL BACKGROUND (OUTSIDE GSAP TREE) */}
        <Background />

        {children}

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
