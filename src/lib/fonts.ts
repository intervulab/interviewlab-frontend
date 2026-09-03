import { Inter, Outfit, JetBrains_Mono } from "next/font/google";

/**
 * Primary font — Inter for UI text.
 * Clean, highly readable, designed for screens.
 */
export const fontSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/**
 * Display font — Outfit for headings and hero sections.
 * Modern geometric sans-serif with personality.
 */
export const fontDisplay = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * Monospace font — JetBrains Mono for code blocks and technical content.
 */
export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
