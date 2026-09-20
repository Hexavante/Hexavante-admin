import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color?: "default" | "yellow" | "red" | "teal" | "green";
  subtitle?: string;
};

const colors = {
  default: "hx-accent-text",
  yellow: "text-amber-300",
  red: "text-red-300",
  teal: "text-teal-300",
  green: "text-emerald-300",
};

export function StatCard({ icon: Icon, label, value, color = "default", subtitle }: Props) {
  return (
    <div className="hx-stat">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon className="h-4 w-4" />
        <span className="text-sm">{label}</span>
      </div>
      <p className={cn("mt-2 text-3xl font-bold", colors[color])}>{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}
