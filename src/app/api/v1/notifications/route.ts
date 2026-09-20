import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { serializeNotification } from "@/lib/api-serialize";
import {
  getRecentNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
} from "@/services/notification.service";

export const GET = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);
  const limit = Math.min(Number(new URL(req.url).searchParams.get("limit") ?? 10), 50);

  const [notifications, unreadCount] = await Promise.all([
    getRecentNotifications(userId, limit),
    getUnreadNotificationCount(userId),
  ]);

  return NextResponse.json({
    notifications: notifications.map(serializeNotification),
    unreadCount,
  });
});

export const PATCH = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);
  await markAllNotificationsRead(userId);
  return NextResponse.json({ success: true });
});
