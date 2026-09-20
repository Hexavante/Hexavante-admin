import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerModerator } from "@/lib/api-auth";
import { listModerationUsers } from "@/services/moderation-admin.service";

export const GET = withApiErrorHandling(async (req) => {
  await requireBearerModerator(req);
  const { searchParams } = new URL(req.url);

  const users = await listModerationUsers({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    limit: Number(searchParams.get("limit") ?? 50),
  });

  return NextResponse.json({ users });
});
