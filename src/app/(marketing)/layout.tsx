import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "InterviewLab — Master Your Next Interview with AI",
  description:
    "AI-powered interview preparation with real-time speech analytics, multi-agent debate, and interactive system design canvas. Built for students, graduates, and job seekers.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
