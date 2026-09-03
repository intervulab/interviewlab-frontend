import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

/**
 * Main Dashboard — The authenticated home screen.
 * Shows interview stats, recent sessions, skill radar, and quick-start actions.
 */
export default function DashboardPage() {
  return (
    <div className="animate-fade-in-up space-y-8">
      {/* ── Welcome Header ── */}
      <div>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">
          Welcome back 👋
        </h1>
        <p className="mt-1 text-[var(--color-text-secondary)]">
          Ready for your next practice session? Here&apos;s your progress.
        </p>
      </div>

      {/* ── Quick Stats Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Sessions", value: "—", icon: "📋" },
          { label: "Avg. Score", value: "—", icon: "⭐" },
          { label: "Practice Streak", value: "—", icon: "🔥" },
          { label: "Passport Level", value: "—", icon: "🪪" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-5 transition-all hover:shadow-[var(--shadow-md)]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--color-text-secondary)]">
                {stat.label}
              </span>
              <span className="text-xl">{stat.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Start ── */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold font-[family-name:var(--font-display)]">
          Start a New Interview
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Choose an interview type to begin your practice session.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { type: "Technical", emoji: "💻", desc: "DSA, coding, problem solving" },
            { type: "Behavioral", emoji: "🗣️", desc: "STAR method, soft skills" },
            { type: "System Design", emoji: "🏗️", desc: "Architecture, scalability" },
            { type: "Mixed", emoji: "🎯", desc: "Full mock interview" },
          ].map((item) => (
            <button
              key={item.type}
              className="group rounded-lg border border-[var(--color-border-default)] p-4 text-left transition-all hover:border-[var(--color-brand-500)] hover:shadow-[var(--shadow-glow)]"
            >
              <span className="text-2xl">{item.emoji}</span>
              <h3 className="mt-2 font-semibold group-hover:text-[var(--color-brand-400)]">
                {item.type}
              </h3>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">
                {item.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Recent Interviews Placeholder ── */}
      <div className="glass rounded-xl p-6">
        <h2 className="text-xl font-semibold font-[family-name:var(--font-display)]">
          Recent Interviews
        </h2>
        <div className="mt-6 flex items-center justify-center py-12 text-[var(--color-text-tertiary)]">
          <p>No interviews yet. Start your first session above!</p>
        </div>
      </div>
    </div>
  );
}
