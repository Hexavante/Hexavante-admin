import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { getUserCoinProfile } from "@/services/wallet.service";
import { getUserXpProfile } from "@/services/xp.service";

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  const [coins, xp] = await Promise.all([
    getUserCoinProfile(userId),
    getUserXpProfile(userId),
  ]);

  return NextResponse.json({
    coins: coins.coins,
    coinMultiplier: coins.coinMultiplier,
    activeBooster: coins.activeBooster,
    boosterMultiplier: coins.boosterMultiplier,
    boosterExpiresAt: coins.boosterExpiresAt?.toISOString() ?? null,
    isPremium: coins.isPremium,
    premiumExpiresAt: coins.premiumExpiresAt?.toISOString() ?? null,
    xp: xp
      ? {
          level: xp.level,
          currentXp: xp.currentXp,
          totalXp: xp.totalXp,
          progressPercent: xp.progressPercent,
          xpToNextLevel: xp.xpToNextLevel,
        }
      : null,
  });
});
