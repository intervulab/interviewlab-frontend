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

  return (
    <div className="animate-fade-in-up space-y-8">
      <h1 className="text-3xl font-bold font-[family-name:var(--font-display)]">Performance Report</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Overall" value={`${report.overallScore.toFixed(1)}`} />
        <Stat label="Recommendation" value={report.recommendation} />
        <Stat label="Audio WPM" value={audio ? String(audio.averageWPM ?? "—") : "—"} />
      </div>

      <section className="rounded-xl border border-[var(--color-border-default)] p-6 space-y-3">
        <h2 className="font-semibold">Technical</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{report.technicalSummary}</p>
      </section>

      <section className="rounded-xl border border-[var(--color-border-default)] p-6 space-y-3">
        <h2 className="font-semibold">Communication / audio</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{report.behavioralSummary}</p>
      </section>

      <Link href={ROUTES.PRACTICE} className="inline-block text-[var(--color-brand-400)]">
        ← Practice again
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-4">
      <p className="text-xs uppercase tracking-widest text-[var(--color-text-tertiary)]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
