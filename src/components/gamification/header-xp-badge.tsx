import Link from "next/link";
import { getUserXpProfile } from "@/services/xp.service";

type Props = {
  userId: string;
};

export async function HeaderXpBadge({ userId }: Props) {
  let profile = null;

  try {
    profile = await getUserXpProfile(userId);
  } catch {
    profile = null;
  }

  if (!profile) {
    return (
      <Link
        href="/perfil"
        className="hidden min-h-11 items-center rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-200 hover:bg-red-500/15 md:inline-flex"
        title="Não foi possível carregar o XP"
      >
        XP indisponível
      </Link>
    );
  }

  return (
    <Link href="/perfil" className="hx-header-xp" title="Ver perfil e XP">
      <div className="hx-header-xp-meta">
        <span className="hx-header-xp-level">Nível {profile.level}</span>
        <span className="hx-header-xp-count">
          {profile.currentXp}/{profile.xpToNextLevel} XP
        </span>
      </div>
      <div
        className="hx-progress-track hx-header-xp-track"
        role="progressbar"
        aria-valuenow={profile.progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso de XP: ${profile.progressPercent}%`}
      >
        <div className="hx-progress-fill" style={{ width: `${profile.progressPercent}%` }} />
      </div>
    </Link>
  );
}
