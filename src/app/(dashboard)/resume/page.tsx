"use client";

import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";

export default function ResumePage() {
  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="border-b border-[var(--color-border-subtle)] pb-8">
        <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
          RESUME <span className="text-[var(--color-brand-400)]">PARSER</span>
        </h1>
        <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
          &gt; INGEST_DATA // GENERATE_PERSONALIZED_QUESTIONS
        </p>
      </div>

      {/* ── UPLOAD AREA ── */}
      <TiltCard3D className="flex flex-col items-center justify-center p-20 text-center border-2 border-dashed border-[var(--color-border-default)] transition-colors hover:border-[var(--color-brand-500)]" glareColor="var(--color-brand-500)">
        <div className="text-7xl mb-6 opacity-30 drop-shadow-lg group-hover:scale-110 transition-transform duration-500">📄</div>
        <h2 className="text-5xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
          Drop File Here
        </h2>
        <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] max-w-md">
          PDF OR DOCX (MAX 10MB)
        </p>
        <div className="mt-10">
          <MagneticButton 
            className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-10 py-5 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.3)]"
            magneticStrength={0.2}
          >
            Browse Files
          </MagneticButton>
        </div>
      </TiltCard3D>
    </div>
  );
}
