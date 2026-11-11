"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getReport, generateReport } from "@/features/backend/api";
import type { SessionReportDto } from "@/features/backend/types";
import { ROUTES } from "@/lib/constants";
import { ApiClientError } from "@/lib/api-client";

export default function InterviewReportPage() {
  const params = useParams();
  const sessionId = params.id as string;
  const [report, setReport] = useState<SessionReportDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        try {
          const data = await getReport(sessionId);
          setReport(data);
        } catch {
          const data = await generateReport(sessionId);
          setReport(data);
        }
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Report unavailable");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  if (loading) {
    return <p className="text-sm text-[var(--color-text-secondary)]">Generating report…</p>;
  }

  if (error || !report) {
    return (
      <div className="space-y-4">
        <p className="text-[var(--color-danger-400)]">{error ?? "No report"}</p>
        <Link href={ROUTES.PRACTICE} className="text-[var(--color-brand-400)]">
          Start another session
        </Link>
      </div>
    );
  }

  const audio = (report.detailedFeedback?.audioMetrics ?? null) as Record<string, unknown> | null;
  const wpm = num(audio?.averageWPM);
  const fillers = num(audio?.fillerWordCount);
  const clarity = num(audio?.clarityScore);
  const confidence = num(audio?.confidenceScore);
  const hesitation = num(audio?.hesitationCount);
  const fillerPct = num(audio?.fillerWordPercentage);

  const answerTranscripts = (report.detailedFeedback?.answerTranscripts ?? []) as Array<{
    orderIndex?: number;
    questionPreview?: string;
    transcriptText?: string | null;
    voiceRecordedSeconds?: number | null;
    transcriptionPending?: boolean;
  }>;

  return (
    <div className="animate-fade-in-up space-y-10 pb-12">
      <div className="border-b border-[var(--color-border-subtle)] pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tight font-[family-name:var(--font-display)]">
          Performance Report
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Interview outcome plus live speech analytics from your session audio.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Stat label="Overall score" value={`${Number(report.overallScore ?? 0).toFixed(1)}`} large />
        <Stat label="Recommendation" value={report.recommendation.replace(/_/g, " ")} large />
      </div>

      <section className="rounded-2xl border-2 border-[var(--color-brand-500)]/40 bg-[var(--color-brand-500)]/5 p-8 shadow-[0_0_40px_-12px_var(--color-brand-500)] space-y-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-brand-400)]">
            Speech analytics
          </p>
          <h2 className="mt-1 text-2xl font-bold font-[family-name:var(--font-display)]">
            Communication &amp; audio
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-2xl">
            Pace, fillers, and clarity measured from your recorded answers (Component 5).
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SpeechStat
            label="Words per minute"
            value={wpm != null ? wpm.toFixed(1) : "—"}
            hint="Ideal range ~110–160"
            prominent
          />
          <SpeechStat
            label="Filler words"
            value={fillers != null ? String(fillers) : "—"}
            hint={fillerPct != null ? `${fillerPct.toFixed(1)}% of words` : "Say um/like to detect"}
          />
          <SpeechStat
            label="Clarity"
            value={clarity != null ? `${clarity.toFixed(0)}/100` : "—"}
            hint="Acoustic stability"
          />
          <SpeechStat
            label="Confidence"
            value={confidence != null ? `${confidence.toFixed(0)}/100` : "—"}
            hint="Delivery presence"
          />
          <SpeechStat
            label="Hesitations"
            value={hesitation != null ? String(hesitation) : "—"}
            hint="MFCC spike events"
          />
        </div>

        {report.behavioralSummary && (
          <p className="text-sm text-[var(--color-text-tertiary)] border-t border-[var(--color-border-subtle)] pt-4">
            {report.behavioralSummary}
          </p>
        )}

        {answerTranscripts.length > 0 && (
          <div className="border-t border-[var(--color-border-subtle)] pt-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-brand-400)]">
              Your spoken / typed answers
            </h3>
            {answerTranscripts.map((row, i) => (
              <blockquote
                key={`${row.orderIndex ?? i}-${i}`}
                className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-4 text-sm leading-relaxed text-[var(--color-text-primary)]"
              >
                {row.questionPreview && (
                  <p className="mb-2 text-xs text-[var(--color-text-tertiary)]">
                    Q{row.orderIndex ?? i + 1}: {row.questionPreview}
                    {row.questionPreview.length >= 120 ? "…" : ""}
                  </p>
                )}
                {row.transcriptText ? (
                  <p className="whitespace-pre-wrap">{row.transcriptText}</p>
                ) : (
                  <p className="text-[var(--color-text-tertiary)] italic">
                    {row.transcriptionPending
                      ? `Voice answer recorded${
                          row.voiceRecordedSeconds != null ? ` (${row.voiceRecordedSeconds}s)` : ""
                        }. Transcript was not captured — start a new practice session and submit again to populate this section.`
                      : "No transcript stored for this question."}
                  </p>
                )}
              </blockquote>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-6 space-y-3">
        <h2 className="text-lg font-semibold">Technical</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{report.technicalSummary}</p>
      </section>

      <Link href={ROUTES.PRACTICE} className="inline-block text-[var(--color-brand-400)]">
        ← Practice again
      </Link>
    </div>
  );
}

function num(v: unknown): number | null {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
  return null;
}

function Stat({
  label,
  value,
  large,
}: {
  label: string;
  value: string;
  large?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-5">
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">{label}</p>
      <p className={`mt-2 font-bold ${large ? "text-3xl" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function SpeechStat({
  label,
  value,
  hint,
  prominent,
}: {
  label: string;
  value: string;
  hint?: string;
  prominent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border bg-[var(--color-surface-0)] p-5 ${
        prominent
          ? "border-[var(--color-brand-400)]/60 ring-1 ring-[var(--color-brand-500)]/20"
          : "border-[var(--color-border-default)]"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-tertiary)]">
        {label}
      </p>
      <p
        className={`mt-2 font-black tabular-nums tracking-tight text-[var(--color-text-primary)] ${
          prominent ? "text-4xl" : "text-3xl"
        }`}
      >
        {value}
      </p>
      {hint && <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">{hint}</p>}
    </div>
  );
}
