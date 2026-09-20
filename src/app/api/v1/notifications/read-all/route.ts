import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { markAllNotificationsRead } from "@/services/notification.service";

export const PATCH = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);
  await markAllNotificationsRead(userId);
  return NextResponse.json({ success: true });
});
