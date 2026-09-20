import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { markNotificationRead } from "@/services/notification.service";

export const PATCH = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;
  await markNotificationRead(id, userId);
  return NextResponse.json({ success: true });
});
