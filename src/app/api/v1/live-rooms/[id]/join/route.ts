import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { joinLiveRoom } from "@/services/live-room.service";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;

  try {
    await joinLiveRoom(id, userId);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      const status = e.message.includes("acesso") ? 403 : 400;
      throw new ApiError(status, e.message);
    }
    throw e;
  }
});
