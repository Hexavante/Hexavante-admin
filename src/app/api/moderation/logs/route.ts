import { getAdminSession } from "@/lib/admin-auth";
import { canModerate } from "@/lib/permissions";
import { readLimitParam } from "@/lib/api-params";
import { listModerationLogs } from "@/services/moderation-admin.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session?.id || !canModerate(session.roles)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const logs = await listModerationLogs({
    type: searchParams.get("type") ?? undefined,
    search: searchParams.get("search") ?? undefined,
    limit: readLimitParam(searchParams, 100, 200),
  });

  return NextResponse.json({ logs });
}
