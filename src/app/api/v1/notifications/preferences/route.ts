import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import {
  getUserNotificationSettings,
  updateUserNotificationSettings,
  type UserNotificationSettingsView,
} from "@/services/notification-preferences.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const settings = await getUserNotificationSettings(userId);
  return NextResponse.json({ settings });
});

export const PUT = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  if (!body || typeof body !== "object") {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const settings = await updateUserNotificationSettings(
    userId,
    body as Partial<UserNotificationSettingsView>,
  );

  return NextResponse.json({ success: true, settings });
});
