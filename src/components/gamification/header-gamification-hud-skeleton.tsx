import { Skeleton } from "@/components/ui/skeleton";

export function HeaderGamificationHudSkeleton() {
  return (
    <div className="hx-header-hud" aria-hidden>
      <Skeleton className="hx-header-hud-coins-skeleton" />
      <Skeleton className="hx-header-hud-xp-skeleton" />
    </div>
  );
}
