import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { getOptionalBearerAuth } from "@/lib/api-auth";
import { getSocialFeed, type SocialFeedMode } from "@/services/social.service";

function parseMode(value: string | null): SocialFeedMode {
  if (value === "following" || value === "explore") return value;
  return "explore";
}

export const GET = withApiErrorHandling(async (req) => {
  const viewerId = await getOptionalBearerAuth(req);
  const { searchParams } = new URL(req.url);
  const mode = parseMode(searchParams.get("mode"));
  const tag = searchParams.get("tag") ?? undefined;
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? "30") || 30));

  if (mode === "following" && !viewerId) {
    return NextResponse.json({ activities: [] });
  }

  const activities = await getSocialFeed(mode, viewerId ?? undefined, limit, tag);
  return NextResponse.json({ activities });
});
