import { create } from "zustand";
import type { InterviewPhase, InterviewSessionConfig } from "../types/interview.types";
import { INTERVIEW_PHASES } from "@/lib/constants";

interface InterviewStore {
  // ── Session State ──
  sessionId: string | null;
  config: InterviewSessionConfig | null;
  phase: InterviewPhase;
  currentQuestionIndex: number;
  totalQuestions: number;
  elapsedSecs: number;

  // ── Question State ──
  currentQuestion: string | null;
  currentQuestionContext: string | null;
  transcript: Array<{
    speaker: "candidate" | "ai";
    text: string;
    timestamp: number;
    isFinal: boolean;
  }>;

  // ── Scoring ──
  scores: Array<{
    questionIndex: number;
    score: number;
    feedback: string;
  }>;

  // ── Freeze Recovery ──
  isFreezeRecoveryActive: boolean;

  // ── Actions ──
  initSession: (sessionId: string, config: InterviewSessionConfig) => void;
  setPhase: (phase: InterviewPhase) => void;
  setCurrentQuestion: (question: string, context?: string) => void;
  addTranscriptEntry: (entry: {
    speaker: "candidate" | "ai";
    text: string;
    isFinal: boolean;
  }) => void;
  incrementElapsed: () => void;
  nextQuestion: () => void;
  addScore: (score: { questionIndex: number; score: number; feedback: string }) => void;
  setFreezeRecovery: (active: boolean) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewStore>((set) => ({
  sessionId: null,
  config: null,
  phase: INTERVIEW_PHASES.WAITING,
  currentQuestionIndex: 0,
  totalQuestions: 0,
  elapsedSecs: 0,
  currentQuestion: null,
  currentQuestionContext: null,
  transcript: [],
  scores: [],
  isFreezeRecoveryActive: false,

  initSession: (sessionId, config) =>
    set({
      sessionId,
      config,
      phase: INTERVIEW_PHASES.WAITING,
      currentQuestionIndex: 0,
      elapsedSecs: 0,
      transcript: [],
      scores: [],
    }),

  setPhase: (phase) => set({ phase }),

  setCurrentQuestion: (question, context) =>
    set({ currentQuestion: question, currentQuestionContext: context ?? null }),

  addTranscriptEntry: (entry) =>
    set((s) => ({
      transcript: [
        ...s.transcript,
        { ...entry, timestamp: Date.now() },
      ],
    })),

  incrementElapsed: () =>
    set((s) => ({ elapsedSecs: s.elapsedSecs + 1 })),

  nextQuestion: () =>
    set((s) => ({
      currentQuestionIndex: s.currentQuestionIndex + 1,
      currentQuestion: null,
      currentQuestionContext: null,
    })),

  addScore: (score) =>
    set((s) => ({ scores: [...s.scores, score] })),

  setFreezeRecovery: (active) => set({ isFreezeRecoveryActive: active }),

  reset: () =>
    set({
      sessionId: null,
      config: null,
      phase: INTERVIEW_PHASES.WAITING,
      currentQuestionIndex: 0,
      totalQuestions: 0,
      elapsedSecs: 0,
      currentQuestion: null,
      currentQuestionContext: null,
      transcript: [],
      scores: [],
      isFreezeRecoveryActive: false,
    }),
}));
