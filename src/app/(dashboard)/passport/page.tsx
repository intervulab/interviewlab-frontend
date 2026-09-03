import type { Metadata } from "next";
import { PASSPORT_DIMENSIONS } from "@/lib/constants";

export const metadata: Metadata = { title: "Student Passport" };

export default function PassportPage() {
  return (
    <div className="animate-fade-in-up space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[family-name:var(--font-display)]">
          🪪 Student Passport
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Track your growth across interview dimensions over time.
        </p>
      </div>

      {/* Skill Dimensions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PASSPORT_DIMENSIONS.map((dimension) => (
          <div key={dimension} className="glass rounded-xl p-4">
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">
              {dimension}
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--color-text-tertiary)]">—</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-[var(--color-surface-3)]">
              <div className="h-full w-0 rounded-full bg-[var(--color-brand-500)] transition-all" />
            </div>
          </div>
        ))}
      </div>

      {/* Radar Chart Placeholder */}
      <div className="glass flex items-center justify-center rounded-xl py-20">
        <div className="text-center">
          <span className="text-4xl">📊</span>
          <p className="mt-4 font-medium">Skill Radar Chart</p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Complete at least 3 interviews to unlock your skill radar.
          </p>
        </div>
      </div>

      {/* Progress Timeline Placeholder */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-display)]">
          Progress Timeline
        </h2>
        <div className="mt-6 flex items-center justify-center py-12 text-[var(--color-text-tertiary)]">
          Your improvement over time will be charted here.
        </div>
      </div>
    </div>
  );
}
