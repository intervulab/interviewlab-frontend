import type { Metadata } from "next";

export const metadata: Metadata = { title: "Interview History" };

export default function InterviewsPage() {
  return (
    <div className="animate-fade-in-up space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">Interview History</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Review and replay your past sessions.</p>
        </div>
        <button className="rounded-lg bg-[var(--color-brand-600)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-brand-500)]">
          New Interview
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Technical", "Behavioral", "System Design", "HR"].map((filter) => (
          <button
            key={filter}
            className="rounded-full border border-[var(--color-border-default)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-brand-500)] hover:text-[var(--color-text-primary)]"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Empty State */}
      <div className="glass flex flex-col items-center justify-center rounded-xl py-20">
        <span className="text-4xl">📝</span>
        <p className="mt-4 font-medium">No interviews yet</p>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Complete your first mock interview to see it here.
        </p>
      </div>
    </div>
  );
}
