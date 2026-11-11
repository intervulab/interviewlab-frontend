"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AIAvatar } from "@/components/interview/ai-avatar";
import { AudioWaveform } from "@/components/interview/audio-waveform";
import { TranscriptPanel } from "@/components/interview/transcript-panel";
import { SpeechMetricsHud } from "@/components/interview/speech-metrics-hud";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { getSession, submitAnswer, generateReport } from "@/features/backend/api";
import type { InterviewQuestionDto, InterviewSessionDto } from "@/features/backend/types";
import { ROUTES } from "@/lib/constants";
import { ApiClientError } from "@/lib/api-client";
import type { RealTimeMetrics } from "@/types/api.types";
import { useLiveAudioAnalytics } from "@/features/realtime/hooks/useLiveAudioAnalytics";
import { useDebounce } from "@/hooks/useDebounce";

function firstUnanswered(questions: InterviewQuestionDto[]) {
  return questions.find((q) => !q.answer) ?? null;
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<InterviewSessionDto | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<InterviewQuestionDto | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [metrics, setMetrics] = useState({
    wpm: 0,
    fillerPct: 0,
    hesitation: 0,
    confidence: 0,
  });
  const [transcript, setTranscript] = useState<
    Array<{ id: string; speaker: "ai" | "candidate"; text: string; isFinal: boolean }>
  >([]);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const recordStartRef = useRef<number | null>(null);
  const liveStartedRef = useRef(false);

  const {
    metrics: liveMetrics,
    wsState,
    liveActive,
    startLiveAnalytics,
    stopLiveAnalytics,
    pushTranscriptDraft,
    pushTranscriptFinal,
  } = useLiveAudioAnalytics(sessionId);

  const debouncedAnswer = useDebounce(answerText, 450);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSession(sessionId);
      setSession(data);
      const next = firstUnanswered(data.questions);
      setActiveQuestion(next);
      const entries = data.questions.flatMap((q) => {
        const list: typeof transcript = [
          {
            id: `q-${q.id}`,
            speaker: "ai",
            text: q.questionText,
            isFinal: true,
          },
        ];
        if (q.answer?.transcriptText) {
          list.push({
            id: `a-${q.id}`,
            speaker: "candidate",
            text: q.answer.transcriptText,
            isFinal: true,
          });
        }
        return list;
      });
      setTranscript(entries);
      if (next) {
        setTranscript((prev) => {
          if (prev.some((e) => e.id === `q-${next.id}`)) return prev;
          return [
            ...prev,
            { id: `q-${next.id}`, speaker: "ai", text: next.questionText, isFinal: true },
          ];
        });
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to load session");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (loading || liveStartedRef.current) return;
    liveStartedRef.current = true;
    startLiveAnalytics().catch(() => {
      console.warn("Live audio analytics could not start (mic permission or WS).");
    });
    return () => {
      stopLiveAnalytics();
    };
  }, [loading, startLiveAnalytics, stopLiveAnalytics]);

  useEffect(() => {
    if (debouncedAnswer.trim()) {
      pushTranscriptDraft(debouncedAnswer);
    }
  }, [debouncedAnswer, pushTranscriptDraft]);

  useEffect(() => {
    if (!liveMetrics) return;
    setMetrics((prev) => ({
      wpm: liveMetrics.currentWPM ?? prev.wpm,
      fillerPct: liveMetrics.fillerWords ?? prev.fillerPct,
      hesitation: liveMetrics.hesitationSpikes ?? prev.hesitation,
      confidence: Math.round((liveMetrics.volumeLevel ?? 0) * 100) || prev.confidence,
    }));
  }, [liveMetrics]);

  const applyMetrics = (rt?: RealTimeMetrics, raw?: Record<string, unknown>) => {
    const m = raw || {};
    setMetrics({
      wpm: rt?.currentWPM ?? (m.averageWPM as number) ?? (m.speechPaceWpm as number) ?? 0,
      fillerPct: (m.fillerWordPercentage as number) ?? rt?.fillerWords ?? 0,
      hesitation: rt?.hesitationSpikes ?? (m.hesitationCount as number) ?? 0,
      confidence: (m.confidenceScore as number) ?? (m.clarityScore as number) ?? 0,
    });
  };

  async function toggleRecording() {
    if (recording && mediaRef.current) {
      mediaRef.current.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start();
      recordStartRef.current = Date.now();
      setRecording(true);
    } catch {
      setError("Microphone permission denied");
    }
  }

  async function handleSubmit() {
    if (!activeQuestion) return;
    setSubmitting(true);
    setError(null);
    setFeedback(null);
    try {
      let audioBlob: Blob | undefined;
      let durationSeconds: number | undefined;

      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        await new Promise<void>((resolve) => {
          const rec = mediaRef.current!;
          rec.onstop = () => resolve();
          rec.stop();
        });
        setRecording(false);
        if (chunksRef.current.length) {
          audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          durationSeconds =
            recordStartRef.current != null
              ? (Date.now() - recordStartRef.current) / 1000
              : undefined;
        }
      }

      if (answerText.trim()) {
        pushTranscriptFinal(answerText);
      }

      const result = await submitAnswer(activeQuestion.id, {
        transcriptText: answerText || undefined,
        audioBlob,
        durationSeconds,
      });

      if (answerText.trim()) {
        setTranscript((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            speaker: "candidate",
            text: answerText.trim(),
            isFinal: true,
          },
        ]);
      }

      applyMetrics(
        result.realTimeMetrics,
        result.answer?.audioAnalysis?.rawMetricsJson as Record<string, unknown> | undefined
      );

      const evalText = result.agent?.evaluation?.feedback;
      if (evalText) setFeedback(evalText);

      setAnswerText("");
      chunksRef.current = [];

      if (result.agent?.session_complete) {
        await generateReport(sessionId);
        router.push(ROUTES.INTERVIEW_REPORT(sessionId));
        return;
      }

      if (result.agent?.next_question) {
        const refreshed = await getSession(sessionId);
        setSession(refreshed);
        const next = firstUnanswered(refreshed.questions);
        setActiveQuestion(next);
        if (next) {
          setTranscript((prev) => [
            ...prev,
            { id: `q-${next.id}`, speaker: "ai", text: next.questionText, isFinal: true },
          ]);
        }
      } else {
        await loadSession();
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEnd() {
    try {
      await generateReport(sessionId);
      router.push(ROUTES.INTERVIEW_REPORT(sessionId));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not finalize report");
    }
  }

  const questionText = activeQuestion?.questionText ?? "Session complete — generate your report.";

  const audioLevel = useMemo(() => {
    const arr = new Float32Array(30);
    const v = recording ? 0.15 + Math.random() * 0.25 : 0.05;
    arr.fill(v);
    return arr;
  }, [recording]);

  if (loading) {
    return <div className="flex h-full items-center justify-center text-[var(--color-text-secondary)]">Loading session…</div>;
  }

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-[var(--color-surface-0)]">
      <header className="z-10 flex items-center justify-between border-b border-[var(--color-border-subtle)] px-8 py-4">
        <Link href={ROUTES.PRACTICE} className="text-sm text-[var(--color-text-secondary)] hover:text-white">
          ← Back
        </Link>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-tertiary)]">
          <span>{session?.targetRole}</span>
          <span className={wsState === "connected" ? "text-[var(--color-brand-400)]" : "text-[var(--color-warning-400)]"}>
            WS {wsState}
          </span>
          {liveActive && <span className="text-[var(--color-danger-400)]">● LIVE</span>}
        </div>
        <div className="flex gap-3">
          <Link
            href={ROUTES.INTERVIEW_CANVAS(sessionId)}
            className="rounded-lg border border-[var(--color-border-default)] px-3 py-1.5 text-xs"
          >
            System Design
          </Link>
          <MagneticButton onClick={handleEnd} className="rounded-lg bg-[var(--color-surface-2)] px-4 py-2 text-xs font-bold">
            End &amp; Report
          </MagneticButton>
        </div>
      </header>

      {error && (
        <p className="mx-8 mt-4 rounded border border-[var(--color-danger-500)]/40 bg-[var(--color-danger-500)]/10 px-3 py-2 text-sm text-[var(--color-danger-400)]">
          {error}
        </p>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col items-center justify-center p-8 gap-8">
          <AIAvatar isSpeaking={!activeQuestion} isProcessing={submitting} />
          <h2 className="max-w-3xl text-center text-2xl font-bold leading-snug">{questionText}</h2>
          {feedback && (
            <p className="max-w-2xl rounded-xl border border-[var(--color-brand-500)]/30 bg-[var(--color-brand-500)]/10 px-4 py-3 text-sm">
              {feedback}
            </p>
          )}
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer (optional if you record audio)…"
            rows={4}
            className="w-full max-w-2xl rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] p-4 text-sm"
          />
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={toggleRecording}
              className={`px-6 py-3 rounded-xl text-sm font-bold ${recording ? "bg-[var(--color-danger-600)]" : "bg-[var(--color-brand-600)]"} text-white`}
            >
              {recording ? "Stop recording" : "Record answer"}
            </MagneticButton>
            <MagneticButton
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl bg-[var(--color-accent-600)] text-white text-sm font-bold disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit answer"}
            </MagneticButton>
          </div>
          <AudioWaveform isListening={recording} audioData={audioLevel} barCount={32} />
        </div>

        <div className="w-[380px] border-l border-[var(--color-border-subtle)] p-6 space-y-6">
          <SpeechMetricsHud
            wpm={metrics.wpm}
            fillerWordPercent={metrics.fillerPct}
            hesitationScore={Math.min(100, metrics.hesitation * 10)}
            confidenceScore={metrics.confidence}
          />
          <TranscriptPanel entries={transcript} />
        </div>
      </div>
    </div>
  );
}
