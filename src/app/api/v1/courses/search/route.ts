import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { serializeCourseSummary, serializeExamSummary } from "@/lib/api-serialize";
import { extractClientIp, rateLimitSearch } from "@/lib/rate-limit";
import { searchApprovedCourses } from "@/services/course.service";
import { searchPublishedExams } from "@/services/exam.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const ip = extractClientIp(
    req.headers.get("x-forwarded-for"),
    req.headers.get("x-real-ip"),
  );
  if (!rateLimitSearch(ip)) {
    throw new ApiError(429, "Muitas requisições.");
  }

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ courses: [], exams: [] });
  }
  if (q.length > 100) {
    throw new ApiError(400, "Termo de busca muito longo.");
  }

  const [courses, exams] = await Promise.all([
    searchApprovedCourses({ q, sort: "popular" }),
    searchPublishedExams({ q, sort: "popular" }),
  ]);

  return NextResponse.json({
    courses: courses.slice(0, 8).map(serializeCourseSummary),
    exams: exams.slice(0, 8).map(serializeExamSummary),
  });
});
