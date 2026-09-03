"use client";

import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function DashboardPage() {
  return (
    <div className="space-y-12 pb-10">
      
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--color-surface-1)] p-10 lg:p-16 border border-[var(--color-border-subtle)] diagonal-cut-bottom">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-[var(--color-accent-400)]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-[var(--color-brand-500)]/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex items-center gap-4 text-xs font-mono font-semibold tracking-widest text-[var(--color-text-tertiary)] uppercase">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand-500)] animate-pulse" />
            System Online • 00:00:24:12
          </div>
          
          <h1 className="font-[family-name:var(--font-display)] text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter text-[var(--color-text-primary)]">
            Every Frame <br/>
            <span className="text-gradient">Earns Its Place.</span>
          </h1>
          
          <p className="text-lg text-[var(--color-text-secondary)] font-medium max-w-lg">
            Ready for your next practice session? Your cognitive metrics are tracking above average.
          </p>

          <div className="pt-4 flex gap-4">
            <Link href={ROUTES.PRACTICE}>
              <MagneticButton 
                className="bg-[var(--color-brand-600)] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[var(--color-brand-500)] transition-colors shadow-[0_0_30px_oklch(0.75_0.22_140_/_0.4)]"
                magneticStrength={0.3}
              >
                Launch Interview
              </MagneticButton>
            </Link>
            <MagneticButton 
              className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[var(--color-surface-3)] transition-colors border border-[var(--color-border-default)]"
              magneticStrength={0.15}
            >
              View Passport
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── METRICS GRID ── */}
      <section>
        <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-tight mb-6 flex items-center gap-4">
          Core Metrics
          <span className="h-px flex-1 bg-[var(--color-border-subtle)]" />
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Sessions", value: "14", trend: "+2 this week", color: "var(--color-brand-400)" },
            { label: "Avg. Score", value: "86/100", trend: "Top 12%", color: "var(--color-accent-600)" },
            { label: "Practice Streak", value: "5 Days", trend: "🔥 Fired up", color: "var(--color-danger-500)" },
            { label: "Passport Level", value: "Lvl 4", trend: "Intermediate", color: "var(--color-accent-400)" },
          ].map((metric, i) => (
            <TiltCard3D key={i} className="p-6 overflow-hidden relative group" glareColor={metric.color}>
              <div className="absolute -right-4 -top-4 text-9xl opacity-5 font-[family-name:var(--font-display)] font-black group-hover:scale-110 transition-transform duration-700">
                {i + 1}
              </div>
              <p className="text-xs font-mono font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider">
                {metric.label}
              </p>
              <div className="mt-4 flex items-end gap-3">
                <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-[var(--color-text-primary)]">
                  {metric.value}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium" style={{ color: metric.color }}>
                {metric.trend}
              </p>
            </TiltCard3D>
          ))}
        </div>
      </section>

      {/* ── INTERVIEW TRACKS ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold uppercase tracking-tight">
            Select Track
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TiltCard3D className="p-8 border-[var(--color-accent-400)]/30 group" glareColor="var(--color-accent-400)">
            <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-400)] transition-colors">
              System Design
            </h3>
            <p className="mt-2 text-[var(--color-text-secondary)] max-w-sm">
              Architecture, scalability, and deep technical design rounds focused on distributed systems.
            </p>
            <div className="mt-8">
              <span className="font-mono text-xs font-semibold px-3 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)] uppercase">
                Est: 45 Mins
              </span>
            </div>
          </TiltCard3D>
          
          <TiltCard3D className="p-8 border-[var(--color-brand-500)]/30 group" glareColor="var(--color-brand-500)">
            <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-400)] transition-colors">
              Behavioral
            </h3>
            <p className="mt-2 text-[var(--color-text-secondary)] max-w-sm">
              STAR method, soft skills, and conflict resolution scenarios with our AI hiring manager.
            </p>
            <div className="mt-8">
              <span className="font-mono text-xs font-semibold px-3 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)] uppercase">
                Est: 30 Mins
              </span>
            </div>
          </TiltCard3D>
        </div>
      </section>
      
    </div>
  );
}
