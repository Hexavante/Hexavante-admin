import Link from "next/link";
import type { RankingPeriod } from "@/services/xp.service";
import { cn } from "@/lib/cn";
import { themeUi } from "@/lib/theme-ui";

const PERIODS: { value: RankingPeriod; label: string }[] = [
  { value: "month", label: "Temporada" },
  { value: "week", label: "Semanal" },
  { value: "all", label: "Total" },
];

type Props = {
  current: RankingPeriod;
};

export function RankingFilters({ current }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {PERIODS.map((period) => (
        <Link
          key={period.value}
          href={`/ranking?period=${period.value}`}
          className={cn(
            "hx-filter-pill",
            current === period.value ? themeUi.filterActive : themeUi.filterInactive,
          )}
        >
          {period.label}
        </Link>
      ))}
    </div>
  );
}
