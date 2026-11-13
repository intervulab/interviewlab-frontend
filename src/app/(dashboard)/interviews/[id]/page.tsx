"use client";

import { useEffect, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TiltCard3D } from "@/components/shared/tilt-card-3d";

interface QuestionItem {
  id: string;
  questionText: string;
  category?: string;
  difficulty?: string;
  orderIndex?: number;
  answer?: {
    transcriptText?: string;
    durationSeconds?: number;
    evaluation?: {
      technicalScore?: number;
      clarityScore?: number;
      feedbackText?: string;
      strengths?: string[];
      improvements?: string[];
    };
  } | null;
}

interface SessionDetail {
  id: string;
  title?: string;
  targetRole?: string;
  status: string;
  createdAt: string;
  completedAt?: string | null;
  questions?: QuestionItem[];
  report?: {
    overallScore?: number;
    technicalSummary?: string;
    behavioralSummary?: string;
    recommendation?: string;
    detailedFeedback?: unknown;
  } | null;
}

export default function InterviewDetailPage() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const rawParam = params ? Object.values(params)[0] : undefined;
  const paramId = Array.isArray(rawParam) ? rawParam[0] : (rawParam as string | undefined);
  const pathSegments = pathname?.split("/").filter(Boolean) || [];
  const pathId = pathSegments[pathSegments.length - 1];
  const sessionId = paramId || (pathId && pathId !== "interviews" ? pathId : undefined);

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [report, setReport] = useState<SessionDetail["report"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    async function loadDetail() {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("interviewlab_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [sessionRes, reportRes] = await Promise.all([
          fetch(`/api/v1/sessions/${sessionId}`, { headers }),
          fetch(`/api/v1/sessions/${sessionId}/report`, { headers }),
        ]);

        if (!sessionRes.ok) {
          throw new Error(`Failed to load session (${sessionRes.status})`);
        }

        const sessionJson = await sessionRes.json();
        const sessionData = sessionJson?.data?.session || sessionJson?.data || sessionJson;
        setSession(sessionData);

        if (reportRes.ok) {
          const reportJson = await reportRes.json();
          const reportData = reportJson?.data?.report || reportJson?.data || reportJson;
          setReport(reportData);
        } else if (sessionData?.report) {
          setReport(sessionData.report);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Could not load session details");
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="p-16 text-center font-mono text-sm uppercase tracking-widest text-[var(--color-text-secondary)]">
        Loading session telemetry &amp; report...
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => router.push("/interviews")}
          className="font-mono text-xs uppercase tracking-widest text-[var(--color-brand-400)] hover:underline"
        >
          ← Back to Session History
        </button>
        <div className="border border-[var(--color-danger-500)] bg-[var(--color-surface-1)] p-8 font-mono text-sm text-[var(--color-danger-500)]">
          ERROR: {error || "Session not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up space-y-10 pb-12">
      {/* ── TOP NAV & HEADER ── */}
      <div className="space-y-4 border-b border-[var(--color-border-subtle)] pb-8">
        <button
          onClick={() => router.push("/interviews")}
          className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)] hover:underline"
        >
          ← Back to Session History
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
              {session.title || session.targetRole || "Interview Session Report"}
            </h1>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
              ID: {session.id} // STATUS:{" "}
              <span className="text-[var(--color-brand-400)] font-bold">{session.status}</span> //{" "}
              {new Date(session.createdAt).toLocaleString()}
            </p>
          </div>

          {report?.overallScore !== undefined && (
            <div className="border border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 px-6 py-4 text-right">
              <div className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                Overall Score
              </div>
              <div className="text-4xl font-black font-[family-name:var(--font-display)] text-[var(--color-brand-400)]">
                {report.overallScore}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── EXECUTIVE REPORT SUMMARY ── */}
      {report && (
        <TiltCard3D
          className="p-8 border border-[var(--color-border-default)] bg-[var(--color-surface-1)] space-y-6"
          glareColor="var(--color-brand-500)"
        >
          <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-4">
            <h2 className="text-2xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
              Evaluation Summary
            </h2>
            {report.recommendation && (
              <span className="border border-[var(--color-brand-500)] bg-[var(--color-brand-500)]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)]">
                {report.recommendation}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.technicalSummary && (
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)]">
                  Technical Assessment
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {report.technicalSummary}
                </p>
              </div>
            )}
            {report.behavioralSummary && (
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[var(--color-brand-400)]">
                  Behavioral &amp; Communication
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {report.behavioralSummary}
                </p>
              </div>
            )}
          </div>
        </TiltCard3D>
      )}

      {/* ── QUESTIONS & TRANSCRIPTS ── */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)]">
          Question &amp; Answer Breakdown ({session.questions?.length ?? 0})
        </h2>

        {session.questions && session.questions.length > 0 ? (
          session.questions.map((q, idx) => (
            <div
              key={q.id}
              className="border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 space-y-4"
            >
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">
                <span>
                  Q{idx + 1} // {q.category || "GENERAL"} {q.difficulty ? `(${q.difficulty})` : ""}
                </span>
                {q.answer?.evaluation?.technicalScore !== undefined && (
                  <span className="text-[var(--color-brand-400)] font-bold">
                    Score: {q.answer.evaluation.technicalScore}%
                  </span>
                )}
              </div>

              <p className="text-lg font-bold text-[var(--color-text-primary)]">{q.questionText}</p>

              <div className="border-l-2 border-[var(--color-brand-500)] pl-4 space-y-1">
                <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-tertiary)]">
                  Candidate Transcript
                </div>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {q.answer?.transcriptText || "No transcript recorded for this question."}
                </p>
              </div>

              {q.answer?.evaluation?.feedbackText && (
                <div className="bg-black/30 p-4 border border-[var(--color-border-subtle)] space-y-1">
                  <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-brand-400)]">
                    AI Reviewer Feedback
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {q.answer.evaluation.feedbackText}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="border border-[var(--color-border-subtle)] p-8 text-center font-mono text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">
            No question records attached to this session.
          </div>
        )}
      </div>
    </div>
  );
}