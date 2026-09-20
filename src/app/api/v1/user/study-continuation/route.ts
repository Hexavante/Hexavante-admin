import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getStudyContinuation } from "@/services/study-continuation.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const continuation = await getStudyContinuation(userId);

  if (!continuation) {
    return NextResponse.json({ continuation: null });
  }

  return NextResponse.json({
    continuation: {
      ...continuation,
      lastStudyAt: continuation.lastStudyAt.toISOString(),
    },
  });
});
