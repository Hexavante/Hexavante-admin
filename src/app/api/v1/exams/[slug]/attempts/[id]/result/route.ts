import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { serializeAttemptResult } from "@/lib/api-serialize";
import { EXAM_PASS_SCORE } from "@/lib/gamification";
import { getAttemptResult } from "@/services/exam.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, id: attemptId } = await ctx.params;

  const attempt = await getAttemptResult(userId, attemptId);
  if (!attempt || attempt.exam.slug !== slug) {
    throw new ApiError(404, "Resultado não encontrado");
  }

  if (!attempt.finishedAt) {
    throw new ApiError(409, "Esta tentativa ainda não foi finalizada");
  }

  const serialized = serializeAttemptResult(attempt);
  const passed =
    attempt.score >= EXAM_PASS_SCORE && serialized.pendingEssays === 0;

  return NextResponse.json({
    ...serialized,
    passed,
  });
});
