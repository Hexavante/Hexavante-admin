import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerModerator } from "@/lib/api-auth";
import { listModerationLogs } from "@/services/moderation-admin.service";

export const GET = withApiErrorHandling(async (req) => {
  await requireBearerModerator(req);
  const { searchParams } = new URL(req.url);

  const logs = await listModerationLogs({
    type: searchParams.get("type") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    limit: Number(searchParams.get("limit") ?? 100),
  });

  return NextResponse.json({ logs });
});
