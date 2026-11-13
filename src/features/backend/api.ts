import { api, type BackendEnvelope } from "@/lib/api-client";
import type {
  AnswerSubmitResponse,
  AuthPayload,
  InterviewSessionDto,
  SessionReportDto,
} from "./types";

export async function registerCandidate(body: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  targetRole?: string;
}) {
  const res = await api.post<BackendEnvelope<AuthPayload>>("/auth/register", body, {
    skipAuth: true,
  });
  return res.data;
}

export async function loginUser(body: { email: string; password: string }) {
  const res = await api.post<BackendEnvelope<AuthPayload>>("/auth/login", body, {
    skipAuth: true,
  });
  return res.data;
}

export async function createSession(body: {
  title: string;
  targetRole: string;
  resumeId?: string;
  questionCount?: number;
}) {
  const res = await api.post<BackendEnvelope<InterviewSessionDto>>("/sessions", body);
  return res.data;
}

export async function getSession(sessionId: string) {
  const res = await api.get<BackendEnvelope<InterviewSessionDto>>(`/sessions/${sessionId}`);
  return res.data;
}

export async function liveTranscribeSnippet(sessionId: string, audioBlob: Blob) {
  const form = new FormData();
  form.append("audio", audioBlob, "live.webm");
  const res = await api.postForm<BackendEnvelope<{ text: string }>>(
    `/sessions/${sessionId}/live-transcript`,
    form
  );
  return res.data.text ?? "";
}

export async function submitAnswer(
  questionId: string,
  params: { transcriptText?: string; audioBlob?: Blob; durationSeconds?: number }
) {
  const form = new FormData();
  if (params.transcriptText) form.append("transcriptText", params.transcriptText);
  if (params.durationSeconds != null) {
    form.append("durationSeconds", String(params.durationSeconds));
  }
  if (params.audioBlob) {
    form.append("audio", params.audioBlob, "answer.webm");
  }
  const res = await api.postForm<BackendEnvelope<AnswerSubmitResponse>>(
    `/questions/${questionId}/answer`,
    form
  );
  return res.data;
}

export async function generateReport(sessionId: string) {
  const res = await api.post<BackendEnvelope<SessionReportDto>>(
    `/sessions/${sessionId}/report`,
    {}
  );
  return res.data;
}

export async function getReport(sessionId: string) {
  const res = await api.get<BackendEnvelope<SessionReportDto>>(`/sessions/${sessionId}/report`);
  return res.data;
}

export async function submitSystemDesign(sessionId: string, canvasDataJson: object) {
  const res = await api.post<BackendEnvelope<unknown>>(
    `/sessions/${sessionId}/system-design`,
    { canvasDataJson }
  );
  return res.data;
}
