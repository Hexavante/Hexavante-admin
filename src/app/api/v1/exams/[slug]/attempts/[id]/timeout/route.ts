import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { submitExamSchema } from "@/lib/validations/exam";
import { getExamBySlug, submitAttempt } from "@/services/exam.service";
import { prisma } from "@/lib/prisma";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, id: attemptId } = await ctx.params;

  const exam = await getExamBySlug(slug);
  if (!exam || !exam.isPublished) {
    throw new ApiError(404, "Simulado não encontrado");
  }

  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId, examId: exam.id, finishedAt: null },
  });
  if (!attempt) {
    throw new ApiError(404, "Tentativa não encontrada");
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // respostas parciais permitidas
  }

  const parsed = submitExamSchema.safeParse({
    ...(typeof body === "object" && body ? body : {}),
    attemptId,
  });

  const answers = parsed.success ? parsed.data.answers : {};
  const essays = parsed.success ? parsed.data.essays : {};

  try {
    const result = await submitAttempt(
      userId,
      attemptId,
      { answers, essays },
      { allowPartial: true },
    );

    return NextResponse.json({
      success: true,
      result: {
        attemptId: result.attemptId,
        score: result.score,
        correct: result.correct,
        total: result.total,
        mcTotal: result.mcTotal,
        pendingEssays: result.pendingEssays,
        xpEarned: result.xpEarned,
        coinsEarned: result.coinsEarned,
        dailyAttemptIndex: result.dailyAttemptIndex,
        dailyRewardMultiplier: result.dailyRewardMultiplier,
      },
    });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
