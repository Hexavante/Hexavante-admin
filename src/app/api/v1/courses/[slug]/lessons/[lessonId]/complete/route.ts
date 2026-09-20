import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getApprovedCourseBySlug } from "@/services/course.service";
import { markLessonComplete } from "@/services/enrollment.service";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug, lessonId } = await ctx.params;

  const course = await getApprovedCourseBySlug(slug);
  if (!course) {
    throw new ApiError(404, "Curso não encontrado");
  }

  try {
    const result = await markLessonComplete(userId, lessonId, course.id);
    return NextResponse.json({
      success: true,
      progress: result.progress,
      totalXpEarned: result.totalXpEarned,
      xpAwards: result.xpAwards,
    });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
