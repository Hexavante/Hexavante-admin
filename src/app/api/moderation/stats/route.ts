import { getAdminSession } from "@/lib/admin-auth";
import { canModerate } from "@/lib/permissions";
import { getPlatformModerationStats } from "@/services/moderation-admin.service";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAdminSession();
  if (!session?.id || !canModerate(session.roles)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const stats = await getPlatformModerationStats();
  return NextResponse.json(stats);
}
