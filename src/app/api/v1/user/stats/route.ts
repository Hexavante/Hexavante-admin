import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getPersonalStats } from "@/services/personal-stats.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);
  const stats = await getPersonalStats(userId);
  return NextResponse.json(stats);
});
