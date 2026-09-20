import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getApprovedCourseBySlug } from "@/services/course.service";
import { enrollInCourse } from "@/services/enrollment.service";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { slug } = await ctx.params;

  const course = await getApprovedCourseBySlug(slug);
  if (!course) {
    throw new ApiError(404, "Curso não encontrado");
  }

  try {
    const enrollment = await enrollInCourse(userId, course.id);
    return NextResponse.json(
      {
        success: true,
        enrollment: {
          id: enrollment.id,
          courseId: course.id,
          courseSlug: course.slug,
          progress: enrollment.progress,
        },
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
