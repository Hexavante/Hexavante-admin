import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getShopState } from "@/services/shop.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const state = await getShopState(userId);
  return NextResponse.json(state);
});
