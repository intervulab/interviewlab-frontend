"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { StaggerReveal, StaggerItem } from "@/components/animations/stagger-reveal";
import { TextReveal } from "@/components/animations/text-reveal";
import { GlowCard } from "@/components/animations/glow-card";
import { ScrollParallax } from "@/components/animations/scroll-parallax";

const plans = {
  monthly: [
    { name: "Starter", price: "Free", period: "", tagline: "For getting started", features: ["3 mock interviews / month", "Basic feedback & scoring", "Resume upload", "Behavioral track only"], color: "var(--color-text-primary)", highlight: false },
    { name: "Pro", price: "$19", period: "/mo", tagline: "For serious prep", features: ["Unlimited mock interviews", "All interview types (System Design)", "Real-time audio analytics", "Interactive Canvas", "JD-personalized questions", "Priority AI model"], color: "var(--color-brand-400)", highlight: true },
    { name: "Campus", price: "Custom", period: "", tagline: "For placement cells", features: ["Everything in Pro", "Cohort analytics dashboard", "Faculty admin panel", "Bulk student onboarding", "Custom question banks", "Dedicated support"], color: "var(--color-accent-400)", highlight: false },
  ],
  annual: [
    { name: "Starter", price: "Free", period: "", tagline: "For getting started", features: ["3 mock interviews / month", "Basic feedback & scoring", "Resume upload", "Behavioral track only"], color: "var(--color-text-primary)", highlight: false },
    { name: "Pro", price: "$15", period: "/mo", tagline: "Billed annually ($180)", features: ["Unlimited mock interviews", "All interview types (System Design)", "Real-time audio analytics", "Interactive Canvas", "JD-personalized questions", "Priority AI model"], color: "var(--color-brand-400)", highlight: true },
    { name: "Campus", price: "Custom", period: "", tagline: "For placement cells", features: ["Everything in Pro", "Cohort analytics dashboard", "Faculty admin panel", "Bulk student onboarding", "Custom question banks", "Dedicated support"], color: "var(--color-accent-400)", highlight: false },
  ],
};

const faqs = [
  { q: "Can I cancel my subscription anytime?", a: "Yes. You can cancel your Pro subscription anytime from your dashboard. Your access continues until the end of the billing period." },
  { q: "What interview types are supported?", a: "We support Behavioral, Technical (DSA), System Design, and HR rounds. Each type uses specialized AI agents trained for that format." },
  { q: "Is my data secure?", a: "Absolutely. All audio and transcript data is encrypted at rest and in transit. We never share your interview data with third parties." },
  { q: "How does the Campus plan work?", a: "Campus plans are customized for universities and placement cells. Contact us for volume pricing, admin dashboards, and student onboarding tools." },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const currentPlans = plans[billing];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--color-surface-0)] pb-32">
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-[var(--color-brand-600)] opacity-20 blur-[150px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[var(--color-accent-500)] opacity-10 blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 right-0 left-0 z-50 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-sm font-mono font-bold text-[var(--color-brand-500)] tracking-widest">SYS.V1</span>
            <span className="text-2xl font-black font-[family-name:var(--font-display)] uppercase tracking-tighter text-[var(--color-text-primary)]">
              InterviewLab
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href={ROUTES.ABOUT} className="hidden sm:block text-sm font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">
              About
            </Link>
            <Link href={ROUTES.LOGIN} className="hidden sm:block text-sm font-mono font-bold uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <MagneticButton className="bg-[var(--color-brand-600)] text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors hover:bg-[var(--color-brand-500)] shadow-[0_0_15px_oklch(0.75_0.22_140_/_0.3)]">
                Initialize
              </MagneticButton>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <div className="mx-auto max-w-7xl px-6 pt-48 pb-12 text-center relative z-10">
        <StaggerReveal>
          <StaggerItem>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-brand-400)] font-bold">&gt; PRICING_MATRIX</span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="mt-4 text-7xl lg:text-9xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)] leading-[0.85]">
              <TextReveal text="Simple." mode="char" staggerDelay={0.04} />{" "}
              <span className="text-shimmer"><TextReveal text="Transparent." mode="char" staggerDelay={0.04} /></span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 font-mono text-sm uppercase tracking-[0.2em] font-bold text-[var(--color-text-secondary)]">
              &gt; START_FREE // UPGRADE_WHEN_READY
            </p>
          </StaggerItem>
        </StaggerReveal>

        {/* ── Billing Toggle ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 inline-flex items-center gap-4 bg-[var(--color-surface-1)] border border-[var(--color-border-subtle)] rounded-full p-1.5"
        >
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all ${
              billing === "monthly"
                ? "bg-[var(--color-brand-600)] text-white shadow-lg"
                : "text-[var(--color-text-secondary)] hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("annual")}
            className={`px-6 py-2.5 rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all ${
              billing === "annual"
                ? "bg-[var(--color-brand-600)] text-white shadow-lg"
                : "text-[var(--color-text-secondary)] hover:text-white"
            }`}
          >
            Annual
            <span className="ml-2 text-[var(--color-brand-400)]">-21%</span>
          </button>
        </motion.div>
      </div>

      {/* ── Pricing Grid ── */}
      <div className="mx-auto mt-8 grid max-w-7xl gap-8 px-6 lg:grid-cols-3 relative z-10">
        <AnimatePresence mode="wait">
          {currentPlans.map((plan, i) => (
            <motion.div
              key={`${plan.name}-${billing}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <TiltCard3D
                className={`p-10 h-full ${
                  plan.highlight
                    ? "animate-gradient-border rounded-2xl bg-[var(--color-surface-1)] shadow-[0_0_40px_oklch(0.75_0.22_140_/_0.15)] relative overflow-hidden"
                    : "border-[var(--color-border-subtle)]"
                }`}
                glareColor={plan.color}
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-[var(--color-brand-500)] text-black px-6 py-2 text-xs font-black uppercase tracking-widest rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <h3 className="text-3xl font-black uppercase font-[family-name:var(--font-display)]" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
                <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">{plan.tagline}</p>
                <div className="mt-8 flex items-baseline gap-2">
                  <span className="text-6xl font-black font-[family-name:var(--font-display)]">{plan.price}</span>
                  {plan.period && (
                    <span className="font-mono text-sm text-[var(--color-text-tertiary)] uppercase tracking-widest">{plan.period}</span>
                  )}
                </div>
                {plan.highlight && (
                  <Link href={ROUTES.REGISTER} className="block mt-8">
                    <MagneticButton className="w-full bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-6 py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors glow-pulse">
                      Upgrade to Pro
                    </MagneticButton>
                  </Link>
                )}
                <ul className="mt-10 space-y-4 font-mono text-sm font-bold text-[var(--color-text-secondary)]">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="text-[var(--color-brand-500)]">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </TiltCard3D>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── FAQ Section ── */}
      <section className="mx-auto max-w-4xl px-6 mt-40 relative z-10">
        <ScrollParallax speed={0.05}>
          <StaggerReveal className="text-center mb-16">
            <StaggerItem>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-[var(--color-accent-400)] font-bold">&gt; FAQ_MODULE</span>
            </StaggerItem>
            <StaggerItem>
              <h2 className="mt-4 text-5xl sm:text-7xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] leading-[0.9]">
                Questions?
              </h2>
            </StaggerItem>
          </StaggerReveal>
        </ScrollParallax>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <GlowCard key={i} className="overflow-hidden" glowColor="var(--color-brand-500)" intensity={0.08}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-mono text-sm font-bold uppercase tracking-widest text-[var(--color-text-primary)]">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl text-[var(--color-brand-400)] flex-shrink-0 ml-4"
                >
                  +
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)] leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlowCard>
          ))}
        </div>
      </section>
    </div>
  );
}
