import Link from "next/link";
import { Coins } from "lucide-react";
import { BoosterIndicator } from "@/components/gamification/booster-indicator";
import { CoinExplosion } from "@/components/gamification/coin-explosion";
import { getUserXpProfile } from "@/services/xp.service";
import { getUserCoinProfile, getUserWallet } from "@/services/wallet.service";

type Props = {
  userId: string;
};

export async function HeaderGamificationHud({ userId }: Props) {
  const [coinResult, xpProfile] = await Promise.all([
    loadCoins(userId),
    getUserXpProfile(userId).catch(() => null),
  ]);

  return (
    <div className="hx-header-hud">
      {coinResult.booster ? (
        <BoosterIndicator
          multiplier={coinResult.booster.multiplier}
          expiresAt={coinResult.booster.expiresAt}
        />
      ) : null}

      {coinResult.failed ? (
        <Link href="/shop" className="hx-header-hud-coins hx-header-hud-coins--error" title="Saldo indisponível">
          <Coins className="hx-header-hud-coins-icon" aria-hidden />
          <span>—</span>
        </Link>
      ) : (
        <CoinExplosion>
          <Link href="/shop" className="hx-header-hud-coins" title="Suas moedas">
            <Coins className="hx-header-hud-coins-icon" aria-hidden />
            <span className="hx-header-hud-coins-value">{coinResult.coins.toLocaleString("pt-BR")}</span>
          </Link>
        </CoinExplosion>
      )}

      {xpProfile ? (
        <Link href="/perfil" className="hx-header-hud-xp" title="Ver perfil e XP">
          <div className="hx-header-hud-xp-row">
            <span className="hx-header-hud-xp-level">Nível {xpProfile.level}</span>
            <span className="hx-header-hud-xp-count">
              {xpProfile.currentXp}/{xpProfile.xpToNextLevel} XP
            </span>
          </div>
          <div
            className="hx-progress-track hx-header-hud-xp-track relative overflow-visible"
            role="progressbar"
            aria-valuenow={xpProfile.progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progresso de XP: ${xpProfile.progressPercent}%`}
          >
            <div className="hx-progress-fill" style={{ width: `${xpProfile.progressPercent}%` }} />
            <div className="xp-neon-dot" />
          </div>
        </Link>
      ) : (
        <Link href="/perfil" className="hx-header-hud-xp hx-header-hud-xp--error" title="XP indisponível">
          XP —
        </Link>
      )}
    </div>
  );
}

async function loadCoins(userId: string) {
  try {
    const profile = await getUserCoinProfile(userId);
    return {
      failed: false as const,
      coins: profile.coins,
      booster:
        profile.boosterMultiplier > 1 && profile.boosterExpiresAt
          ? {
              multiplier: profile.boosterMultiplier,
              expiresAt: profile.boosterExpiresAt.toISOString(),
            }
          : null,
    };
  } catch {
    try {
      const wallet = await getUserWallet(userId);
      return { failed: false as const, coins: wallet.coins, booster: null };
    } catch {
      return { failed: true as const, coins: 0, booster: null };
    }
  }
}
