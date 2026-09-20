import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { getOptionalBearerAuth, requireBearerAuth } from "@/lib/api-auth";
import { assertUserCanInteract, assertUserNotBanned } from "@/lib/moderation/status";
import { followUser, isFollowing, unfollowUser } from "@/services/follow.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const { userId: targetUserId } = await ctx.params;
  const viewerId = await getOptionalBearerAuth(req);

  if (!viewerId) {
    return NextResponse.json({ following: false });
  }

  const following = await isFollowing(viewerId, targetUserId);
  return NextResponse.json({ following });
});

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { userId: targetUserId } = await ctx.params;

  try {
    await assertUserNotBanned(userId);
    await assertUserCanInteract(userId);

    const alreadyFollowing = await isFollowing(userId, targetUserId);
    if (alreadyFollowing) {
      await unfollowUser(userId, targetUserId);
      return NextResponse.json({ success: true, following: false });
    }

    await followUser(userId, targetUserId);
    return NextResponse.json({ success: true, following: true });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
