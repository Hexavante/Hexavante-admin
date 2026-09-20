import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { getOptionalBearerAuth } from "@/lib/api-auth";
import { serializeExamDetail } from "@/lib/api-serialize";
import { getExamBySlug, getUserExamPerformance } from "@/services/exam.service";
import { canAccessPremiumExam } from "@/services/premium.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const { slug } = await ctx.params;
  const exam = await getExamBySlug(slug);

  if (!exam || !exam.isPublished) {
    throw new ApiError(404, "Simulado não encontrado");
  }

  const userId = await getOptionalBearerAuth(req);
  let performance = null;
  let canAccess = !exam.isPremiumOnly;

  if (userId) {
    canAccess = !exam.isPremiumOnly || (await canAccessPremiumExam(userId, exam));
    performance = await getUserExamPerformance(userId, exam.id);
  }

  return NextResponse.json({
    exam: serializeExamDetail(exam),
    canAccess,
    performance,
  });
});
