import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { getOptionalBearerAuth } from "@/lib/api-auth";
import { serializeExamSummary } from "@/lib/api-serialize";
import { searchPublishedExams } from "@/services/exam.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const userId = await getOptionalBearerAuth(req);
  const { searchParams } = new URL(req.url);
  const examType = searchParams.get("examType") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const sort = searchParams.get("sort") === "popular" ? "popular" : "recent";

  const exams = await searchPublishedExams({ examType, q, sort }, userId ?? undefined);

  return NextResponse.json({
    exams: exams.map(serializeExamSummary),
  });
});
