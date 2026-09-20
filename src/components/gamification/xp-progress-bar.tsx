type Props = {
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  progressPercent: number;
  compact?: boolean;
};

export function XpProgressBar({
  level,
  currentXp,
  xpToNextLevel,
  progressPercent,
  compact = false,
}: Props) {
  if (compact) {
    return (
      <div className="flex w-full min-w-[8.75rem] flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold hx-accent-text">Nível {level}</span>
          <span className="text-[hsl(var(--sidebar-foreground)/0.72)]">
            {currentXp}/{xpToNextLevel} XP
          </span>
        </div>
        <div
          className="hx-progress-track h-2 relative overflow-visible"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso de XP: ${progressPercent}%`}
        >
          <div className="hx-progress-fill" style={{ width: `${progressPercent}%` }} />
          <div className="xp-neon-dot" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-lg font-bold hx-accent-text">Nível {level}</span>
        <span className="text-[hsl(var(--sidebar-foreground)/0.72)]">
          {currentXp} / {xpToNextLevel} XP
        </span>
      </div>
      <div
        className="hx-progress-track h-4 relative overflow-visible"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso de XP: ${progressPercent}%`}
      >
        <div className="hx-progress-fill" style={{ width: `${progressPercent}%` }} />
        <div className="xp-neon-dot" />
      </div>
      <p className="mt-2 text-xs font-medium text-[hsl(var(--sidebar-foreground)/0.55)]">
        {progressPercent}% para o próximo nível
      </p>
    </div>
  );
}
