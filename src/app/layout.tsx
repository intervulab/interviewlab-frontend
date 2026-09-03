import type { Metadata, Viewport } from "next";
import { fontSans, fontDisplay } from "@/lib/fonts";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ToastProvider } from "@/providers/toast-provider";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: {
    default: "InterviewLab — AI-Powered Interview Preparation",
    template: "%s | InterviewLab",
  },
  description:
    "Master your next interview with AI-powered mock interviews, real-time speech analytics, multi-agent debate engine, and interactive system design canvas. Built for students, graduates, and job seekers.",
  keywords: [
    "AI interview",
    "mock interview",
    "interview preparation",
    "technical interview",
    "system design",
    "behavioral interview",
    "speech analytics",
    "career prep",
  ],
  authors: [{ name: "InterviewLab Team" }],
  creator: "InterviewLab",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "InterviewLab",
    title: "InterviewLab — AI-Powered Interview Preparation",
    description:
      "Master your next interview with AI multi-agent debates, real-time audio analytics, and interactive system design canvas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "InterviewLab",
    description: "AI-Powered Interview Preparation Platform",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1a1625" },
    { media: "(prefers-color-scheme: light)", color: "#f8f7fc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={cn(fontSans.variable, fontDisplay.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <ToastProvider>{children}</ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
