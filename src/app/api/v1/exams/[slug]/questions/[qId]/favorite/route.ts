import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { toggleExamQuestionFavorite } from "@/services/exam-learning.service";
import { getExamBySlug } from "@/services/exam.service";
import { prisma } from "@/lib/prisma";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, qId } = await ctx.params;

  const exam = await getExamBySlug(slug);
  if (!exam || !exam.isPublished) {
    throw new ApiError(404, "Simulado não encontrado");
  }

  const question = await prisma.examQuestion.findFirst({
    where: { id: qId, examId: exam.id },
    select: { id: true },
  });
  if (!question) {
    throw new ApiError(404, "Questão não encontrada");
  }

  try {
    const isFavorite = await toggleExamQuestionFavorite(userId, qId);
    return NextResponse.json({ success: true, isFavorite });
  } catch {
    throw new ApiError(500, "Não foi possível atualizar o favorito.");
  }
});
