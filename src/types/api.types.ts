/**
 * InterviewLab — Shared API Response Types
 *
 * These types mirror the response shapes from Component 3 (Node.js Backend).
 * Keep in sync with the backend OpenAPI spec.
 */

// ── Generic API Response Wrapper ──
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

// ── User / Auth ──
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "student" | "professional" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// ── Interview ──
export interface Interview {
  id: string;
  userId: string;
  type: "technical" | "behavioral" | "system_design" | "hr" | "mixed";
  difficulty: "easy" | "medium" | "hard" | "expert";
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  durationMins: number;
  targetRole?: string;
  targetCompany?: string;
  jobDescription?: string;
  overallScore?: number;
  createdAt: string;
  completedAt?: string;
}

export interface InterviewQuestion {
  id: string;
  interviewId: string;
  text: string;
  type: "technical" | "behavioral" | "system_design" | "follow_up";
  difficulty: number; // 1-5
  timeAllocatedSecs: number;
  order: number;
}

export interface InterviewAnswer {
  id: string;
  questionId: string;
  transcript: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  durationSecs: number;
}

// ── Interview Report ──
export interface InterviewReport {
  id: string;
  interviewId: string;
  overallScore: number;
  technicalScore?: number;
  communicationScore?: number;
  problemSolvingScore?: number;
  summary: string;
  strengths: string[];
  areasForImprovement: string[];
  questions: Array<InterviewQuestion & { answer: InterviewAnswer }>;
  audioMetrics?: AudioMetrics;
  createdAt: string;
}

// ── Audio / Speech Metrics ──
export interface AudioMetrics {
  averageWPM: number;
  fillerWordCount: number;
  fillerWordPercentage: number;
  hesitationCount: number;
  longestPauseSecs: number;
  averagePauseSecs: number;
  confidenceScore: number; // 0-100
  clarityScore: number; // 0-100
}

export interface RealTimeMetrics {
  currentWPM: number;
  fillerWords: number;
  hesitationSpikes: number;
  silenceDurationMs: number;
  volumeLevel: number; // 0-1
  isSpeaking: boolean;
}

// ── Resume ──
export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  parsedContent?: string;
  atsScore?: number;
  skills: string[];
  experience: ResumeExperience[];
  uploadedAt: string;
}

export interface ResumeExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

// ── Student Passport ──
export interface PassportMetrics {
  dimension: string;
  score: number; // 0-100
  trend: "improving" | "stable" | "declining";
  sessionsCount: number;
}

export interface PassportSnapshot {
  date: string;
  metrics: PassportMetrics[];
  overallScore: number;
}

// ── WebSocket Messages ──
export interface WSMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  sessionId?: string;
}

export interface TranscriptMessage {
  text: string;
  isFinal: boolean;
  confidence: number;
  speaker: "candidate" | "ai";
}

export interface AIQuestionMessage {
  questionId: string;
  text: string;
  context?: string;
  followUpDepth: number;
}

export interface AIFeedbackMessage {
  questionId: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface CanvasAlertMessage {
  nodeId: string;
  type: "warning" | "error" | "suggestion";
  message: string;
  position: { x: number; y: number };
}
