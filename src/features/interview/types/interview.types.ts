/**
 * InterviewLab — Interview Feature Types
 */

import type { INTERVIEW_TYPES, INTERVIEW_PHASES, INTERVIEW_DIFFICULTY } from "@/lib/constants";

export type InterviewType = (typeof INTERVIEW_TYPES)[keyof typeof INTERVIEW_TYPES];
export type InterviewPhase = (typeof INTERVIEW_PHASES)[keyof typeof INTERVIEW_PHASES];
export type InterviewDifficulty = (typeof INTERVIEW_DIFFICULTY)[keyof typeof INTERVIEW_DIFFICULTY];

export interface InterviewSessionConfig {
  type: InterviewType;
  difficulty: InterviewDifficulty;
  durationMins: number;
  jobDescription?: string;
  targetRole?: string;
  targetCompany?: string;
  focusAreas?: string[];
  resumeId?: string;
}

export interface InterviewSessionState {
  sessionId: string;
  config: InterviewSessionConfig;
  phase: InterviewPhase;
  currentQuestionIndex: number;
  totalQuestions: number;
  elapsedSecs: number;
  isRecording: boolean;
  isPaused: boolean;
}
