import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getUnreadDirectMessageCount } from "@/services/direct-message.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const unreadCount = await getUnreadDirectMessageCount(userId);
  return NextResponse.json({ unreadCount });
});
