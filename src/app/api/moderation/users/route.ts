import { getAdminSession } from "@/lib/admin-auth";
import { canModerate } from "@/lib/permissions";
import { readLimitParam, readPageParam } from "@/lib/api-params";
import { listModerationUsers } from "@/services/moderation-admin.service";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session?.id || !canModerate(session.roles)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 200);

  const result = await listModerationUsers({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    role: searchParams.get("role") ?? undefined,
    limit: ids.length ? 200 : readLimitParam(searchParams, 50, 200),
    page: readPageParam(searchParams),
    ids: ids.length ? ids : undefined,
  });

  return NextResponse.json(result);
}
