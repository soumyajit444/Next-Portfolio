import { Work_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={workSans.variable} data-theme="dark">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
