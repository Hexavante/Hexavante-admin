import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { serializeLessonDetail } from "@/lib/api-serialize";
import { getLessonWithAccess } from "@/services/enrollment.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, lessonId } = await ctx.params;

  try {
    const data = await getLessonWithAccess(userId, slug, lessonId);
    if (!data) {
      throw new ApiError(404, "Aula não encontrada");
    }

    return NextResponse.json(serializeLessonDetail(data));
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(403, e.message);
    }
    throw e;
  }
});
