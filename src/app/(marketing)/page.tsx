"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ROUTES } from "@/lib/constants";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { ScrollParallax } from "@/components/animations/scroll-parallax";
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal";
import { FloatingElement } from "@/components/animations/floating-element";
import { TextReveal } from "@/components/animations/text-reveal";
import { GlowCard } from "@/components/animations/glow-card";
import { CounterUp } from "@/components/animations/counter-up";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";

/* ═══════════════════════════════════════════════════
   LANDING PAGE — 7 SCROLL SECTIONS
   ═══════════════════════════════════════════════════ */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 0.8], [1, 0.9]);

  return (
    <div className="relative min-h-dvh bg-[var(--color-surface-0)] text-[var(--color-text-primary)] selection:bg-[var(--color-brand-500)] selection:text-black overflow-x-hidden">
      
      {/* ── FIXED NAV ── */}
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
              <MagneticButton className="bg-white text-black px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors hover:bg-[var(--color-brand-500)] shadow-[0_0_15px_oklch(0.95_0.01_270_/_0.3)]">
                Initialize
              </MagneticButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── FIXED BACKGROUND ── */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-[800px] w-[800px] rounded-full bg-[var(--color-brand-600)] opacity-10 blur-[150px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-[var(--color-accent-500)] opacity-10 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[var(--color-danger-500)] opacity-5 blur-[100px]" />
      </div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none z-40" />


      {/* ════════════════════════════════════════════
          SECTION 1: HERO
          ════════════════════════════════════════════ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden pt-20"
      >
        {/* 3D Wireframe Cube */}
        <div className="absolute z-0 flex items-center justify-center" style={{ perspective: "800px" }}>
          <div className="animate-wireframe-spin relative" style={{ width: "300px", height: "300px", transformStyle: "preserve-3d" }}>
            {/* Front face */}
            <div className="absolute inset-0 border border-[var(--color-brand-500)]/20 rounded-lg" style={{ transform: "translateZ(150px)" }} />
            {/* Back face */}
            <div className="absolute inset-0 border border-[var(--color-accent-400)]/20 rounded-lg" style={{ transform: "translateZ(-150px)" }} />
            {/* Left face */}
            <div className="absolute inset-0 border border-[var(--color-danger-400)]/15 rounded-lg" style={{ transform: "rotateY(-90deg) translateZ(150px)" }} />
            {/* Right face */}
            <div className="absolute inset-0 border border-[var(--color-accent-600)]/15 rounded-lg" style={{ transform: "rotateY(90deg) translateZ(150px)" }} />
            {/* Top face */}
            <div className="absolute inset-0 border border-[var(--color-brand-400)]/10 rounded-lg" style={{ transform: "rotateX(90deg) translateZ(150px)" }} />
            {/* Bottom face */}
            <div className="absolute inset-0 border border-[var(--color-brand-400)]/10 rounded-lg" style={{ transform: "rotateX(-90deg) translateZ(150px)" }} />
          </div>
        </div>

        {/* Orbiting dots */}
        <div className="absolute z-0">
          <div className="animate-orbit" style={{ "--orbit-radius": "200px", animationDuration: "15s" } as React.CSSProperties}>
            <div className="h-3 w-3 rounded-full bg-[var(--color-brand-500)] shadow-[0_0_12px_var(--color-brand-500)]" />
          </div>
        </div>
        <div className="absolute z-0">
          <div className="animate-orbit" style={{ "--orbit-radius": "260px", animationDuration: "22s", animationDelay: "-5s" } as React.CSSProperties}>
            <div className="h-2 w-2 rounded-full bg-[var(--color-accent-400)] shadow-[0_0_10px_var(--color-accent-400)]" />
          </div>
        </div>
        <div className="absolute z-0">
          <div className="animate-orbit" style={{ "--orbit-radius": "320px", animationDuration: "30s", animationDelay: "-12s" } as React.CSSProperties}>
            <div className="h-2 w-2 rounded-full bg-[var(--color-danger-400)] shadow-[0_0_10px_var(--color-danger-400)]" />
          </div>
        </div>

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl"
        >
          {/* Terminal badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-10 inline-flex items-center gap-3 border border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] px-5 py-2.5 rounded-full font-mono text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-brand-400)] shadow-lg"
          >
            <span className="h-2 w-2 rounded-full bg-[var(--color-brand-500)] animate-pulse" />
            AI-Powered Interview OS
          </motion.div>

          {/* Main headline */}
          <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.85]">
            <TextReveal text="Interviews" staggerDelay={0.05} mode="char" />
            <br />
            <TextReveal text="Are" staggerDelay={0.05} mode="char" className="text-[var(--color-text-secondary)]" />
            {" "}
            <span className="text-shimmer">
              <TextReveal text="Broken." staggerDelay={0.05} mode="char" />
            </span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 max-w-2xl font-mono text-sm sm:text-base font-bold uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed"
          >
            Practice with multi-agent AI. Real-time analytics. Interactive Canvas. We&apos;re fixing the system.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-14 flex flex-col sm:flex-row gap-6"
          >
            <Link href={ROUTES.REGISTER}>
              <MagneticButton
                className="bg-[var(--color-brand-600)] text-white px-10 py-5 rounded-xl text-lg font-bold uppercase tracking-widest shadow-[0_0_30px_oklch(0.75_0.22_140_/_0.4)] hover:bg-[var(--color-brand-500)] transition-colors glow-pulse"
                magneticStrength={0.3}
              >
                Start For Free
              </MagneticButton>
            </Link>
            <Link href="#features">
              <MagneticButton
                className="border border-[var(--color-border-strong)] text-[var(--color-text-secondary)] px-10 py-5 rounded-xl text-lg font-bold uppercase tracking-widest hover:text-white hover:border-white transition-colors"
                magneticStrength={0.2}
              >
                See How It Works
              </MagneticButton>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 z-10"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-tertiary)]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-5 h-8 rounded-full border border-[var(--color-border-default)] flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-[var(--color-brand-500)]" />
          </motion.div>
        </motion.div>
      </motion.section>


      {/* ════════════════════════════════════════════
          SECTION 2: FEATURES
          ════════════════════════════════════════════ */}
      <section id="features" className="relative z-20 py-40 border-t border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerReveal className="text-center mb-20">
            <StaggerItem>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand-400)] font-bold">&gt; SYSTEM_MODULES</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-4 text-6xl sm:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.9]">
                Built <span className="text-[var(--color-accent-400)]">Different</span>
              </h2>
            </StaggerItem>
          </StaggerReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Devil\u2019s Advocate",
                desc: "AI agents debate your questions before you hear them. Multi-agent challenge protocol pushes you beyond canned responses.",
                color: "var(--color-danger-500)",
                icon: "⚔️",
                stat: "3x",
                statLabel: "Harder Questions",
              },
              {
                title: "Real-Time Telemetry",
                desc: "Live WPM, hesitation detection, filler-word tracking, and confidence scoring — all analyzed in real-time as you speak.",
                color: "var(--color-brand-500)",
                icon: "📡",
                stat: "12+",
                statLabel: "Speech Metrics",
              },
              {
                title: "Interactive Canvas",
                desc: "Drag, drop, and architect distributed systems live. The AI evaluates your architecture decisions in real-time.",
                color: "var(--color-accent-400)",
                icon: "🎨",
                stat: "50+",
                statLabel: "System Components",
              },
            ].map((feat, i) => (
              <StaggerReveal key={feat.title} staggerDelay={0.15}>
                <StaggerItem>
                  <GlowCard className="p-8 h-full" glowColor={feat.color}>
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl"
                        style={{ background: `${feat.color}20` }}
                      >
                        {feat.icon}
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest font-bold" style={{ color: feat.color }}>
                        MODULE.0{i + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase font-[family-name:var(--font-display)] tracking-tight text-[var(--color-text-primary)]">
                      {feat.title}
                    </h3>
                    <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed">
                      {feat.desc}
                    </p>
                    <div className="mt-8 pt-6 border-t border-[var(--color-border-subtle)] flex items-baseline gap-3">
                      <span className="text-4xl font-black font-[family-name:var(--font-display)]" style={{ color: feat.color }}>
                        {feat.stat}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)] font-bold">
                        {feat.statLabel}
                      </span>
                    </div>
                  </GlowCard>
                </StaggerItem>
              </StaggerReveal>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECTION 3: HOW IT WORKS
          ════════════════════════════════════════════ */}
      <section className="relative z-20 py-40 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
        <div className="mx-auto max-w-6xl px-6">
          <StaggerReveal className="text-center mb-24">
            <StaggerItem>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent-400)] font-bold">&gt; PROCESS_FLOW</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-4 text-6xl sm:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.9]">
                3 Steps. <span className="text-[var(--color-brand-400)]">Zero BS.</span>
              </h2>
            </StaggerItem>
          </StaggerReveal>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-24 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-[var(--color-brand-500)] via-[var(--color-accent-400)] to-[var(--color-danger-500)] opacity-30" />

            {[
              { step: "01", title: "Upload", desc: "Drop your resume + target JD. Our AI extracts key competencies and builds a personalized question bank.", color: "var(--color-brand-500)", icon: "📄" },
              { step: "02", title: "Practice", desc: "Face a multi-agent AI interviewer. Real-time speech analytics track your performance as you respond.", color: "var(--color-accent-400)", icon: "🎙️" },
              { step: "03", title: "Dominate", desc: "Get a detailed score breakdown, improvement roadmap, and replay your session to identify weak points.", color: "var(--color-danger-500)", icon: "🏆" },
            ].map((item) => (
              <StaggerReveal key={item.step}>
                <StaggerItem className="text-center">
                  <div className="relative inline-flex">
                    <FloatingElement duration={5} delay={Number(item.step) * 0.5} amplitude={12}>
                      <div
                        className="flex h-20 w-20 items-center justify-center rounded-2xl text-4xl mx-auto border"
                        style={{ borderColor: `${item.color}40`, background: `${item.color}10` }}
                      >
                        {item.icon}
                      </div>
                    </FloatingElement>
                  </div>
                  <div className="mt-4 font-mono text-xs uppercase tracking-[0.3em] font-bold" style={{ color: item.color }}>
                    Step {item.step}
                  </div>
                  <h3 className="mt-3 text-3xl font-black uppercase font-[family-name:var(--font-display)] tracking-tight text-[var(--color-text-primary)]">
                    {item.title}
                  </h3>
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto">
                    {item.desc}
                  </p>
                </StaggerItem>
              </StaggerReveal>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECTION 4: PRODUCT MOCKUP
          ════════════════════════════════════════════ */}
      <section className="relative z-20 py-40 border-t border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <StaggerReveal>
              <StaggerItem>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand-400)] font-bold">&gt; LIVE_PREVIEW</span>
              </StaggerItem>
              <StaggerItem>
                <h2 className="mt-4 text-6xl sm:text-7xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.9]">
                  See It <br /><span className="text-[var(--color-accent-400)]">In Action</span>
                </h2>
              </StaggerItem>
              <StaggerItem>
                <p className="mt-8 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed max-w-md">
                  Our interview session feels like talking to a real interviewer. AI responds in real-time, tracks your speech patterns, and adapts its questions based on your answers.
                </p>
              </StaggerItem>
              <StaggerItem>
                <div className="mt-10 flex flex-wrap gap-4">
                  {["Voice Recognition", "Live Waveform", "Transcript", "Score HUD"].map((tag) => (
                    <span key={tag} className="px-4 py-2 rounded-full border border-[var(--color-border-default)] font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-bold bg-[var(--color-surface-1)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </StaggerItem>
            </StaggerReveal>

            {/* Product mockup card */}
            <ScrollParallax speed={0.15}>
              <TiltCard3D className="p-1 overflow-hidden" glareColor="var(--color-brand-400)">
                <div className="rounded-xl bg-[var(--color-surface-0)] border border-[var(--color-border-subtle)] overflow-hidden">
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-danger-500)]" />
                      <div className="w-3 h-3 rounded-full bg-[var(--color-accent-600)]" />
                      <div className="w-3 h-3 rounded-full bg-[var(--color-brand-500)]" />
                    </div>
                    <span className="ml-3 font-mono text-[10px] text-[var(--color-text-tertiary)] uppercase tracking-widest">interview_session.exe</span>
                  </div>
                  {/* Fake session content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--color-brand-500)] to-[var(--color-accent-400)] glow-pulse" />
                      <div>
                        <div className="font-mono text-xs font-bold text-[var(--color-brand-400)] uppercase tracking-widest">AI Interviewer</div>
                        <div className="mt-1 text-sm text-[var(--color-text-primary)]">How would you design a distributed rate limiter?</div>
                      </div>
                    </div>
                    {/* Waveform bars */}
                    <div className="flex items-end gap-0.5 h-8 px-2">
                      {Array.from({ length: 40 }, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full bg-[var(--color-brand-500)]"
                          style={{
                            height: `${Math.abs(Math.sin(i * 0.5)) * 100}%`,
                            opacity: 0.3 + Math.abs(Math.sin(i * 0.3)) * 0.7,
                          }}
                        />
                      ))}
                    </div>
                    {/* Metrics bar */}
                    <div className="flex gap-6 pt-3 border-t border-[var(--color-border-subtle)]">
                      <div className="text-center">
                        <div className="text-2xl font-black font-[family-name:var(--font-display)] text-[var(--color-brand-400)]">142</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-tertiary)]">WPM</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black font-[family-name:var(--font-display)] text-[var(--color-accent-400)]">87%</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-tertiary)]">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black font-[family-name:var(--font-display)] text-[var(--color-danger-400)]">2</div>
                        <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-text-tertiary)]">Fillers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard3D>
            </ScrollParallax>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECTION 5: STATS / SOCIAL PROOF
          ════════════════════════════════════════════ */}
      <section className="relative z-20 py-40 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)]">
        <div className="mx-auto max-w-6xl px-6">
          <StaggerReveal className="text-center mb-20">
            <StaggerItem>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-danger-400)] font-bold">&gt; TELEMETRY_DATA</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-4 text-6xl sm:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.9]">
                Numbers Don&apos;t <span className="text-[var(--color-brand-400)]">Lie</span>
              </h2>
            </StaggerItem>
          </StaggerReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { target: 10000, suffix: "+", label: "Interviews Conducted", color: "var(--color-brand-500)" },
              { target: 95, suffix: "%", label: "Improvement Rate", color: "var(--color-accent-400)" },
              { target: 49, prefix: "", suffix: "★", label: "Average Rating", color: "var(--color-accent-600)" },
              { target: 200, suffix: "+", label: "Companies Covered", color: "var(--color-danger-400)" },
            ].map((stat) => (
              <StaggerReveal key={stat.label}>
                <StaggerItem>
                  <GlowCard className="p-8 text-center" glowColor={stat.color}>
                    <div className="text-5xl sm:text-6xl font-black font-[family-name:var(--font-display)]" style={{ color: stat.color }}>
                      <CounterUp target={stat.target} prefix={stat.prefix} suffix={stat.suffix} duration={2.5} />
                    </div>
                    <div className="mt-4 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] font-bold">
                      {stat.label}
                    </div>
                  </GlowCard>
                </StaggerItem>
              </StaggerReveal>
            ))}
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECTION 6: PRICING PREVIEW
          ════════════════════════════════════════════ */}
      <section className="relative z-20 py-40 border-t border-[var(--color-border-subtle)]">
        <div className="mx-auto max-w-7xl px-6">
          <StaggerReveal className="text-center mb-20">
            <StaggerItem>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent-600)] font-bold">&gt; PRICING_MATRIX</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-4 text-6xl sm:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.9]">
                Simple. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-400)] to-[var(--color-accent-400)]">Transparent.</span>
              </h2>
            </StaggerItem>
          </StaggerReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Starter */}
            <StaggerReveal>
              <StaggerItem>
                <TiltCard3D className="p-10" glareColor="var(--color-surface-4)">
                  <h3 className="text-3xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">Starter</h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">For getting started</p>
                  <div className="mt-8">
                    <span className="text-6xl font-black font-[family-name:var(--font-display)]">Free</span>
                  </div>
                  <ul className="mt-10 space-y-4 font-mono text-sm font-bold text-[var(--color-text-secondary)]">
                    {["3 mock interviews / month", "Basic feedback & scoring", "Resume upload", "Behavioral track only"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="text-[var(--color-brand-500)]">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </TiltCard3D>
              </StaggerItem>
            </StaggerReveal>

            {/* Pro (Highlighted) */}
            <StaggerReveal>
              <StaggerItem>
                <TiltCard3D className="p-10 animate-gradient-border rounded-2xl bg-[var(--color-surface-1)] shadow-[0_0_40px_oklch(0.75_0.22_140_/_0.15)] relative overflow-hidden" glareColor="var(--color-brand-400)">
                  <div className="absolute top-0 right-0 bg-[var(--color-brand-500)] text-black px-6 py-2 text-xs font-black uppercase tracking-widest rounded-bl-xl">
                    Most Popular
                  </div>
                  <h3 className="text-3xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-brand-400)]">Pro</h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">For serious prep</p>
                  <div className="mt-8 flex items-baseline gap-2">
                    <span className="text-6xl font-black font-[family-name:var(--font-display)]">$19</span>
                    <span className="font-mono text-sm text-[var(--color-text-tertiary)] uppercase tracking-widest">/mo</span>
                  </div>
                  <Link href={ROUTES.REGISTER} className="block mt-8">
                    <MagneticButton className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors">
                      Upgrade to Pro
                    </MagneticButton>
                  </Link>
                  <ul className="mt-10 space-y-4 font-mono text-sm font-bold text-[var(--color-text-primary)]">
                    {["Unlimited mock interviews", "All interview types", "Real-time audio analytics", "Interactive Canvas", "JD-personalized questions"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="text-[var(--color-brand-500)]">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </TiltCard3D>
              </StaggerItem>
            </StaggerReveal>

            {/* Campus */}
            <StaggerReveal>
              <StaggerItem>
                <TiltCard3D className="p-10" glareColor="var(--color-accent-400)">
                  <h3 className="text-3xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">Campus</h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">For placement cells</p>
                  <div className="mt-8">
                    <span className="text-6xl font-black font-[family-name:var(--font-display)]">Custom</span>
                  </div>
                  <ul className="mt-10 space-y-4 font-mono text-sm font-bold text-[var(--color-text-secondary)]">
                    {["Everything in Pro", "Cohort analytics dashboard", "Faculty admin panel", "Bulk student onboarding"].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <span className="text-[var(--color-brand-500)]">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </TiltCard3D>
              </StaggerItem>
            </StaggerReveal>
          </div>

          <div className="mt-12 text-center">
            <Link href={ROUTES.PRICING} className="font-mono text-sm uppercase tracking-widest text-[var(--color-brand-400)] font-bold hover:text-[var(--color-brand-300)] transition-colors">
              View Full Pricing Details →
            </Link>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════════
          SECTION 7: FINAL CTA
          ════════════════════════════════════════════ */}
      <section className="relative z-30 py-40 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-0)] overflow-hidden">
        {/* Background orbs */}
        <ScrollParallax speed={0.3}>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[var(--color-brand-600)] opacity-15 blur-[120px]" />
        </ScrollParallax>

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <StaggerReveal>
            <StaggerItem>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand-400)] font-bold">&gt; FINAL_TRANSMISSION</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-6 text-7xl sm:text-9xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.85]">
                Got 3 <span className="text-shimmer">Seconds?</span>
              </h2>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-8 font-mono text-sm uppercase tracking-widest text-[var(--color-text-secondary)] max-w-xl mx-auto">
                That&apos;s all your resume has. Let&apos;s fix your interview skills this week.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-14 flex justify-center">
                <Link href={ROUTES.REGISTER}>
                  <MagneticButton
                    className="bg-white text-black px-14 py-7 rounded-2xl text-xl font-bold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-[var(--color-brand-500)] hover:text-white transition-colors"
                    magneticStrength={0.4}
                  >
                    Initialize Terminal
                  </MagneticButton>
                </Link>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-1)] py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-[var(--color-brand-500)] tracking-widest">SYS.V1</span>
            <span className="text-lg font-black font-[family-name:var(--font-display)] uppercase tracking-tighter text-[var(--color-text-primary)]">
              InterviewLab
            </span>
          </div>
          <div className="flex gap-8">
            <Link href={ROUTES.PRICING} className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">Pricing</Link>
            <Link href={ROUTES.ABOUT} className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">About</Link>
            <Link href={ROUTES.LOGIN} className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">Sign In</Link>
          </div>
          <span className="font-mono text-xs text-[var(--color-text-tertiary)]">© 2026 InterviewLab. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}
