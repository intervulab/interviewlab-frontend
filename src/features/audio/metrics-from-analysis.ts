import type { RealTimeMetrics } from "@/types/api.types";

export type SessionMetricsState = {
  wpm: number;
  fillerPct: number;
  hesitation: number;
  confidence: number;
  answerDurationSecs: number;
};

/** Prefer ML audio_metrics (per answer); fall back to live WebSocket snapshot. */
export function metricsFromAnalysis(
  rt?: RealTimeMetrics | null,
  raw?: Record<string, unknown> | null,
): SessionMetricsState {
  const m = raw ?? {};
  const wpm =
    (typeof m.averageWPM === "number" ? m.averageWPM : undefined) ??
    (typeof m.speechPaceWpm === "number" ? m.speechPaceWpm : undefined) ??
    rt?.currentWPM ??
    0;
  const fillerPct =
    typeof m.fillerWordPercentage === "number" ? m.fillerWordPercentage : 0;
  const hesitation =
    (typeof m.hesitationCount === "number" ? m.hesitationCount : undefined) ??
    rt?.hesitationSpikes ??
    0;
  const confidence =
    (typeof m.confidenceScore === "number" ? m.confidenceScore : undefined) ??
    (typeof m.clarityScore === "number" ? m.clarityScore : undefined) ??
    (rt?.volumeLevel != null ? Math.round(rt.volumeLevel * 100) : 0);

  const answerDurationSecs =
    typeof m.durationSeconds === "number" && m.durationSeconds > 0
      ? m.durationSeconds
      : 0;

  return { wpm, fillerPct, hesitation, confidence, answerDurationSecs };
}

export function latestAnswerMetrics(
  questions: {
    orderIndex?: number;
    answer?: {
      durationSeconds?: number | null;
      audioAnalysis?: { rawMetricsJson?: Record<string, unknown> } | null;
    } | null;
  }[],
): Record<string, unknown> | null {
  const answered = [...questions]
    .filter((q) => q.answer?.audioAnalysis?.rawMetricsJson)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const last = answered[answered.length - 1];
  const raw = last?.answer?.audioAnalysis?.rawMetricsJson;
  if (!raw) return null;
  const duration =
    (typeof raw.durationSeconds === "number" && raw.durationSeconds > 0
      ? raw.durationSeconds
      : null) ??
    (typeof last.answer?.durationSeconds === "number" && last.answer.durationSeconds > 0
      ? last.answer.durationSeconds
      : null);
  if (duration != null && raw.durationSeconds == null) {
    return { ...raw, durationSeconds: duration };
  }
  return raw;
}
