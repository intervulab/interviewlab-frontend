import type { Metadata } from "next";

export const metadata: Metadata = { title: "Interview Detail" };

export default function InterviewDetailPage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
        Interview Session
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Detailed review with transcript, scores, and audio metrics.
      </p>
      <div className="glass rounded-xl p-8 text-center text-[var(--color-text-tertiary)]">
        Interview detail and replay view will render here.
      </div>
    </div>
  );
}
