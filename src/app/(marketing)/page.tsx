"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { MagneticButton } from "@/components/shared/magnetic-button";

export default function LandingPage() {
  return (
    <div className="relative min-h-dvh bg-[var(--color-surface-0)] text-[var(--color-text-primary)] selection:bg-[var(--color-brand-500)] selection:text-black">
      
      {/* ── Fixed Nav ── */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-[var(--color-brand-500)] tracking-widest">SYS.V1</span>
            <span className="text-2xl font-black font-[family-name:var(--font-display)] uppercase tracking-tighter text-[var(--color-text-primary)]">
              InterviewLab
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href={ROUTES.PRICING} className="hidden sm:block text-sm font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-brand-400)] transition-colors">
              Pricing
            </Link>
            <Link href={ROUTES.LOGIN} className="hidden sm:block text-sm font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <MagneticButton className="bg-white text-black px-6 py-2.5 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors hover:bg-[var(--color-brand-500)] shadow-[0_0_15px_oklch(0.95_0.01_270_/_0.3)]">
                Initialize
              </MagneticButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Fixed Background & Noise ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-[800px] w-[800px] rounded-full bg-[var(--color-brand-600)] opacity-10 blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-[var(--color-accent-500)] opacity-10 blur-[120px]" />
      </div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none z-50" />

      {/* ── SCROLL SECTION 1: HERO ── */}
      <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-20">
        {/* Abstract 3D Hero Core */}
        <div className="absolute z-0 flex h-[600px] w-[600px] items-center justify-center opacity-30">
          <div className="absolute h-full w-full rounded-full border border-[var(--color-brand-500)] border-dashed animate-spin-slow" />
          <div className="absolute h-[80%] w-[80%] rounded-full border border-[var(--color-accent-400)] border-dashed animate-[spin_10s_linear_infinite_reverse]" />
          <div className="h-[40%] w-[40%] rounded-full bg-gradient-to-tr from-[var(--color-brand-500)] to-[var(--color-accent-500)] blur-[40px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-6"
        >
          <div className="mb-8 inline-flex items-center gap-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] px-4 py-2 font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-400)] shadow-lg">
            <span className="h-2 w-2 bg-[var(--color-brand-500)] animate-pulse" />
            AI-Powered Interview OS
          </div>
          <h1 className="text-7xl sm:text-9xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.85]">
            Interviews are <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-400)] to-[var(--color-accent-400)]">Broken.</span>
          </h1>
          <p className="mt-8 max-w-2xl font-mono text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed">
            Practice with multi-agent AI. Real-time analytics. Interactive Canvas. We&apos;re fixing the system.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <Link href={ROUTES.REGISTER}>
              <MagneticButton 
                className="bg-[var(--color-brand-600)] text-white px-10 py-5 text-lg font-bold uppercase tracking-widest diagonal-cut shadow-[0_0_30px_oklch(0.75_0.22_140_/_0.4)] hover:bg-[var(--color-brand-500)] transition-colors"
                magneticStrength={0.3}
              >
                Start For Free
              </MagneticButton>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── SCROLL SECTION 2: PRODUCT ── */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 py-32 bg-[var(--color-surface-0)] border-t border-[var(--color-border-subtle)] diagonal-cut">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)]">
              System <br/><span className="text-[var(--color-accent-400)]">Architecture</span>
            </h2>
            <div className="mt-10 space-y-8">
              {[
                { title: "Devil's Advocate Protocol", desc: "AI agents debate your questions before you hear them.", color: "var(--color-danger-500)" },
                { title: "Real-Time Telemetry", desc: "Live WPM and hesitation tracking as you speak.", color: "var(--color-brand-500)" },
                { title: "Interactive Canvas", desc: "Drag, drop, and architect distributed systems live.", color: "var(--color-accent-400)" }
              ].map((feat, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="font-mono text-3xl font-bold" style={{ color: feat.color }}>0{i + 1}</div>
                  <div>
                    <h3 className="text-2xl font-bold uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">{feat.title}</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Abstract 3D Product visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square rounded-full border border-dashed border-[var(--color-border-subtle)] flex items-center justify-center p-10"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-surface-1)] to-transparent rounded-full opacity-50" />
             <div className="relative w-full h-full border border-[var(--color-brand-500)]/30 rounded-full flex items-center justify-center shadow-[inset_0_0_50px_oklch(0.75_0.22_140_/_0.2)]">
                <div className="text-center font-mono font-bold uppercase tracking-[0.3em] text-[var(--color-brand-400)] animate-pulse">
                   [ RENDER_PRODUCT_PREVIEW ]
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* ── SCROLL SECTION 3: CTA ── */}
      <section className="relative z-30 mx-auto max-w-7xl px-6 py-40 text-center border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
         <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true, margin: "-100px" }}
           transition={{ duration: 0.6 }}
         >
           <h2 className="text-7xl sm:text-9xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)]">
             Got 3 Seconds?
           </h2>
           <p className="mt-6 font-mono text-sm uppercase tracking-widest text-[var(--color-text-secondary)]">
             That's all your resume has. Let's fix your interview skills this week.
           </p>
           <div className="mt-12 flex justify-center">
              <Link href={ROUTES.REGISTER}>
                <MagneticButton 
                  className="bg-white text-black px-12 py-6 text-xl font-bold uppercase tracking-widest diagonal-cut shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-[var(--color-brand-500)] transition-colors"
                  magneticStrength={0.4}
                >
                  Initialize Terminal
                </MagneticButton>
              </Link>
           </div>
         </motion.div>
      </section>
      
    </div>
  );
}
