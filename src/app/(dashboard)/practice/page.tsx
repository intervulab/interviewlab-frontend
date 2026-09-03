"use client";

import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";

export default function PracticePage() {
  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="border-b border-[var(--color-border-subtle)] pb-8">
        <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
          PRACTICE <span className="text-[var(--color-brand-400)]">CORE</span>
        </h1>
        <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
          &gt; CONFIGURE_SESSION // PASTE_JD_FOR_CALIBRATION
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* ── INTERVIEW TYPE ── */}
        <TiltCard3D className="p-8 border-[var(--color-border-default)]" glareColor="var(--color-brand-500)">
          <h2 className="text-4xl font-bold uppercase font-[family-name:var(--font-display)] mb-6 text-[var(--color-text-primary)] tracking-tight">
            Select Protocol
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { type: "Technical", icon: "💻", color: "var(--color-accent-400)" },
              { type: "Behavioral", icon: "🗣️", color: "var(--color-brand-500)" },
              { type: "System Design", icon: "🏗️", color: "var(--color-warning-400)" },
              { type: "HR Round", icon: "🤝", color: "var(--color-accent-600)" },
            ].map((item) => (
              <button
                key={item.type}
                className="group flex flex-col items-center justify-center rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-2)] p-6 transition-all hover:border-[var(--color-brand-500)] hover:bg-[var(--color-surface-3)] shadow-inner"
              >
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{item.icon}</span>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]">
                  {item.type}
                </p>
              </button>
            ))}
          </div>
        </TiltCard3D>

        {/* ── JD INPUT ── */}
        <TiltCard3D className="p-8 border-[var(--color-border-default)] flex flex-col" glareColor="var(--color-accent-400)">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-4xl font-bold uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
              Job Description
            </h2>
            <span className="font-mono text-xs font-bold text-[var(--color-text-tertiary)] uppercase">[ OPTIONAL ]</span>
          </div>
          <textarea
            placeholder="PASTE_RAW_DATA_HERE..."
            className="flex-1 w-full resize-none rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] p-6 font-mono text-sm text-[var(--color-brand-400)] placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand-500)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-500)] transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.5)]"
          />
        </TiltCard3D>
      </div>

      {/* ── START CTA ── */}
      <div className="flex justify-end pt-6">
        <MagneticButton 
          className="w-full sm:w-auto bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-12 py-6 text-xl font-bold uppercase tracking-widest font-[family-name:var(--font-display)] diagonal-cut shadow-[0_0_30px_oklch(0.75_0.22_140_/_0.3)] transition-colors"
          magneticStrength={0.2}
        >
          Initialize Session
        </MagneticButton>
      </div>
    </div>
  );
}
