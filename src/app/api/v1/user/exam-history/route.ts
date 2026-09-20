import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { listUserAttemptsFiltered } from "@/services/exam.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const { searchParams } = new URL(req.url);

  const examType = searchParams.get("examType") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") ?? "10") || 10));

  const result = await listUserAttemptsFiltered(userId, { examType, page, pageSize });

  return NextResponse.json({
    attempts: result.attempts.map((attempt) => ({
      id: attempt.id,
      score: attempt.score,
      correctAnswers: attempt.correctAnswers,
      totalQuestions: attempt.totalQuestions,
      studyMode: attempt.studyMode,
      finishedAt: attempt.finishedAt?.toISOString() ?? null,
      exam: {
        id: attempt.exam.id,
        title: attempt.exam.title,
        slug: attempt.exam.slug,
        examType: attempt.exam.examType,
      },
    })),
    pagination: {
      page: result.page,
      pageSize: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});
