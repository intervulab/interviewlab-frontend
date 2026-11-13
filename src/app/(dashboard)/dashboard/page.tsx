"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { ROUTES } from "@/lib/constants";

interface SessionSummary {
  id: string;
  status: string;
  createdAt: string;
  report?: {
    overallScore?: number;
  } | null;
}

function calculateStreakDays(dates: string[]): number {
  if (dates.length === 0) return 0;
  const uniqueDays = Array.from(
    new Set(
      dates.map((d) => {
        const dt = new Date(d);
        return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
      })
    )
  ).sort((a, b) => b - a);

  const oneDayMs = 24 * 60 * 60 * 1000;
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  // Streak is active if most recent session was today or yesterday
  if (todayStart - uniqueDays[0] > oneDayMs) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    if (uniqueDays[i - 1] - uniqueDays[i] === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export default function DashboardPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardMetrics() {
      try {
        const token = localStorage.getItem("interviewlab_token");
        const res = await fetch("/api/v1/sessions", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.data)
            ? json.data
            : Array.isArray(json?.data?.sessions)
              ? json.data.sessions
              : Array.isArray(json?.sessions)
                ? json.sessions
                : [];
        setSessions(list);
      } catch {
        // Keep fallback state on network error
      } finally {
        setLoading(false);
      }
    }

    loadDashboardMetrics();
  }, []);

  const metrics = useMemo(() => {
    const total = sessions.length;
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeekCount = sessions.filter(
      (s) => new Date(s.createdAt).getTime() >= oneWeekAgo
    ).length;

    const scores = sessions
      .map((s) => s.report?.overallScore)
      .filter((v): v is number => typeof v === "number");

    const avgScore =
      scores.length > 0
        ? Math.round(scores.reduce((sum, n) => sum + n, 0) / scores.length)
        : null;

    const streak = calculateStreakDays(sessions.map((s) => s.createdAt));
    const level = Math.max(1, Math.floor(total / 3) + 1);
    const tierLabel =
      level >= 5 ? "Architect" : level >= 3 ? "Intermediate" : "Initiate";

    return [
      {
        label: "Total Sessions",
        value: loading ? "..." : String(total),
        trend: `+${thisWeekCount} this week`,
        color: "var(--color-brand-400)",
        href: ROUTES.INTERVIEWS,
      },
      {
        label: "Avg. Score",
        value: loading ? "..." : avgScore !== null ? `${avgScore}/100` : "—",
        trend: avgScore !== null ? (avgScore >= 80 ? "Above Target" : "Calibrating") : "No reports yet",
        color: "var(--color-accent-600)",
        href: ROUTES.INTERVIEWS,
      },
      {
        label: "Practice Streak",
        value: loading ? "..." : `${streak} ${streak === 1 ? "Day" : "Days"}`,
        trend: streak > 0 ? "🔥 Active streak" : "Start today",
        color: "var(--color-danger-500)",
        href: ROUTES.PRACTICE,
      },
      {
        label: "Passport Level",
        value: loading ? "..." : `Lvl ${level}`,
        trend: tierLabel,
        color: "var(--color-accent-400)",
        href: ROUTES.PASSPORT,
      },
    ];
  }, [sessions, loading]);

  return (
    <div className="space-y-12 pb-10">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden rounded-3xl bg-[var(--color-surface-1)] p-10 lg:p-16 border border-[var(--color-border-subtle)] diagonal-cut-bottom">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-[var(--color-accent-400)]/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-[var(--color-brand-500)]/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex items-center gap-4 text-xs font-mono font-semibold tracking-widest text-[var(--color-text-tertiary)] uppercase">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-brand-500)] animate-pulse" />
            System Online • {sessions.length} Archived Sessions
          </div>

          <h1 className="font-[family-name:var(--font-display)] text-7xl lg:text-8xl font-black uppercase leading-none tracking-tighter text-[var(--color-text-primary)]">
            Every Frame <br />
            <span className="text-gradient">Earns Its Place.</span>
          </h1>

          <p className="text-lg text-[var(--color-text-secondary)] font-medium max-w-lg">
            Ready for your next practice session? Review your multi-dimensional skill telemetry or launch a new mock round.
          </p>

          <div className="pt-4 flex flex-wrap gap-4">
            <Link href={ROUTES.PRACTICE}>
              <MagneticButton
                className="bg-[var(--color-brand-600)] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[var(--color-brand-500)] transition-colors shadow-[0_0_30px_oklch(0.75_0.22_140_/_0.4)]"
                magneticStrength={0.3}
              >
                Launch Interview
              </MagneticButton>
            </Link>
            <Link href={ROUTES.PASSPORT}>
              <MagneticButton
                className="bg-[var(--color-surface-2)] text-[var(--color-text-primary)] px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[var(--color-surface-3)] transition-colors border border-[var(--color-border-default)]"
                magneticStrength={0.15}
              >
                View Passport
              </MagneticButton>
            </Link>
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
          {metrics.map((metric, i) => (
            <div
              key={i}
              onClick={() => router.push(metric.href)}
              className="cursor-pointer"
            >
              <TiltCard3D
                className="p-6 overflow-hidden relative group h-full"
                glareColor={metric.color}
              >
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
            </div>
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
          <div
            onClick={() => router.push(`${ROUTES.PRACTICE}?track=system_design`)}
            className="cursor-pointer"
          >
            <TiltCard3D
              className="p-8 border-[var(--color-accent-400)]/30 group h-full"
              glareColor="var(--color-accent-400)"
            >
              <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-400)] transition-colors">
                System Design
              </h3>
              <p className="mt-2 text-[var(--color-text-secondary)] max-w-sm">
                Architecture, scalability, and deep technical design rounds focused on distributed systems.
              </p>
              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold px-3 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)] uppercase">
                  Est: 45 Mins
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-accent-400)]">
                  Start Track →
                </span>
              </div>
            </TiltCard3D>
          </div>

          <div
            onClick={() => router.push(`${ROUTES.PRACTICE}?track=behavioral`)}
            className="cursor-pointer"
          >
            <TiltCard3D
              className="p-8 border-[var(--color-brand-500)]/30 group h-full"
              glareColor="var(--color-brand-500)"
            >
              <h3 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-400)] transition-colors">
                Behavioral
              </h3>
              <p className="mt-2 text-[var(--color-text-secondary)] max-w-sm">
                STAR method, soft skills, and conflict resolution scenarios with our AI hiring manager.
              </p>
              <div className="mt-8 flex items-center justify-between">
                <span className="font-mono text-xs font-semibold px-3 py-1 rounded bg-[var(--color-surface-2)] text-[var(--color-text-tertiary)] uppercase">
                  Est: 30 Mins
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)]">
                  Start Track →
                </span>
              </div>
            </TiltCard3D>
          </div>
        </div>
      </section>
    </div>
  );
}