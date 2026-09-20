import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getLessonNote, saveLessonNote } from "@/services/lesson-learning.service";
import { getLessonWithAccess } from "@/services/enrollment.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, lessonId } = await ctx.params;

  const data = await getLessonWithAccess(userId, slug, lessonId);
  if (!data) {
    throw new ApiError(404, "Aula não encontrada");
  }

  const content = await getLessonNote(userId, lessonId);
  return NextResponse.json({ content: content ?? "" });
});

export const PUT = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, lessonId } = await ctx.params;

  const data = await getLessonWithAccess(userId, slug, lessonId);
  if (!data) {
    throw new ApiError(404, "Aula não encontrada");
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const content =
    body && typeof body === "object" && "content" in body
      ? String((body as { content: unknown }).content ?? "")
      : "";

  if (content.length > 5000) {
    throw new ApiError(400, "A nota pode ter no máximo 5.000 caracteres.");
  }

  try {
    await saveLessonNote(userId, lessonId, content);
    return NextResponse.json({ success: true });
  } catch {
    throw new ApiError(500, "Não foi possível salvar a nota.");
  }
});
