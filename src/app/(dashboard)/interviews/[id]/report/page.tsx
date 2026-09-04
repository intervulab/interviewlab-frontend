import type { Metadata } from "next";

export const metadata: Metadata = { title: "Interview Report" };

export default function InterviewReportPage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
        Performance Report
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Comprehensive breakdown of your interview performance.
      </p>
      <div className="glass rounded-xl p-8 text-center text-[var(--color-text-tertiary)]">
        Detailed scoring, transcript analysis, and audio metrics will render here.
      </div>
    </div>
  );
}
