import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: "default" | "yellow" | "red" | "teal" | "green" | "emerald" | "sky" | "violet" | "amber" | "orange";
  subtitle?: string;
  trend?: string;
};

const colors = {
  default: "hx-accent-text",
  yellow: "text-amber-300",
  red: "text-red-300",
  teal: "text-teal-300",
  green: "text-emerald-300",
  emerald: "text-emerald-300",
  sky: "text-sky-300",
  violet: "text-violet-300",
  amber: "text-amber-300",
  orange: "text-orange-300",
};

const iconBgColors = {
  default: "bg-[hsl(var(--sidebar-highlight)/0.1)] border-[hsl(var(--sidebar-highlight)/0.2)] text-[hsl(var(--sidebar-highlight))]",
  yellow: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  red: "bg-red-500/10 border-red-500/20 text-red-400",
  teal: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  green: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  sky: "bg-sky-500/10 border-sky-500/20 text-sky-400",
  violet: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
};

export function StatCard({ icon: Icon, label, value, color = "default", subtitle, trend }: Props) {
  return (
    <div className={cn(
      "hx-stat",
      "transition-all duration-200",
      "hover:border-[hsl(var(--sidebar-highlight)/0.25)] hover:bg-[hsl(var(--sidebar-accent)/0.5)]",
      "hover:shadow-[0_4px_16px_-4px_rgb(0_0_0/0.3)]"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn(
            "hx-icon-box h-9 w-9 rounded-xl flex-shrink-0",
            iconBgColors[color]
          )}>
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-300 truncate">{label}</p>
            {trend && (
              <p className="mt-0.5 text-xs text-emerald-400 font-medium">{trend}</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p className={cn("text-3xl font-bold tracking-tight", colors[color])}>
          {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
        </p>
        {subtitle && (
          <p className="mt-1.5 text-xs text-slate-400">{subtitle}</p>
        )}
      </div>
    </div>
  );
}