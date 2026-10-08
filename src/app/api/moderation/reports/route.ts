import { getAdminSession } from "@/lib/admin-auth";
import { isAdmin } from "@/lib/permissions";
import { readLimitParam, readPageParam } from "@/lib/api-params";
import {
  listCommunityReports,
  setCommunityReportsStatus,
  type ReportStatusFilter,
} from "@/services/community-reports.service";
import { NextResponse } from "next/server";

const STATUS_FILTERS = new Set(["PENDING", "REVIEWED", "DISMISSED", "all"]);
const ACTIONS: Record<string, "REVIEWED" | "DISMISSED"> = {
  reviewed: "REVIEWED",
  dismissed: "DISMISSED",
};

async function requireAdmin() {
  const session = await getAdminSession();
  if (!session?.id || !isAdmin(session.roles)) return null;
  return session;
}

/** Fila de denúncias paginada — ADMIN+. */
export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const rawStatus = searchParams.get("status") ?? "PENDING";
  const status: ReportStatusFilter = STATUS_FILTERS.has(rawStatus)
    ? (rawStatus as ReportStatusFilter)
    : "PENDING";

  const result = await listCommunityReports({
    status,
    search: searchParams.get("search")?.trim() || undefined,
    page: readPageParam(searchParams),
    pageSize: readLimitParam(searchParams, 25, 100),
  });

  return NextResponse.json(result);
}

/** Atualização em lote (revisar/dispensar) — ADMIN+. */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
  }

  const payload = body as { ids?: unknown; action?: unknown };
  if (!Array.isArray(payload.ids) || payload.ids.length === 0 || payload.ids.length > 200) {
    return NextResponse.json({ error: "Seleção inválida (1 a 200 itens)." }, { status: 400 });
  }
  if (typeof payload.action !== "string" || !(payload.action in ACTIONS)) {
    return NextResponse.json({ error: "Ação inválida." }, { status: 400 });
  }
  const ids = payload.ids.filter((id): id is string => typeof id === "string");
  if (ids.length === 0) {
    return NextResponse.json({ error: "Seleção inválida." }, { status: 400 });
  }

  const updated = await setCommunityReportsStatus(
    ids,
    ACTIONS[payload.action],
    session.id,
  );

  return NextResponse.json({ updated });
}
