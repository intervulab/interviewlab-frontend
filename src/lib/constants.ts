/**
 * InterviewLab — Application Constants
 *
 * Centralized configuration values used across the frontend.
 * All magic numbers and strings should live here.
 */

// ── App Metadata ──────────────────────────────────────────
export const APP_NAME = "InterviewLab";
export const APP_DESCRIPTION =
  "AI-powered interview preparation platform with real-time audio analytics, multi-agent debate engine, and interactive system design canvas.";
export const APP_VERSION = "0.1.0";

// ── Interview Configuration ───────────────────────────────
export const INTERVIEW_TYPES = {
  TECHNICAL: "technical",
  BEHAVIORAL: "behavioral",
  SYSTEM_DESIGN: "system_design",
  HR: "hr",
  MIXED: "mixed",
} as const;

export const INTERVIEW_DIFFICULTY = {
  EASY: "easy",
  MEDIUM: "medium",
  HARD: "hard",
  EXPERT: "expert",
} as const;

export const INTERVIEW_PHASES = {
  WAITING: "waiting",
  INTRO: "intro",
  QUESTION: "question",
  ANSWER: "answer",
  FOLLOW_UP: "follow_up",
  FEEDBACK: "feedback",
  WRAP_UP: "wrap_up",
  COMPLETE: "complete",
} as const;

export const DEFAULT_INTERVIEW_DURATION_MINS = 30;
export const MAX_INTERVIEW_DURATION_MINS = 90;

// ── Audio Configuration ───────────────────────────────────
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 16000, // 16kHz for speech recognition
  CHANNELS: 1, // Mono
  CHUNK_DURATION_MS: 250, // 250ms chunks for streaming
  SILENCE_THRESHOLD: 0.01, // VAD silence threshold
  SILENCE_TIMEOUT_MS: 5000, // Freeze-recovery trigger (5s silence)
  MAX_RECORDING_MINS: 90,
  SUPPORTED_FORMATS: ["audio/webm", "audio/ogg", "audio/wav"] as const,
} as const;

// ── WebSocket Configuration ───────────────────────────────
export const WS_CONFIG = {
  RECONNECT_INITIAL_DELAY_MS: 1000,
  RECONNECT_MAX_DELAY_MS: 30000,
  RECONNECT_MAX_ATTEMPTS: 10,
  RECONNECT_BACKOFF_MULTIPLIER: 2,
  HEARTBEAT_INTERVAL_MS: 15000,
  HEARTBEAT_TIMEOUT_MS: 5000,
} as const;

// ── WebSocket Message Types ───────────────────────────────
export const WS_MESSAGE_TYPES = {
  // Client → Server
  AUDIO_CHUNK: "audio:chunk",
  AUDIO_START: "audio:start",
  AUDIO_STOP: "audio:stop",
  CANVAS_STATE: "canvas:state",
  SESSION_JOIN: "session:join",
  SESSION_LEAVE: "session:leave",

  // Server → Client
  TRANSCRIPT_PARTIAL: "transcript:partial",
  TRANSCRIPT_FINAL: "transcript:final",
  AI_QUESTION: "ai:question",
  AI_VOICE: "ai:voice",
  AI_FEEDBACK: "ai:feedback",
  METRICS_UPDATE: "metrics:update",
  CANVAS_ALERT: "canvas:alert",
  SESSION_STATE: "session:state",
  ERROR: "error",
} as const;

// ── Student Passport Metrics ──────────────────────────────
export const PASSPORT_DIMENSIONS = [
  "Technical Depth",
  "Communication Clarity",
  "Problem Solving",
  "System Design",
  "Behavioral / STAR",
  "Confidence & Pacing",
  "Code Quality",
  "Domain Knowledge",
] as const;

// ── Resume Upload ─────────────────────────────────────────
export const RESUME_CONFIG = {
  MAX_FILE_SIZE_MB: 10,
  ACCEPTED_FORMATS: [".pdf", ".docx", ".doc"] as const,
  ACCEPTED_MIME_TYPES: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ] as const,
} as const;

// ── UI Constants ──────────────────────────────────────────
export const SIDEBAR_WIDTH = 280;
export const SIDEBAR_COLLAPSED_WIDTH = 72;
export const HEADER_HEIGHT = 64;
export const TOAST_DURATION_MS = 5000;

// ── Route Paths ───────────────────────────────────────────
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  INTERVIEWS: "/interviews",
  INTERVIEW_SESSION: (id: string) => `/session/${id}` as const,
  INTERVIEW_CANVAS: (id: string) => `/session/${id}/canvas` as const,
  INTERVIEW_REPORT: (id: string) => `/interviews/${id}/report` as const,
  PRACTICE: "/practice",
  PASSPORT: "/passport",
  RESUME: "/resume",
  SETTINGS: "/settings",
  PRICING: "/pricing",
  ABOUT: "/about",
} as const;
