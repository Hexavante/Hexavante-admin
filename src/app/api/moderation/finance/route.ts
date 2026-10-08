import { getAdminSession } from "@/lib/admin-auth";
import { isAdmin } from "@/lib/permissions";
import { readLimitParam, readPageParam } from "@/lib/api-params";
import { listFinanceTransactions, type FinanceKind } from "@/services/moderation-finance.service";
import { NextResponse } from "next/server";

/** Ledger de XP/moedas — restrito a ADMIN/SUPERADMIN. */
export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session?.id || !isAdmin(session.roles)) {
    return NextResponse.json({ error: "Acesso restrito a administradores." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const kind: FinanceKind = searchParams.get("type") === "coins" ? "coins" : "xp";
  const search = searchParams.get("search")?.trim() || undefined;

  const result = await listFinanceTransactions({
    kind,
    page: readPageParam(searchParams),
    pageSize: readLimitParam(searchParams, 25, 100),
    search,
  });

  return NextResponse.json(result);
}
