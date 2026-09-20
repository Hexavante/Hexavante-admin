import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { assertUserCanInteract } from "@/lib/moderation/status";
import { toggleActivityLike } from "@/services/social.service";

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id: activityId } = await ctx.params;

  try {
    await assertUserCanInteract(userId);
    const result = await toggleActivityLike(activityId, userId);
    return NextResponse.json({ success: true, liked: result.liked });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
