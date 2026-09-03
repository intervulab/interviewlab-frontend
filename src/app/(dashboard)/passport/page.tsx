"use client";

import { PASSPORT_DIMENSIONS } from "@/lib/constants";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";

export default function PassportPage() {
  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="border-b border-[var(--color-border-subtle)] pb-8">
        <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
          STUDENT <span className="text-[var(--color-accent-400)]">PASSPORT</span>
        </h1>
        <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
          &gt; ACCESS_METRICS // SKILL_DIMENSIONS_TRACKING
        </p>
      </div>

      {/* ── SKILL DIMENSIONS GRID ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PASSPORT_DIMENSIONS.map((dimension, idx) => (
          <TiltCard3D key={dimension} className="p-6 border-[var(--color-border-subtle)] group" glareColor="var(--color-accent-400)">
            <div className="absolute top-2 right-2 text-6xl font-black font-[family-name:var(--font-display)] text-[var(--color-text-tertiary)] opacity-10 group-hover:scale-110 transition-transform">
              0{idx + 1}
            </div>
            <p className="font-mono text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
              {dimension}
            </p>
            <p className="mt-4 text-5xl font-black font-[family-name:var(--font-display)] text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)] transition-colors">
              —
            </p>
            <div className="mt-6 h-1 w-full rounded-none bg-[var(--color-surface-3)] overflow-hidden">
              <div className="h-full w-0 bg-[var(--color-accent-400)] transition-all shadow-[0_0_10px_oklch(0.70_0.25_260)]" />
            </div>
          </TiltCard3D>
        ))}
      </div>

      {/* ── RADAR CHART ── */}
      <TiltCard3D className="flex flex-col items-center justify-center py-24 text-center border-[var(--color-border-subtle)]" glareColor="var(--color-brand-500)">
        <div className="text-7xl mb-6 opacity-30 drop-shadow-lg">📊</div>
        <h2 className="text-5xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
          Radar Calibration
        </h2>
        <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] max-w-md">
          Requires 3 completed sessions to unlock multi-dimensional skill radar.
        </p>
      </TiltCard3D>

      {/* ── PROGRESS TIMELINE ── */}
      <TiltCard3D className="p-10 border-[var(--color-border-subtle)]" glareColor="var(--color-brand-500)">
        <h2 className="text-4xl font-black uppercase font-[family-name:var(--font-display)] tracking-tight text-[var(--color-text-primary)]">
          Chronological Progress
        </h2>
        <div className="mt-8 flex items-center justify-center py-16 border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
            Awaiting Data Points...
          </span>
        </div>
      </TiltCard3D>
    </div>
  );
}
