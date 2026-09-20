import {
  filterQuestionsByIds,
  resolveAttemptQuestionIds,
} from "@/services/exam-learning.service";
import {
  getActiveAttempt,
  getExamForTaking,
  startAttempt,
  type SubmitAttemptPayload,
} from "@/services/exam.service";
import type { ExamStudyMode } from "@/lib/exam-learning";
import {
  serializeExamAttempt,
  serializeExamQuestionForTaking,
} from "@/lib/api-serialize";

export async function resolveExamStudyMode(value: unknown): Promise<ExamStudyMode> {
  if (value === "REINFORCEMENT" || value === "FAVORITES") return value;
  return "FULL";
}

export async function buildExamTakingPayload(
  userId: string,
  slug: string,
  mode: ExamStudyMode,
) {
  const exam = await getExamForTaking(slug);
  if (!exam || exam.questions.length === 0) {
    return null;
  }

  let attempt = await getActiveAttempt(userId, exam.id);
  if (!attempt) {
    attempt = await startAttempt(userId, exam.id, mode);
  }

  const questionIds = await resolveAttemptQuestionIds(
    userId,
    exam.id,
    attempt.studyMode,
    exam.questions.map((q) => ({
      id: q.id,
      type: q.type,
      subject: q.subject,
      difficulty: q.difficulty,
    })),
  );

  const questions = filterQuestionsByIds(exam.questions, questionIds);

  return {
    attempt: serializeExamAttempt(attempt),
    exam: {
      id: exam.id,
      title: exam.title,
      slug: exam.slug,
      timeLimitMinutes: exam.timeLimit,
    },
    questions: questions.map(serializeExamQuestionForTaking),
  };
}

export type SubmitExamBody = SubmitAttemptPayload & { attemptId: string };
