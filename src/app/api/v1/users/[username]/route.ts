import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { getOptionalBearerAuth } from "@/lib/api-auth";
import { getPublicProfile } from "@/services/public-profile.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const { username } = await ctx.params;
  const viewerId = await getOptionalBearerAuth(req);

  const profile = await getPublicProfile(username, viewerId ? { id: viewerId } : undefined);
  if (!profile) {
    throw new ApiError(404, "Usuário não encontrado");
  }

  return NextResponse.json(profile);
});
