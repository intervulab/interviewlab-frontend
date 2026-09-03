"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";

export default function PricingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--color-surface-0)] pb-32">
      {/* ── Background Gradients ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-brand-600)] opacity-20 blur-[150px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-accent-500)] opacity-10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* ── Navigation ── */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-[var(--color-brand-500)] tracking-widest">SYS.V1</span>
            <span className="text-2xl font-black font-[family-name:var(--font-display)] uppercase tracking-tighter text-[var(--color-text-primary)]">
              InterviewLab
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href={ROUTES.ABOUT} className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">
              About
            </Link>
            <Link href={ROUTES.LOGIN} className="text-sm font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <MagneticButton className="bg-[var(--color-brand-600)] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors hover:bg-[var(--color-brand-500)] shadow-[0_0_15px_oklch(0.75_0.22_140_/_0.3)]">
                Initialize
              </MagneticButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="mx-auto max-w-7xl px-6 pt-48 pb-20 text-center relative z-10">
        <h1 className="text-7xl lg:text-9xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
          SIMPLE. <span className="text-[var(--color-brand-400)] text-transparent bg-clip-text bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-accent-400)]">TRANSPARENT.</span>
        </h1>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] font-bold text-[var(--color-text-secondary)]">
          &gt; START_FREE // UPGRADE_WHEN_READY
        </p>
      </div>

      {/* ── Pricing Grid ── */}
      <div className="mx-auto mt-12 grid max-w-7xl gap-8 px-6 lg:grid-cols-3 relative z-10">
        
        {/* Starter */}
        <TiltCard3D className="p-10 border-[var(--color-border-subtle)]" glareColor="var(--color-surface-4)">
          <h3 className="text-4xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">Starter</h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">For getting started</p>
          <div className="mt-8">
            <span className="text-7xl font-black font-[family-name:var(--font-display)]">Free</span>
          </div>
          <ul className="mt-10 space-y-6 font-mono text-sm font-bold text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> 3 mock interviews / month</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Basic feedback & scoring</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Resume upload</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Behavioral track only</li>
          </ul>
        </TiltCard3D>

        {/* Pro (Highlighted) */}
        <TiltCard3D className="p-10 border-[var(--color-brand-500)] bg-[var(--color-surface-1)] shadow-[0_0_40px_oklch(0.75_0.22_140_/_0.15)] relative overflow-hidden" glareColor="var(--color-brand-400)">
          <div className="absolute top-0 right-0 bg-[var(--color-brand-500)] text-black px-6 py-2 text-xs font-black uppercase tracking-widest diagonal-cut">
            Most Popular
          </div>
          <h3 className="text-4xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-brand-400)]">Pro</h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">For serious prep</p>
          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-7xl font-black font-[family-name:var(--font-display)]">$19</span>
            <span className="font-mono text-sm text-[var(--color-text-tertiary)] uppercase tracking-widest">/mo</span>
          </div>
          <Link href={ROUTES.REGISTER} className="block mt-8">
            <button className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-6 py-4 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors">
              Upgrade to Pro
            </button>
          </Link>
          <ul className="mt-10 space-y-6 font-mono text-sm font-bold text-[var(--color-text-primary)]">
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Unlimited mock interviews</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> All interview types (System Design)</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Real-time audio analytics</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Interactive Canvas</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> JD-personalized questions</li>
          </ul>
        </TiltCard3D>

        {/* Campus */}
        <TiltCard3D className="p-10 border-[var(--color-border-subtle)]" glareColor="var(--color-accent-400)">
          <h3 className="text-4xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">Campus</h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">For placement cells</p>
          <div className="mt-8">
            <span className="text-7xl font-black font-[family-name:var(--font-display)]">Custom</span>
          </div>
          <ul className="mt-10 space-y-6 font-mono text-sm font-bold text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Everything in Pro</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Cohort analytics dashboard</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Faculty admin panel</li>
            <li className="flex items-center gap-3"><span className="text-[var(--color-brand-500)]">✓</span> Bulk student onboarding</li>
          </ul>
        </TiltCard3D>
      </div>
    </div>
  );
}
