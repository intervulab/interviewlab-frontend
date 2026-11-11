import type { RealTimeMetrics } from "@/types/api.types";

export interface AuthPayload {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    profile?: {
      firstName: string;
      lastName: string;
      targetRole?: string | null;
    };
  };
}

export interface InterviewQuestionDto {
  id: string;
  questionText: string;
  orderIndex: number;
  category: string;
  difficulty: string;
  agentQuestionId?: string | null;
  answer?: {
    id: string;
    transcriptText?: string | null;
    audioAnalysis?: {
      speechPaceWpm?: number;
      fillerWordsCount?: number;
      hesitationCount?: number;
      clarityScore?: number;
      rawMetricsJson?: Record<string, unknown>;
    } | null;
    evaluation?: {
      technicalScore: number;
      clarityScore: number;
      feedbackText: string;
      strengths: string[];
      improvements: string[];
    } | null;
  } | null;
}

export interface InterviewSessionDto {
  id: string;
  title: string;
  targetRole: string;
  status: string;
  questions: InterviewQuestionDto[];
}

export interface AnswerSubmitResponse {
  answer: InterviewQuestionDto["answer"];
  agent?: {
    evaluation?: {
      score: number;
      feedback: string;
      follow_up_question?: string | null;
    };
    next_question?: { text: string; question_id: string } | null;
    session_complete?: boolean;
  };
  realTimeMetrics?: RealTimeMetrics;
}

export interface SessionReportDto {
  overallScore: number;
  technicalSummary: string;
  behavioralSummary: string;
  recommendation: string;
  detailedFeedback: Record<string, unknown>;
}
