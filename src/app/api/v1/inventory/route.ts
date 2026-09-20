import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getUserInventory } from "@/services/shop.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);
  const inventory = await getUserInventory(userId);

  return NextResponse.json({
    items: inventory.map((entry) => ({
      id: entry.id,
      storeItemId: entry.storeItemId,
      isEquipped: entry.isEquipped,
      purchasedAt: entry.purchasedAt.toISOString(),
      expiresAt: entry.expiresAt?.toISOString() ?? null,
      item: entry.storeItem,
    })),
  });
});
