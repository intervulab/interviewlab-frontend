import type { Metadata } from "next";

export const metadata: Metadata = { title: "Practice" };

export default function PracticePage() {
  return (
    <div className="animate-fade-in-up space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Practice Mode</h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Configure your practice session. Paste a job description for personalized questions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Interview Type Selection */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Interview Type</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { type: "Technical", emoji: "💻" },
              { type: "Behavioral", emoji: "🗣️" },
              { type: "System Design", emoji: "🏗️" },
              { type: "HR Round", emoji: "🤝" },
            ].map((item) => (
              <button
                key={item.type}
                className="rounded-lg border border-[var(--color-border-default)] p-4 text-left transition-all hover:border-[var(--color-brand-500)]"
              >
                <span className="text-xl">{item.emoji}</span>
                <p className="mt-2 text-sm font-medium">{item.type}</p>
              </button>
            ))}
          </div>
        </div>

        {/* JD Input */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold">Job Description (Optional)</h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Paste a job description for role-specific questions.
          </p>
          <textarea
            placeholder="Paste the full job description here..."
            className="h-40 w-full resize-none rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none"
          />
        </div>
      </div>

      <button className="w-full rounded-xl bg-[var(--color-brand-600)] py-4 text-base font-semibold text-white transition-all hover:bg-[var(--color-brand-500)] hover:shadow-[var(--shadow-glow)] sm:w-auto sm:px-12">
        Start Practice Session
      </button>
    </div>
  );
}
