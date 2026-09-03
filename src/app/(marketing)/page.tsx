import Link from "next/link";
import { ROUTES } from "@/lib/constants";

/**
 * Landing Page — The first thing every visitor sees.
 * Premium, animated, conversion-focused.
 */
export default function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      {/* ── Background Gradient Orbs ── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[var(--color-brand-600)] opacity-20 blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[var(--color-accent-500)] opacity-15 blur-[128px]" />
      </div>

      {/* ── Navigation ── */}
      <nav className="glass fixed top-0 right-0 left-0 z-50 border-b border-[var(--glass-border)]">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand-600)]">
              <span className="text-sm font-bold text-white">IL</span>
            </div>
            <span className="text-lg font-semibold font-[family-name:var(--font-display)]">
              InterviewLab
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.PRICING}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Pricing
            </Link>
            <Link
              href={ROUTES.ABOUT}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              About
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="rounded-lg bg-[var(--color-brand-600)] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[var(--color-brand-500)] hover:shadow-[var(--shadow-glow)]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-center px-6 pt-40 pb-20 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-1.5">
          <span className="h-2 w-2 rounded-full bg-[var(--color-accent-500)] animate-pulse" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            AI-Powered Interview Preparation
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up text-5xl leading-tight font-bold tracking-tight sm:text-7xl font-[family-name:var(--font-display)]"
            style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
          Interviews are{" "}
          <span className="text-gradient">broken.</span>
          <br />
          We&apos;re fixing them.
        </h1>

        {/* Subheadline */}
        <p className="animate-fade-in-up mt-6 max-w-2xl text-lg text-[var(--color-text-secondary)] sm:text-xl"
           style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
          Practice with AI agents that{" "}
          <strong className="text-[var(--color-text-primary)]">debate each other</strong>{" "}
          to craft the hardest questions. Get real-time speech analytics.
          Design systems on an interactive canvas. All in one platform.
        </p>

        {/* CTA Buttons */}
        <div className="animate-fade-in-up mt-10 flex flex-col gap-4 sm:flex-row"
             style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
          <Link
            href={ROUTES.REGISTER}
            className="rounded-xl bg-[var(--color-brand-600)] px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[var(--color-brand-500)] hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5"
          >
            Start Practicing for Free
          </Link>
          <Link
            href={ROUTES.ABOUT}
            className="rounded-xl border border-[var(--color-border-default)] px-8 py-4 text-base font-semibold text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-surface-2)] hover:-translate-y-0.5"
          >
            See How It Works
          </Link>
        </div>

        {/* ── Feature Grid ── */}
        <div className="animate-fade-in-up mt-24 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3"
             style={{ animationDelay: "500ms", animationFillMode: "backwards" }}>
          {[
            {
              icon: "🧠",
              title: "Multi-Agent AI Debate",
              desc: "Our Devil's Advocate agent cross-examines questions before you hear them, ensuring maximum rigor.",
            },
            {
              icon: "🎤",
              title: "Real-Time Speech Analytics",
              desc: "Live WPM, filler word detection, hesitation tracking, and confidence scoring as you speak.",
            },
            {
              icon: "🎨",
              title: "System Design Canvas",
              desc: "Interactive whiteboard with drag-and-drop components. AI highlights design flaws in real-time.",
            },
            {
              icon: "🧊",
              title: "Freeze Recovery Mode",
              desc: "Blanked out? We detect silence and guide you back with breathing cues and restart prompts.",
            },
            {
              icon: "🪪",
              title: "Student Passport",
              desc: "Track your growth across sessions with radar charts, trend analysis, and skill dimensions.",
            },
            {
              icon: "🎯",
              title: "JD-Personalized Prep",
              desc: "Paste a job description and resume — get a tailored interview plan with role-specific questions.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass group rounded-2xl p-6 text-left transition-all hover:border-[var(--color-brand-500)]/30 hover:shadow-[var(--shadow-md)]"
            >
              <span className="text-3xl">{feature.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-[var(--color-text-primary)] font-[family-name:var(--font-display)]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--color-border-subtle)] py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-[var(--color-text-tertiary)]">
          © {new Date().getFullYear()} InterviewLab. Built by students, for students.
        </div>
      </footer>
    </div>
  );
}
