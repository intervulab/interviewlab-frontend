"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AIAvatar } from "@/components/interview/ai-avatar";
import { AudioWaveform } from "@/components/interview/audio-waveform";
import { TranscriptPanel } from "@/components/interview/transcript-panel";
import { SpeechMetricsHud } from "@/components/interview/speech-metrics-hud";
import { FreezeRecoveryCue } from "@/components/interview/freeze-recovery-cue";
import { useAudioStore } from "@/features/audio/stores/audio-store";
import { MagneticButton } from "@/components/shared/magnetic-button";

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

  const [transcript] = useState([
    { id: "1", speaker: "ai" as const, text: "System Initialized. Accessing System Design protocol. How would you design a distributed rate limiter?", isFinal: true },
    { id: "2", speaker: "candidate" as const, text: "I would use a token bucket algorithm with Redis...", isFinal: true },
    { id: "3", speaker: "ai" as const, text: "Acknowledged. But what happens during a network partition?", isFinal: true },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-[var(--color-surface-0)] text-[var(--color-text-primary)] font-sans selection:bg-[var(--color-brand-500)] selection:text-white">
      
      {/* ── 3D Tech Background Gradients ── */}
      <div className="absolute top-[-20%] left-[-10%] h-[60%] w-[60%] rounded-full bg-[var(--color-brand-900)]/30 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-[var(--color-accent-900)]/20 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* ── Top Bar ── */}
      <header className="relative z-10 flex items-center justify-between border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/60 backdrop-blur-xl px-8 py-5">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 rounded-lg bg-[var(--color-surface-2)] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[var(--color-text-secondary)] transition-all hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text-primary)]"
          >
            <span className="text-lg leading-none group-hover:-translate-x-1 transition-transform">←</span> Abort
          </Link>
          <div className="h-6 w-px bg-[var(--color-border-default)]" />
          <h1 className="text-2xl font-black tracking-widest uppercase font-[family-name:var(--font-display)] text-[var(--color-text-primary)] mt-1">
            SYS_DESIGN // 001
          </h1>
          <span className="animate-pulse rounded border border-[var(--color-danger-500)]/50 bg-[var(--color-danger-500)]/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--color-danger-400)] shadow-[0_0_15px_oklch(0.55_0.27_20_/_0.3)]">
            REC
          </span>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 font-mono text-base font-bold text-[var(--color-text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-brand-500)] animate-pulse shadow-[0_0_10px_oklch(0.75_0.22_140)]" />
            {formatTime(elapsed)} / 45:00
          </div>
          <MagneticButton 
            className="rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-strong)] px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-[var(--color-surface-3)]"
            magneticStrength={0.2}
          >
            End Protocol
          </MagneticButton>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        
        {/* ── Left: Interview Area (Avatar & Mic) ── */}
        <div className="flex flex-1 flex-col items-center justify-center p-8 relative">
          
          <AIAvatar isSpeaking={isSpeaking} isProcessing={isProcessing} />

          {/* Current Question / Status */}
          <div className="mt-16 w-full max-w-4xl text-center px-4">
            <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter text-[var(--color-text-primary)] drop-shadow-xl">
              "Acknowledged. But what happens during a network partition?"
            </h2>
            <p className="mt-6 text-sm text-[var(--color-brand-400)] font-mono uppercase tracking-[0.3em] font-bold">
              {isSpeaking ? "> AI_TRANSMITTING..." : isProcessing ? "> NEURAL_PROCESSING..." : "> LISTENING_FOR_INPUT..."}
            </p>
          </div>

          {/* Controls & Waveform */}
          <div className="mt-16 flex flex-col items-center gap-8">
            <MagneticButton
              onClick={toggleMute}
              magneticStrength={0.5}
              className={`flex h-24 w-24 items-center justify-center rounded-2xl text-white shadow-2xl transition-all ${
                isMuted
                  ? "bg-[var(--color-surface-3)] border border-[var(--color-border-strong)]"
                  : "bg-gradient-to-br from-[var(--color-brand-400)] to-[var(--color-brand-600)] animate-mic-pulse border border-[var(--color-brand-300)]"
              }`}
            >
              <span className="text-4xl">{isMuted ? "🔇" : "🎤"}</span>
            </MagneticButton>
            
            {/* Real-time waveform */}
            <div className="h-20 w-80 rounded-2xl bg-[var(--color-surface-1)]/50 backdrop-blur-md flex items-center justify-center p-4 border border-[var(--color-border-subtle)] shadow-inner">
              <AudioWaveform isListening={!isMuted} audioData={audioLevel} barCount={40} />
            </div>
          </div>
        </div>

        {/* ── Right: Panels ── */}
        <div className="flex w-[450px] flex-col border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-0)]/90 backdrop-blur-2xl shadow-[-20px_0_50px_rgba(0,0,0,0.5)] z-20">
          
          {/* Speech Metrics HUD */}
          <div className="border-b border-[var(--color-border-subtle)] p-6 bg-[var(--color-surface-1)]/30">
            <h3 className="font-mono text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">
              [ Cognitive Metrics ]
            </h3>
            <SpeechMetricsHud
              wpm={142}
              fillerWordPercent={12}
              hesitationScore={45}
              confidenceScore={88}
            />
          </div>

          {/* Live Transcript */}
          <div className="flex-1 overflow-hidden p-6 flex flex-col">
            <h3 className="font-mono text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-4">
              [ Live Transcript ]
            </h3>
            <div className="flex-1">
              <TranscriptPanel entries={transcript} />
            </div>
          </div>

        </div>
      </div>

      <FreezeRecoveryCue 
        isActive={showFreezeCue} 
        onActionClick={() => setShowFreezeCue(false)} 
      />

      {/* Dev Tools Overlay */}
      <div className="absolute bottom-6 left-6 z-50 flex gap-3 bg-[var(--color-surface-1)]/80 backdrop-blur-md p-3 rounded-xl border border-[var(--color-border-subtle)] font-mono text-[10px] uppercase font-bold text-[var(--color-text-secondary)]">
        <button onClick={() => setIsSpeaking(!isSpeaking)} className="px-3 py-1.5 bg-[var(--color-surface-2)] rounded hover:bg-[var(--color-surface-3)] hover:text-white transition-colors">Toggle AI</button>
        <button onClick={() => setIsProcessing(!isProcessing)} className="px-3 py-1.5 bg-[var(--color-surface-2)] rounded hover:bg-[var(--color-surface-3)] hover:text-white transition-colors">Toggle Process</button>
        <button onClick={() => setShowFreezeCue(!showFreezeCue)} className="px-3 py-1.5 bg-[var(--color-surface-2)] rounded hover:bg-[var(--color-surface-3)] hover:text-white transition-colors">Toggle Freeze</button>
      </div>

    </div>
  );
}
