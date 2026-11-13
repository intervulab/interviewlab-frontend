"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { createSession } from "@/features/backend/api";
import { ROUTES } from "@/lib/constants";
import { getStoredUser } from "@/lib/auth-storage";
import { ApiClientError } from "@/lib/api-client";

export default function PracticePage() {
  const router = useRouter();
  const user = getStoredUser();
  const [targetRole, setTargetRole] = useState(user?.profile?.targetRole || "Backend Engineer");
  const [title, setTitle] = useState("Mock technical interview");
  const [questionCount, setQuestionCount] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function startSession() {
    setError(null);
    setLoading(true);
    try {
      const session = await createSession({ title, targetRole, questionCount });
      if (!session?.id) {
        throw new Error("Server did not return a session. Try again.");
      }
      router.push(ROUTES.INTERVIEW_SESSION(session.id));
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : err instanceof Error && err.message
            ? err.message
            : "Could not start session";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      <div className="border-b border-[var(--color-border-subtle)] pb-8">
        <h1 className="text-5xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)]">
          Practice
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Starts a live session via Component 3 → AI agents → ML analytics.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-[var(--color-danger-500)]/40 bg-[var(--color-danger-500)]/10 px-4 py-3 text-sm text-[var(--color-danger-400)]">
          {error}
        </p>
      )}

      <TiltCard3D className="p-8 border-[var(--color-border-default)] space-y-4">
        <label className="block text-sm font-medium">Session title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
        />
        <label className="block text-sm font-medium">Target role</label>
        <input
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-4 py-3 text-sm"
        />
        <label className="block text-sm font-medium">Number of questions</label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="range"
            min={1}
            max={15}
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="min-w-[12rem] flex-1 accent-[var(--color-brand-500)]"
          />
          <input
            type="number"
            min={1}
            max={15}
            value={questionCount}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) {
                setQuestionCount(Math.min(15, Math.max(1, n)));
              }
            }}
            className="w-20 rounded-lg border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-3 py-2 text-sm text-center"
          />
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          The AI interviewer generates this many questions (1–15). Default is 3.
        </p>
      </TiltCard3D>

      {error && (
        <p className="text-right text-sm font-medium text-[var(--color-danger-400)]">{error}</p>
      )}
      <StartCta loading={loading} onStart={startSession} />
    </div>
  );
}

function StartCta({ loading, onStart }: { loading: boolean; onStart: () => void }) {
  return (
    <div className="flex justify-end">
      <MagneticButton
        onClick={onStart}
        disabled={loading}
        className="bg-[var(--color-brand-600)] text-white px-10 py-4 font-bold uppercase tracking-widest disabled:opacity-60 disabled:pointer-events-none"
        magneticStrength={0.2}
      >
        {loading ? "Starting…" : "Initialize Session"}
      </MagneticButton>
    </div>
  );
}
