"use client";

import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";

export default function InterviewsPage() {
  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border-subtle)] pb-8 gap-6">
        <div>
          <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
            SESSION <span className="text-[var(--color-brand-400)]">HISTORY</span>
          </h1>
          <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
            &gt; QUERY_DATABASE // REVIEW_ARCHIVES
          </p>
        </div>
        <MagneticButton 
          className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.2)] whitespace-nowrap"
          magneticStrength={0.15}
        >
          + New Session
        </MagneticButton>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex flex-wrap gap-3">
        {["All Records", "Technical", "Behavioral", "System Design", "HR"].map((filter, i) => (
          <button
            key={filter}
            className={`rounded-none border px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest transition-colors ${
              i === 0 
                ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--color-brand-400)] shadow-[inset_0_0_10px_oklch(0.75_0.22_140_/_0.2)]"
                : "border-[var(--color-border-default)] bg-[var(--color-surface-1)] text-[var(--color-text-tertiary)] hover:border-[var(--color-brand-400)] hover:text-[var(--color-text-primary)]"
            }`}
          >
            [{filter}]
          </button>
        ))}
      </div>

      {/* ── EMPTY STATE ── */}
      <TiltCard3D className="flex flex-col items-center justify-center p-24 text-center border-[var(--color-border-subtle)]" glareColor="var(--color-danger-500)">
        <div className="text-7xl opacity-50 mb-6 drop-shadow-2xl">⚠️</div>
        <h2 className="text-5xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-secondary)] tracking-tight">
          NO RECORDS FOUND
        </h2>
        <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] max-w-md">
          The database is empty. Initialize your first mock interview to populate the archives.
        </p>
      </TiltCard3D>
    </div>
  );
}
