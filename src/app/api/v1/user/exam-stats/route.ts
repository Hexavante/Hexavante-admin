import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getUserExamEvolution, getUserExamStats } from "@/services/exam.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  const [stats, evolution] = await Promise.all([
    getUserExamStats(userId),
    getUserExamEvolution(userId, 10),
  ]);

  return NextResponse.json({
    stats,
    evolution: evolution.map((row) => ({
      score: row.score,
      finishedAt: row.finishedAt?.toISOString() ?? null,
      examTitle: row.exam.title,
    })),
  });
});
