import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { serializeCourseSummary } from "@/lib/api-serialize";
import { searchApprovedCourses } from "@/services/course.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const level = searchParams.get("level") as "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  const q = searchParams.get("q") ?? undefined;
  const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";

  const courses = await searchApprovedCourses({
    categoryId,
    level: level ?? undefined,
    q,
    sort,
  });

  return NextResponse.json({
    courses: courses.map(serializeCourseSummary),
  });
});
