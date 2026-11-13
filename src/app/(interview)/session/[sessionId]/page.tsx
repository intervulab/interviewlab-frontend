"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AIAvatar } from "@/components/interview/ai-avatar";
import { AudioWaveform } from "@/components/interview/audio-waveform";
import { TranscriptPanel } from "@/components/interview/transcript-panel";
import {
  buildSessionTranscript,
  questionProgressLabel,
} from "@/features/interview/build-session-transcript";
import { SpeechMetricsHud } from "@/components/interview/speech-metrics-hud";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { getSession, submitAnswer, generateReport } from "@/features/backend/api";
import type { InterviewQuestionDto, InterviewSessionDto } from "@/features/backend/types";
import { ROUTES } from "@/lib/constants";
import { ApiClientError } from "@/lib/api-client";
import type { RealTimeMetrics } from "@/types/api.types";
import { useLiveAudioAnalytics } from "@/features/realtime/hooks/useLiveAudioAnalytics";
import { useSpeechRecognition } from "@/features/audio/hooks/useSpeechRecognition";
import { useServerLiveCaptions } from "@/features/audio/hooks/useServerLiveCaptions";
import { hesitationSpikesToHudScore } from "@/features/audio/hesitation-score";
import {
  latestAnswerMetrics,
  metricsFromAnalysis,
} from "@/features/audio/metrics-from-analysis";
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [metrics, setMetrics] = useState({
    wpm: 0,
    fillerPct: 0,
    hesitation: 0,
    confidence: 0,
    answerDurationSecs: 0,
  });

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const pendingAudioRef = useRef<{ blob: Blob; durationSeconds: number } | null>(null);
  const [recording, setRecording] = useState(false);
  const recordStartRef = useRef<number | null>(null);
  const typedBeforeRecordRef = useRef("");

  const {
    metrics: liveMetrics,
    wsState,
    liveActive,
    startLiveAnalytics,
    stopLiveAnalytics,
    pushTranscriptDraft,
    pushTranscriptFinal,
  } = useLiveAudioAnalytics(sessionId);

  const speech = useSpeechRecognition();

  const getRecordingBlob = useCallback(() => {
    if (!chunksRef.current.length) return null;
    const mime = mediaRef.current?.mimeType || "audio/webm";
    return new Blob(chunksRef.current, { type: mime });
  }, []);

  const serverCaptionsEnabled =
    recording && (!speech.supported || Boolean(speech.sttError) || !speech.listening);

  const { serverCaption, serverPending, serverUnavailable } = useServerLiveCaptions(
    sessionId,
    recording,
    getRecordingBlob,
    serverCaptionsEnabled
  );

  const mergedVoiceTranscript = useMemo(() => {
    const browser = speech.combinedTranscript.trim();
    const server = serverCaption.trim();
    if (browser && server) {
      return browser.length >= server.length ? browser : server;
    }
    return browser || server;
  }, [speech.combinedTranscript, serverCaption]);

  const debouncedAnswer = useDebounce(answerText, 450);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSession(sessionId);
      setSession(data);
      const next = firstUnanswered(data.questions);
      setActiveQuestion(next);
      const raw = latestAnswerMetrics(data.questions);
      if (raw) {
        setMetrics(metricsFromAnalysis(null, raw));
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
    if (!recording) return;
    const merged = [typedBeforeRecordRef.current, mergedVoiceTranscript]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (merged) setAnswerText(merged);
  }, [recording, mergedVoiceTranscript]);

  useEffect(() => {
    const draft = debouncedAnswer.trim();
    if (draft) {
      pushTranscriptDraft(draft);
    }
  }, [debouncedAnswer, pushTranscriptDraft]);

  useEffect(() => {
    if (!liveMetrics) return;
    setMetrics((prev) => ({
      wpm: liveMetrics.currentWPM ?? prev.wpm,
      fillerPct: liveMetrics.fillerWords ?? prev.fillerPct,
      hesitation: liveMetrics.hesitationSpikes ?? prev.hesitation,
      confidence: Math.round((liveMetrics.volumeLevel ?? 0) * 100) || prev.confidence,
      answerDurationSecs: prev.answerDurationSecs,
    }));
  }, [liveMetrics]);

  const applyMetrics = (rt?: RealTimeMetrics, raw?: Record<string, unknown>) => {
    setMetrics(metricsFromAnalysis(rt, raw));
  };

  function finalizeRecordingChunks(): Blob | undefined {
    if (!chunksRef.current.length) return undefined;
    return new Blob(chunksRef.current, { type: "audio/webm" });
  }

  function stashPendingRecording() {
    const blob = finalizeRecordingChunks();
    if (!blob || blob.size === 0) {
      pendingAudioRef.current = null;
      return;
    }
    const durationSeconds =
      recordStartRef.current != null
        ? (Date.now() - recordStartRef.current) / 1000
        : 0;
    pendingAudioRef.current = { blob, durationSeconds };
  }

  async function toggleRecording() {
    if (recording && mediaRef.current) {
      const rec = mediaRef.current;
      if (rec.state !== "inactive") {
        await new Promise<void>((resolve) => {
          rec.onstop = () => resolve();
          rec.stop();
        });
      }
      speech.stopListening();
      await new Promise((r) => setTimeout(r, 350));
      stashPendingRecording();
      setRecording(false);
      const mergedStop = buildTranscriptPayload();
      if (mergedStop) setAnswerText(mergedStop);
      return;
    }
    try {
      if (liveActive) {
        stopLiveAnalytics();
      }
      typedBeforeRecordRef.current = answerText.trim();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      pendingAudioRef.current = null;
      speech.resetTranscript();
      const recorder = new MediaRecorder(stream);
      mediaRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(250);
      recordStartRef.current = Date.now();
      setRecording(true);
      const sttOk = speech.startListening();
      if (!sttOk && speech.supported) {
        setError("Live captions unavailable — type your answer or check mic access.");
      }
    } catch {
      setError("Microphone permission denied");
    }
  }

  function buildTranscriptPayload() {
    const fromField = answerText.trim();
    if (fromField) return fromField;
    return mergedVoiceTranscript.trim();
  }

  const liveCaption = useMemo(() => answerText.trim(), [answerText]);

  const progress = useMemo(
    () => questionProgressLabel(session?.questions ?? [], activeQuestion),
    [session?.questions, activeQuestion]
  );

  const transcriptForPanel = useMemo(
    () =>
      buildSessionTranscript(
        session?.questions ?? [],
        activeQuestion?.id ?? null,
        recording || speech.listening ? liveCaption : undefined
      ),
    [session?.questions, activeQuestion?.id, recording, speech.listening, liveCaption]
  );

  async function handleSubmit() {
    if (!activeQuestion) return;
    setSubmitting(true);
    setError(null);
    try {
      let audioBlob: Blob | undefined = pendingAudioRef.current?.blob;
      let durationSeconds: number | undefined = pendingAudioRef.current?.durationSeconds;

      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        speech.stopListening();
        await new Promise<void>((resolve) => {
          const rec = mediaRef.current!;
          rec.onstop = () => resolve();
          rec.stop();
        });
        setRecording(false);
        stashPendingRecording();
        audioBlob = pendingAudioRef.current?.blob;
        durationSeconds = pendingAudioRef.current?.durationSeconds;
      } else if (!audioBlob && chunksRef.current.length) {
        stashPendingRecording();
        audioBlob = pendingAudioRef.current?.blob;
        durationSeconds = pendingAudioRef.current?.durationSeconds;
      }

      const mergedTranscript = buildTranscriptPayload();
      if (!mergedTranscript && !audioBlob) {
        setError("Type an answer or record audio before submitting.");
        return;
      }

      if (mergedTranscript) {
        pushTranscriptFinal(mergedTranscript);
      }

      const result = await submitAnswer(activeQuestion.id, {
        transcriptText: mergedTranscript || undefined,
        audioBlob,
        durationSeconds,
      });

      applyMetrics(
        result.realTimeMetrics,
        result.answer?.audioAnalysis?.rawMetricsJson as Record<string, unknown> | undefined
      );

      setAnswerText("");
      speech.resetTranscript();
      chunksRef.current = [];
      pendingAudioRef.current = null;

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
        <div className="flex flex-1 flex-col items-center justify-center p-8 gap-6 overflow-y-auto">
          <AIAvatar isSpeaking={!activeQuestion} isProcessing={submitting} />
          <div className="text-center space-y-2">
            <p className="inline-flex rounded-full border border-[var(--color-brand-500)]/40 bg-[var(--color-brand-500)]/10 px-5 py-2 text-sm font-bold tracking-wide text-[var(--color-brand-300)]">
              {progress.label}
            </p>
            <h2 className="max-w-3xl text-center text-2xl font-bold leading-snug px-4">{questionText}</h2>
          </div>
          {(recording || speech.listening || liveCaption) && (
            <div className="w-full max-w-2xl rounded-xl border border-[var(--color-brand-500)]/50 bg-[var(--color-surface-1)] px-5 py-4 shadow-inner">
              <p className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-brand-400)] mb-2">
                {speech.listening
                  ? "● Live captions"
                  : serverCaption
                    ? "● Server captions"
                    : serverPending
                      ? "● Transcribing…"
                      : recording
                        ? "Recording…"
                        : "Answer draft"}
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap min-h-[3rem]">
                {liveCaption ||
                  (serverPending
                    ? "Listening… captions appear in a few seconds (local Whisper on the server)."
                    : "Speak clearly — your words will appear here.")}
              </p>
            </div>
          )}
          {speech.sttError && !serverCaption && !serverPending && serverUnavailable && (
            <p className="max-w-2xl w-full text-xs text-[var(--color-warning-400)]">{speech.sttError}</p>
          )}
          {speech.sttError && serverCaptionsEnabled && !serverUnavailable && (
            <p className="max-w-2xl w-full text-xs text-[var(--color-text-secondary)]">
              {speech.sttError}
            </p>
          )}
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder={
              speech.supported
                ? "Speak while recording — your words appear here — or type your answer"
                : "Type your answer (optional if you record audio)…"
            }
            rows={5}
            className="w-full max-w-2xl rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] px-5 py-4 text-sm min-h-[120px]"
          />
          <MagneticButton
            onClick={() => {
              if (liveActive) stopLiveAnalytics();
              else startLiveAnalytics().catch(() => setError("Could not start live audio metrics."));
            }}
            className="text-sm px-6 py-2.5 rounded-xl border border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
          >
            {liveActive ? "Pause live metrics" : "Enable live metrics (uses mic)"}
          </MagneticButton>
          <div className="flex flex-wrap items-center justify-center gap-5 w-full max-w-2xl">
            <MagneticButton
              onClick={toggleRecording}
              className={`flex-1 min-w-[11rem] px-8 py-4 rounded-xl text-base font-bold ${recording ? "bg-[var(--color-danger-600)]" : "bg-[var(--color-brand-600)]"} text-white shadow-md`}
            >
              {recording ? "Stop recording" : "Record answer"}
            </MagneticButton>
            <MagneticButton
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 min-w-[11rem] px-8 py-4 rounded-xl bg-[var(--color-accent-500)] text-white text-base font-bold disabled:opacity-50 shadow-md ring-2 ring-[var(--color-accent-400)]/30"
            >
              {submitting ? "Submitting…" : "Submit answer"}
            </MagneticButton>
          </div>
          <AudioWaveform isListening={recording} audioData={audioLevel} barCount={32} />
        </div>

        <aside className="flex w-[min(100%,24rem)] shrink-0 flex-col min-h-0 border-l border-[var(--color-border-subtle)] p-6 gap-6">
          <div className="shrink-0">
            <SpeechMetricsHud
              wpm={metrics.wpm}
              fillerWordPercent={metrics.fillerPct}
              hesitationScore={hesitationSpikesToHudScore(
                metrics.hesitation,
                metrics.answerDurationSecs
              )}
              confidenceScore={metrics.confidence}
            />
          </div>
          <TranscriptPanel entries={transcriptForPanel} className="min-h-[280px]" />
        </aside>
      </div>
    </div>
  );
}
