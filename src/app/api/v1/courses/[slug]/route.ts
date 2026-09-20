import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { getOptionalBearerAuth } from "@/lib/api-auth";
import { serializeCourseDetail } from "@/lib/api-serialize";
import { getApprovedCourseBySlug } from "@/services/course.service";
import { getEnrollment } from "@/services/enrollment.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const { slug } = await ctx.params;
  const course = await getApprovedCourseBySlug(slug);

  if (!course) {
    throw new ApiError(404, "Curso não encontrado");
  }

  const userId = await getOptionalBearerAuth(req);
  let enrollment: { progress: number } | null = null;
  if (userId) {
    const row = await getEnrollment(userId, course.id);
    if (row) enrollment = { progress: row.progress };
  }

  return NextResponse.json({
    course: serializeCourseDetail(course),
    enrollment,
  });
});
