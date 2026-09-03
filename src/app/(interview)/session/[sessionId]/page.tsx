"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AIAvatar } from "@/components/interview/ai-avatar";
import { AudioWaveform } from "@/components/interview/audio-waveform";
import { TranscriptPanel } from "@/components/interview/transcript-panel";
import { SpeechMetricsHud } from "@/components/interview/speech-metrics-hud";
import { FreezeRecoveryCue } from "@/components/interview/freeze-recovery-cue";
import { useAudioStore } from "@/features/audio/stores/audio-store";

export default function InterviewSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const [elapsed, setElapsed] = useState(0);
  
  // Dummy State for UI Demonstration
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isMuted, toggleMute } = useAudioStore();
  const [showFreezeCue, setShowFreezeCue] = useState(false);
  const [audioLevel, setAudioLevel] = useState<Float32Array>(new Float32Array(30).fill(0.05));

  // Dummy Transcript
  const [transcript] = useState([
    { id: "1", speaker: "ai" as const, text: "Hello! Let's start with a system design question. How would you design a rate limiter?", isFinal: true },
    { id: "2", speaker: "candidate" as const, text: "I would approach this by using a Redis token bucket...", isFinal: true },
    { id: "3", speaker: "ai" as const, text: "That sounds good. What happens if the Redis node fails?", isFinal: true },
  ]);

  // Demo timers
  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-[var(--color-surface-0)] text-[var(--color-text-primary)] font-sans">
      
      {/* ── Background Subtle Gradient ── */}
      <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-[var(--color-brand-900)]/40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[var(--color-accent-900)]/20 blur-[120px] pointer-events-none" />

      {/* ── Top Bar ── */}
      <header className="glass relative z-10 flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-3 py-1.5 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)]"
          >
            <span className="text-lg leading-none">←</span> Exit
          </Link>
          <div className="h-5 w-px bg-[var(--color-border-default)]" />
          <h1 className="text-sm font-bold tracking-wide uppercase font-[family-name:var(--font-display)]">
            System Design Round
          </h1>
          <span className="animate-pulse rounded-full bg-[var(--color-brand-500)]/20 px-2.5 py-0.5 text-xs font-semibold text-[var(--color-brand-400)] border border-[var(--color-brand-500)]/30">
            Recording
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-sm font-medium text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] px-3 py-1 rounded-md border border-[var(--color-border-subtle)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-danger-500)] animate-pulse" />
            {formatTime(elapsed)} / 45:00
          </div>
          <button className="rounded-lg bg-[var(--color-danger-500)] px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--color-danger-400)] shadow-[0_0_15px_oklch(0.58_0.22_25_/_0.4)]">
            End Session
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* ── Left: Interview Area (Avatar & Mic) ── */}
        <div className="flex flex-1 flex-col items-center justify-center p-8">
          
          <AIAvatar isSpeaking={isSpeaking} isProcessing={isProcessing} />

          {/* Current Question / Status */}
          <div className="mt-12 w-full max-w-2xl text-center">
            <h2 className="text-xl font-medium leading-relaxed text-[var(--color-text-primary)] drop-shadow-md">
              "That sounds good. What happens if the Redis node fails?"
            </h2>
            <p className="mt-3 text-sm text-[var(--color-text-tertiary)] uppercase tracking-widest font-semibold">
              {isSpeaking ? "AI is speaking..." : isProcessing ? "AI is thinking..." : "Listening..."}
            </p>
          </div>

          {/* Controls & Waveform */}
          <div className="mt-12 flex flex-col items-center gap-6">
            <button
              onClick={toggleMute}
              className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${
                isMuted
                  ? "bg-[var(--color-surface-3)] border-2 border-[var(--color-border-default)]"
                  : "bg-gradient-to-br from-[var(--color-accent-400)] to-[var(--color-accent-600)] animate-mic-pulse"
              }`}
            >
              <span className="text-3xl">{isMuted ? "🔇" : "🎤"}</span>
            </button>
            
            {/* Real-time waveform */}
            <div className="h-16 w-64 rounded-xl glass flex items-center justify-center p-2 border-[var(--color-border-subtle)]">
              <AudioWaveform isListening={!isMuted} audioData={audioLevel} barCount={30} />
            </div>
          </div>
        </div>

        {/* ── Right: Panels ── */}
        <div className="flex w-[400px] flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/80 backdrop-blur-md">
          
          {/* Speech Metrics HUD */}
          <div className="border-b border-[var(--color-border-subtle)] p-5">
            <SpeechMetricsHud
              wpm={142}
              fillerWordPercent={12}
              hesitationScore={45}
              confidenceScore={88}
            />
          </div>

          {/* Live Transcript */}
          <div className="flex-1 overflow-hidden p-5">
            <TranscriptPanel entries={transcript} />
          </div>

        </div>
      </div>

      {/* ── Floating Overlays ── */}
      <FreezeRecoveryCue 
        isActive={showFreezeCue} 
        onActionClick={() => setShowFreezeCue(false)} 
      />

      {/* Dev Tools Overlay (for demoing states) */}
      <div className="absolute bottom-4 left-4 z-50 flex gap-2 glass p-2 rounded-lg text-xs opacity-50 hover:opacity-100 transition-opacity">
        <button onClick={() => setIsSpeaking(!isSpeaking)} className="px-2 py-1 bg-[var(--color-surface-2)] rounded hover:bg-[var(--color-surface-3)]">Toggle AI Speech</button>
        <button onClick={() => setIsProcessing(!isProcessing)} className="px-2 py-1 bg-[var(--color-surface-2)] rounded hover:bg-[var(--color-surface-3)]">Toggle Processing</button>
        <button onClick={() => setShowFreezeCue(!showFreezeCue)} className="px-2 py-1 bg-[var(--color-surface-2)] rounded hover:bg-[var(--color-surface-3)]">Toggle Freeze Cue</button>
      </div>

    </div>
  );
}
