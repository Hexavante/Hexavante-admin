import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getCoinHistory } from "@/services/wallet.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));

  const history = await getCoinHistory(userId, limit);

  return NextResponse.json({
    history: history.map((entry) => ({
      id: entry.id,
      amount: entry.amount,
      type: entry.type,
      source: entry.source,
      description: entry.description,
      createdAt: entry.createdAt.toISOString(),
    })),
  });
});
