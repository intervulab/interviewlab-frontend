"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";

interface InterviewSession {
  id: string;
  title?: string;
  targetRole?: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
  report?: {
    overallScore?: number;
    recommendation?: string;
  } | null;
}

const FILTERS = ["All Records", "Technical", "Behavioral", "System Design", "HR"];

export default function InterviewsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [activeFilter, setActiveFilter] = useState("All Records");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        setLoading(true);
        const token = localStorage.getItem("interviewlab_token");

        const res = await fetch("/api/v1/sessions", {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch sessions (${res.status})`);
        }

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
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Could not load sessions");
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (activeFilter === "All Records") return true;
    const text = `${s.title ?? ""} ${s.targetRole ?? ""}`.toLowerCase();
    return text.includes(activeFilter.toLowerCase());
  });

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--color-border-subtle)] pb-8 gap-6">
        <div>
          <h1 className="text-7xl lg:text-8xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
            SESSION <span className="text-[var(--color-brand-400)]">HISTORY</span>
          </h1>
          <p className="mt-2 text-lg text-[var(--color-text-secondary)] font-mono uppercase tracking-widest font-bold">
            &gt; QUERY_DATABASE // REVIEW_ARCHIVES ({sessions.length})
          </p>
        </div>
        <div onClick={() => router.push("/practice")}>
          <MagneticButton
            className="bg-[var(--color-brand-600)] hover:bg-[var(--color-brand-500)] text-white px-8 py-4 text-sm font-bold uppercase tracking-widest diagonal-cut transition-colors shadow-[0_0_20px_oklch(0.75_0.22_140_/_0.2)] whitespace-nowrap"
            magneticStrength={0.15}
          >
            + New Session
          </MagneticButton>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-none border px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest transition-colors ${activeFilter === filter
              ? "border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 text-[var(--color-brand-400)] shadow-[inset_0_0_10px_oklch(0.75_0.22_140_/_0.2)]"
              : "border-[var(--color-border-default)] bg-[var(--color-surface-1)] text-[var(--color-text-tertiary)] hover:border-[var(--color-brand-400)] hover:text-[var(--color-text-primary)]"
              }`}
          >
            [{filter}]
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      {loading ? (
        <div className="p-16 text-center font-mono text-sm uppercase tracking-widest text-[var(--color-text-secondary)]">
          Querying session archives...
        </div>
      ) : error ? (
        <div className="border border-[var(--color-danger-500)] bg-[var(--color-surface-1)] p-8 font-mono text-sm text-[var(--color-danger-500)]">
          ERROR: {error}
        </div>
      ) : filteredSessions.length === 0 ? (
        <TiltCard3D
          className="flex flex-col items-center justify-center p-24 text-center border-[var(--color-border-subtle)]"
          glareColor="var(--color-danger-500)"
        >
          <div className="text-7xl opacity-50 mb-6 drop-shadow-2xl">⚠️</div>
          <h2 className="text-5xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-secondary)] tracking-tight">
            NO RECORDS FOUND
          </h2>
          <p className="mt-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] max-w-md">
            The database is empty. Initialize your first mock interview to populate the archives.
          </p>
        </TiltCard3D>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSessions.map((session) => (
            <TiltCard3D
              key={session.id}
              className="p-6 border border-[var(--color-border-default)] bg-[var(--color-surface-1)] flex flex-col justify-between gap-6"
              glareColor="var(--color-brand-500)"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 font-mono text-xs uppercase tracking-widest">
                  <span className="text-[var(--color-brand-400)] font-bold">
                    [{session.status}]
                  </span>
                  <span className="text-[var(--color-text-tertiary)]">
                    {new Date(session.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
                  {session.title || session.targetRole || "Mock Interview Session"}
                </h3>
                {session.targetRole && session.title && (
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                    Role: {session.targetRole}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-4">
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-secondary)]">
                  {session.report?.overallScore !== undefined ? (
                    <span>
                      Score:{" "}
                      <strong className="text-[var(--color-brand-400)]">
                        {session.report.overallScore}%
                      </strong>
                    </span>
                  ) : (
                    <span>ID: {session.id.slice(0, 8)}</span>
                  )}
                </div>
                <button
                  onClick={() => router.push(`/interviews/${session.id}`)}
                  className="border border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)] hover:bg-[var(--color-brand-500)] hover:text-white transition-colors"
                >
                  View Report →
                </button>
              </div>
            </TiltCard3D>
          ))}
        </div>
      )}
    </div>
  );
}