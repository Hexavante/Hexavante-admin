import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerModerator } from "@/lib/api-auth";
import { getPlatformModerationStats } from "@/services/moderation-admin.service";

export const GET = withApiErrorHandling(async (req) => {
  await requireBearerModerator(req);
  const stats = await getPlatformModerationStats();
  return NextResponse.json(stats);
});
