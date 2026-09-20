import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { extractClientIp, rateLimitSearch } from "@/lib/rate-limit";
import { searchApprovedCourses } from "@/services/course.service";
import { searchPublishedExams } from "@/services/exam.service";

export const GET = withApiErrorHandling(async (req) => {
  const ip = extractClientIp(
    req.headers.get("x-forwarded-for"),
    req.headers.get("x-real-ip"),
  );
  if (!rateLimitSearch(ip)) {
    throw new ApiError(429, "Muitas requisições");
  }

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (q.length > 100) {
    return NextResponse.json({ results: [] });
  }

  const [courses, exams] = await Promise.all([
    searchApprovedCourses({ q, sort: "popular" }),
    searchPublishedExams({ q, sort: "popular" }),
  ]);

  const results = [
    ...courses.slice(0, 4).map((course) => ({
      title: course.title,
      slug: course.slug,
      href: `/courses/${course.slug}`,
      type: "curso" as const,
    })),
    ...exams.slice(0, 4).map((exam) => ({
      title: exam.title,
      slug: exam.slug,
      href: `/simulados/${exam.slug}`,
      type: "simulado" as const,
    })),
  ].slice(0, 8);

  return NextResponse.json({ results });
});
