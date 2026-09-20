import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { submitExamSchema } from "@/lib/validations/exam";
import { getExamBySlug, submitAttempt } from "@/services/exam.service";
import { prisma } from "@/lib/prisma";

async function assertAttemptForSlug(userId: string, slug: string, attemptId: string) {
  const exam = await getExamBySlug(slug);
  if (!exam || !exam.isPublished) {
    throw new ApiError(404, "Simulado não encontrado");
  }

  const attempt = await prisma.examAttempt.findFirst({
    where: { id: attemptId, userId, examId: exam.id },
  });

  if (!attempt) {
    throw new ApiError(404, "Tentativa não encontrada");
  }

  return { exam, attempt };
}

export const PUT = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, id: attemptId } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = submitExamSchema.safeParse({ ...(body as object), attemptId });
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  await assertAttemptForSlug(userId, slug, attemptId);

  try {
    const result = await submitAttempt(userId, attemptId, {
      answers: parsed.data.answers,
      essays: parsed.data.essays,
    });

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
