import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { buildExamTakingPayload, resolveExamStudyMode } from "@/lib/api-exam";
import { getExamBySlug } from "@/services/exam.service";

const startAttemptSchema = z.object({
  mode: z.enum(["FULL", "REINFORCEMENT", "FAVORITES"]).optional(),
});

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug } = await ctx.params;

  const exam = await getExamBySlug(slug);
  if (!exam || !exam.isPublished) {
    throw new ApiError(404, "Simulado não encontrado");
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // body opcional
  }

  const parsed = startAttemptSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  const mode = await resolveExamStudyMode(parsed.data.mode);

  try {
    const payload = await buildExamTakingPayload(userId, slug, mode);
    if (!payload) {
      throw new ApiError(404, "Simulado não disponível");
    }

    return NextResponse.json(payload, { status: 201 });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
