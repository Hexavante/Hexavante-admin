import Link from "next/link";
import { Award, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LeagueBadge } from "@/components/ranking/league-badge";
import { resolveProfileFrame, getAvatarBorderClassName } from "@/lib/cosmetics";
import type { RankingEntry } from "@/services/xp.service";

type Props = {
  entry: RankingEntry;
  position: number;
  isCurrentUser: boolean;
  showTotalXp: boolean;
  showLeague?: boolean;
};

export function RankingRow({
  entry,
  position,
  isCurrentUser,
  showTotalXp,
  showLeague = false,
}: Props) {
  const frame = resolveProfileFrame(entry.frameId);
  const borderClassName = getAvatarBorderClassName(entry.borderId);

  return (
    <li>
      <Link
        href={`/perfil/${entry.user.username}`}
        className={`flex items-center gap-4 border-b border-[hsl(var(--sidebar-border))] px-4 py-4 transition last:border-b-0 hover:bg-[hsl(var(--sidebar-accent)/0.35)] ${
          isCurrentUser ? "bg-[hsl(var(--sidebar-highlight)/0.1)]" : ""
        }`}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-sm font-bold text-slate-400">
          {position}
        </div>

        <div
          className={`relative shrink-0 rounded-xl ${frame?.animationClass ?? ""}`}
          style={frame?.style}
        >
          <Avatar
            src={entry.user.avatarUrl}
            alt={entry.user.username ?? ""}
            size="sm"
            borderClassName={borderClassName}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-white">{entry.user.fullName}</p>
            {entry.badgeLabel && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-200">
                <Award className="h-3 w-3" />
                {entry.badgeLabel}
              </span>
            )}
            {isCurrentUser && <Badge variant="sky">Você</Badge>}
            {showLeague && entry.league && <LeagueBadge league={entry.league} />}
          </div>
          <p className="truncate text-sm text-slate-400">@{entry.user.username}</p>
          <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
            <Sparkles className="h-4 w-4 hx-accent-text" />
            Nível {entry.level}
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold hx-accent-text">{entry.periodXp.toLocaleString("pt-BR")} XP</p>
          {showTotalXp && (
            <p className="text-xs text-slate-500">Total: {entry.totalXp.toLocaleString("pt-BR")}</p>
          )}
        </div>
      </Link>
    </li>
  );
}
