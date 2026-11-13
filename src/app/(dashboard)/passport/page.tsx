"use client";

import { useEffect, useMemo, useState } from "react";
import { PASSPORT_DIMENSIONS } from "@/lib/constants";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";

interface QuestionRecord {
  id: string;
  category?: string;
  answer?: {
    audioAnalysis?: {
      clarityScore?: number | null;
      speechPaceWpm?: number | null;
      fillerWordsCount?: number | null;
      hesitationCount?: number | null;
    } | null;
    evaluation?: {
      technicalScore?: number;
      clarityScore?: number;
    } | null;
  } | null;
}

interface SessionRecord {
  id: string;
  title?: string;
  targetRole?: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
  questions?: QuestionRecord[];
  report?: {
    overallScore?: number;
    recommendation?: string;
  } | null;
}

type DimensionName = (typeof PASSPORT_DIMENSIONS)[number];

function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  const sum = nums.reduce((acc, n) => acc + n, 0);
  return Math.round(sum / nums.length);
}

export default function PassportPage() {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPassportData() {
      try {
        setLoading(true);
        const token = localStorage.getItem("interviewlab_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const listRes = await fetch("/api/v1/sessions", {
          headers,
          credentials: "include",
        });

        if (!listRes.ok) {
          throw new Error(`Failed to fetch sessions (${listRes.status})`);
        }

        const listJson = await listRes.json();
        const baseList: SessionRecord[] = Array.isArray(listJson)
          ? listJson
          : Array.isArray(listJson?.data)
            ? listJson.data
            : Array.isArray(listJson?.data?.sessions)
              ? listJson.data.sessions
              : Array.isArray(listJson?.sessions)
                ? listJson.sessions
                : [];

        // Enrich with full session details so question categories, evaluations, and audio analyses are available
        const detailedSessions = await Promise.all(
          baseList.map(async (item) => {
            try {
              const detailRes = await fetch(`/api/v1/sessions/${item.id}`, {
                headers,
                credentials: "include",
              });
              if (!detailRes.ok) return item;
              const detailJson = await detailRes.json();
              return (
                detailJson?.data?.session ||
                detailJson?.data ||
                detailJson ||
                item
              );
            } catch {
              return item;
            }
          })
        );

        setSessions(detailedSessions);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Could not load passport metrics");
      } finally {
        setLoading(false);
      }
    }

    loadPassportData();
  }, []);

  const { dimensionScores, completedSessions, radarPoints } = useMemo(() => {
    const buckets: Record<DimensionName, number[]> = {
      "Technical Depth": [],
      "Communication Clarity": [],
      "Problem Solving": [],
      "System Design": [],
      "Behavioral / STAR": [],
      "Confidence & Pacing": [],
      "Code Quality": [],
      "Domain Knowledge": [],
    };

    const completed = sessions
      .filter((s) => s.status === "COMPLETED" || s.report?.overallScore !== undefined)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    for (const session of sessions) {
      if (typeof session.report?.overallScore === "number") {
        buckets["Domain Knowledge"].push(session.report.overallScore);
      }

      for (const q of session.questions ?? []) {
        const evalData = q.answer?.evaluation;
        const audioData = q.answer?.audioAnalysis;

        if (evalData) {
          if (typeof evalData.clarityScore === "number") {
            buckets["Communication Clarity"].push(evalData.clarityScore);
          }

          if (typeof evalData.technicalScore === "number") {
            const cat = (q.category || "").toUpperCase();
            if (cat === "SYSTEM_DESIGN") {
              buckets["System Design"].push(evalData.technicalScore);
            } else if (cat === "CODING_LOGIC") {
              buckets["Code Quality"].push(evalData.technicalScore);
              buckets["Problem Solving"].push(evalData.technicalScore);
            } else if (cat === "BEHAVIORAL") {
              buckets["Behavioral / STAR"].push(evalData.technicalScore);
            } else if (cat === "DEVI_ADVOCATE") {
              buckets["Problem Solving"].push(evalData.technicalScore);
              buckets["Technical Depth"].push(evalData.technicalScore);
            } else {
              // TECHNICAL_CONCEPT or general technical
              buckets["Technical Depth"].push(evalData.technicalScore);
            }
          }
        }

        if (audioData) {
          if (typeof audioData.clarityScore === "number") {
            buckets["Confidence & Pacing"].push(audioData.clarityScore);
          } else if (typeof audioData.speechPaceWpm === "number") {
            // Ideal WPM ~ 120-160
            const diff = Math.abs(140 - audioData.speechPaceWpm);
            const paceScore = Math.max(40, Math.min(100, Math.round(100 - diff * 0.6)));
            buckets["Confidence & Pacing"].push(paceScore);
          }
        }
      }
    }

    // Fallback: if a completed session has an overallScore in report but no granular question breakdown yet,
    // use overallScore as a baseline for Technical Depth & Domain Knowledge
    const overallScores = completed
      .map((s) => s.report?.overallScore)
      .filter((v): v is number => typeof v === "number");

    const scores: Record<DimensionName, number | null> = {
      "Technical Depth": average(buckets["Technical Depth"]) ?? average(overallScores),
      "Communication Clarity": average(buckets["Communication Clarity"]) ?? average(overallScores),
      "Problem Solving": average(buckets["Problem Solving"]),
      "System Design": average(buckets["System Design"]),
      "Behavioral / STAR": average(buckets["Behavioral / STAR"]),
      "Confidence & Pacing": average(buckets["Confidence & Pacing"]),
      "Code Quality": average(buckets["Code Quality"]),
      "Domain Knowledge": average(buckets["Domain Knowledge"]) ?? average(overallScores),
    };

    // Compute octagon SVG coordinates for the radar chart (center 160,160, max radius 110)
    const cx = 160;
    const cy = 160;
    const maxR = 110;
    const points = PASSPORT_DIMENSIONS.map((dim, i) => {
      const angle = (Math.PI * 2 * i) / PASSPORT_DIMENSIONS.length - Math.PI / 2;
      const val = scores[dim] ?? 0;
      const r = (val / 100) * maxR;
      return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
    }).join(" ");

    return {
      dimensionScores: scores,
      completedSessions: completed,
      radarPoints: points,
    };
  }, [sessions]);

  const radarUnlocked = completedSessions.length >= 3;

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border-subtle)] pb-8 gap-4">
        <div>
          <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
            STUDENT <span className="text-[var(--color-accent-400)]">PASSPORT</span>
          </h1>
          <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
            &gt; ACCESS_METRICS // SKILL_DIMENSIONS_TRACKING
          </p>
        </div>
        <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
          SESSIONS ANALYZED:{" "}
          <span className="text-[var(--color-accent-400)] font-bold">
            {completedSessions.length} / {sessions.length}
          </span>
        </div>
      </div>

      {error && (
        <div className="border border-[var(--color-danger-500)] bg-[var(--color-surface-1)] p-6 font-mono text-sm text-[var(--color-danger-500)]">
          ERROR: {error}
        </div>
      )}

      {/* ── SKILL DIMENSIONS GRID ── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PASSPORT_DIMENSIONS.map((dimension, idx) => {
          const score = dimensionScores[dimension];
          return (
            <TiltCard3D
              key={dimension}
              className="p-6 border-[var(--color-border-subtle)] group"
              glareColor="var(--color-accent-400)"
            >
              <div className="absolute top-2 right-2 text-6xl font-black font-[family-name:var(--font-display)] text-[var(--color-text-tertiary)] opacity-10 group-hover:scale-110 transition-transform">
                0{idx + 1}
              </div>
              <p className="font-mono text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
                {dimension}
              </p>
              <p
                className={`mt-4 text-5xl font-black font-[family-name:var(--font-display)] transition-colors ${score !== null
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-primary)]"
                  }`}
              >
                {loading ? "..." : score !== null ? `${score}%` : "—"}
              </p>
              <div className="mt-6 h-1 w-full rounded-none bg-[var(--color-surface-3)] overflow-hidden">
                <div
                  className="h-full bg-[var(--color-accent-400)] transition-all duration-700 shadow-[0_0_10px_oklch(0.70_0.25_260)]"
                  style={{ width: score !== null ? `${score}%` : "0%" }}
                />
              </div>
            </TiltCard3D>
          );
        })}
      </div>

      {/* ── RADAR CHART ── */}
      <TiltCard3D
        className="flex flex-col items-center justify-center py-16 px-6 text-center border-[var(--color-border-subtle)]"
        glareColor="var(--color-brand-500)"
      >
        {radarUnlocked ? (
          <div className="w-full max-w-2xl space-y-6">
            <div>
              <h2 className="text-4xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
                Multi-Dimensional Skill Radar
              </h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--color-brand-400)]">
                CALIBRATED // {completedSessions.length} COMPLETED SESSIONS
              </p>
            </div>
            <div className="flex justify-center">
              <svg viewBox="0 0 320 320" className="w-80 h-80 overflow-visible">
                {[0.25, 0.5, 0.75, 1].map((scale) => {
                  const ring = PASSPORT_DIMENSIONS.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / PASSPORT_DIMENSIONS.length - Math.PI / 2;
                    const r = 110 * scale;
                    return `${(160 + r * Math.cos(angle)).toFixed(1)},${(160 + r * Math.sin(angle)).toFixed(1)}`;
                  }).join(" ");
                  return (
                    <polygon
                      key={scale}
                      points={ring}
                      fill="none"
                      stroke="currentColor"
                      className="text-[var(--color-border-default)]"
                      strokeWidth="1"
                    />
                  );
                })}
                <polygon
                  points={radarPoints}
                  fill="oklch(0.70 0.25 260 / 0.25)"
                  stroke="var(--color-accent-400)"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>
        ) : (
          <>
            <div className="text-7xl mb-6 opacity-30 drop-shadow-lg">📊</div>
            <h2 className="text-5xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] tracking-tight">
              Radar Calibration
            </h2>
            <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] max-w-md">
              Requires 3 completed sessions to unlock multi-dimensional skill radar (
              {completedSessions.length}/3 completed).
            </p>
          </>
        )}
      </TiltCard3D>

      {/* ── PROGRESS TIMELINE ── */}
      <TiltCard3D
        className="p-10 border-[var(--color-border-subtle)]"
        glareColor="var(--color-brand-500)"
      >
        <h2 className="text-4xl font-black uppercase font-[family-name:var(--font-display)] tracking-tight text-[var(--color-text-primary)]">
          Chronological Progress
        </h2>

        {completedSessions.length > 0 ? (
          <div className="mt-8 space-y-4">
            {completedSessions.map((session, index) => {
              const score = session.report?.overallScore;
              return (
                <div
                  key={session.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[var(--color-border-default)] bg-[var(--color-surface-2)] p-5"
                >
                  <div className="space-y-1">
                    <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-brand-400)]">
                      SESSION 0{index + 1} // {new Date(session.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
                      {session.title || session.targetRole || "Mock Interview Session"}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {session.report?.recommendation && (
                      <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                        {session.report.recommendation}
                      </span>
                    )}
                    <div className="text-3xl font-black font-[family-name:var(--font-display)] text-[var(--color-accent-400)]">
                      {typeof score === "number" ? `${Math.round(score)}%` : "DONE"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-8 flex items-center justify-center py-16 border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)]">
              {loading ? "Loading Telemetry..." : "Awaiting Data Points..."}
            </span>
          </div>
        )}
      </TiltCard3D>
    </div>
  );
}