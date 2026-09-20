"use client";

import type { ActivityReactionType } from "@prisma/client";

const REACTION_CONFIG: Record<ActivityReactionType, { label: string; emoji: string }> = {
  CLAP: { label: "Aplauso", emoji: "\uD83D\uDC4F" },
  FIRE: { label: "Fogo", emoji: "\uD83D\uDD25" },
  IDEA: { label: "Ideia", emoji: "\uD83D\uDCA1" },
};

type Props = {
  activityId: string;
  counts: Record<ActivityReactionType, number>;
  viewerReactions: ActivityReactionType[];
  canInteract: boolean;
};

export function ActivityReactions({
  counts,
  viewerReactions,
}: Props) {
  const hasReactions = Object.values(counts).some((c) => c > 0);
  if (!hasReactions) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {(Object.keys(REACTION_CONFIG) as ActivityReactionType[]).map((type) => {
        const config = REACTION_CONFIG[type];
        const count = counts[type];
        if (count <= 0) return null;
        return (
          <span
            key={type}
            className="inline-flex items-center gap-1 rounded-full bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-400"
            title={config.label}
          >
            <span aria-hidden>{config.emoji}</span>
            <span>{count}</span>
          </span>
        );
      })}
    </div>
  );
}
