import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { toggleLessonFavorite } from "@/services/lesson-learning.service";
import { getLessonWithAccess } from "@/services/enrollment.service";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, lessonId } = await ctx.params;

  const data = await getLessonWithAccess(userId, slug, lessonId);
  if (!data) {
    throw new ApiError(404, "Aula não encontrada");
  }

  try {
    const isFavorite = await toggleLessonFavorite(userId, lessonId);
    return NextResponse.json({ success: true, isFavorite });
  } catch {
    throw new ApiError(500, "Não foi possível atualizar o favorito.");
  }
});
