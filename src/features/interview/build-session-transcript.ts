import type { InterviewQuestionDto } from "@/features/backend/types";
import type { TranscriptEntry } from "@/components/interview/transcript-panel";

/** Only show Q&A up to the active question; hide later questions until reached. */
export function buildSessionTranscript(
  questions: InterviewQuestionDto[],
  activeQuestionId: string | null,
  liveCaption?: string,
): TranscriptEntry[] {
  const sorted = [...questions].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );
  const total = sorted.length;
  const entries: TranscriptEntry[] = [];

  for (const q of sorted) {
    const qNum =
      q.orderIndex ??
      sorted.findIndex((x) => x.id === q.id) + 1;

    if (!q.answer && q.id !== activeQuestionId) {
      break;
    }

    entries.push({
      id: `q-${q.id}`,
      speaker: "ai",
      text: q.questionText,
      isFinal: true,
      label: `Question ${qNum} of ${total}`,
    });

    const answerText = q.answer?.transcriptText?.trim();
    if (answerText) {
      entries.push({
        id: `a-${q.id}`,
        speaker: "candidate",
        text: answerText,
        isFinal: true,
        label: "Your answer",
      });
    } else if (q.answer?.audioFileUrl) {
      entries.push({
        id: `a-${q.id}`,
        speaker: "candidate",
        text: "Voice answer (submitted)",
        isFinal: true,
        label: "Your answer",
      });
    } else if (q.id === activeQuestionId && liveCaption?.trim()) {
      entries.push({
        id: `live-${q.id}`,
        speaker: "candidate",
        text: liveCaption.trim(),
        isFinal: false,
        label: "Live captions",
      });
    }

    if (!q.answer && q.id === activeQuestionId) {
      break;
    }
  }

  return entries;
}

export function questionProgressLabel(
  questions: InterviewQuestionDto[],
  activeQuestion: InterviewQuestionDto | null,
): { current: number; total: number; label: string } {
  const sorted = [...questions].sort(
    (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
  );
  const total = sorted.length;
  if (!total) {
    return { current: 0, total: 0, label: "No questions" };
  }
  if (!activeQuestion) {
    return { current: total, total, label: `Complete · ${total} question${total === 1 ? "" : "s"}` };
  }
  const idx = sorted.findIndex((q) => q.id === activeQuestion.id);
  const current =
    activeQuestion.orderIndex ?? (idx >= 0 ? idx + 1 : 1);
  return {
    current,
    total,
    label: `Question ${current} of ${total}`,
  };
}
