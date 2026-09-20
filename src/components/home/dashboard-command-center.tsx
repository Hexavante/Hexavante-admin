import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart2,
  BarChart3,
  BookOpen,
  Radio,
  Target,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import {
  DASHBOARD_QUICK_ACTIONS,
  type DashboardPendingItem,
} from "@/services/dashboard-pending.service";

type Props = {
  pendingItems: DashboardPendingItem[];
};

const toneStyles: Record<DashboardPendingItem["tone"], string> = {
  sky: "hx-tone-sky hover:border-[hsl(var(--sidebar-highlight)/0.4)]",
  violet: "hx-tone-violet hover:border-violet-400/40",
  amber: "hx-tone-amber hover:border-amber-400/40",
  orange: "hx-tone-orange hover:border-orange-400/40",
  emerald: "hx-tone-emerald hover:border-emerald-400/40",
};

const QUICK_ACTION_META: Record<
  string,
  { icon: LucideIcon; tone: string; iconTone: string }
> = {
  "/courses": {
    icon: BookOpen,
    tone: "hover:border-[hsl(var(--sidebar-highlight)/0.35)] hover:bg-[hsl(var(--sidebar-highlight)/0.1)]",
    iconTone: "bg-[hsl(var(--sidebar-highlight)/0.15)] hx-accent-text",
  },
  "/simulados": {
    icon: Target,
    tone: "hover:border-teal-400/35 hover:bg-teal-400/10",
    iconTone: "bg-teal-400/15 text-teal-300",
  },
  "/estatisticas": {
    icon: BarChart3,
    tone: "hover:border-cyan-400/35 hover:bg-cyan-400/10",
    iconTone: "bg-cyan-400/15 text-cyan-300",
  },
  "/ranking": {
    icon: BarChart2,
    tone: "hover:border-amber-400/35 hover:bg-amber-400/10",
    iconTone: "bg-amber-400/15 text-amber-300",
  },
  "/certificados": {
    icon: Award,
    tone: "hover:border-yellow-400/35 hover:bg-yellow-400/10",
    iconTone: "bg-yellow-400/15 text-yellow-300",
  },
  "/live-rooms": {
    icon: Radio,
    tone: "hover:border-rose-400/35 hover:bg-rose-400/10",
    iconTone: "bg-rose-400/15 text-rose-300",
  },
};

const defaultQuickMeta = {
  icon: Zap,
  tone: "hover:border-[hsl(var(--sidebar-highlight)/0.35)] hover:bg-[hsl(var(--sidebar-highlight)/0.1)]",
  iconTone: "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-foreground)/0.72)]",
};

export function DashboardCommandCenter({ pendingItems }: Props) {
  return (
    <section className="mt-8" data-tour="dashboard-command">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 hx-accent-text">
            <Zap className="h-4 w-4" />
            <p className="text-xs font-bold uppercase tracking-wide">Central de estudos</p>
          </div>
          <h2 className="mt-1 text-lg font-bold hx-text-title">Sua rotina de hoje</h2>
          <p className="mt-1 text-sm hx-text-muted">Um clique para a próxima ação importante.</p>
        </div>
      </div>

      {pendingItems.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pendingItems.map((item, i) => (
            <div key={item.id} className="anim-enter-scale" style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
            <Link
              href={item.href}
              className={cn(
                "group hx-lift flex h-full flex-col rounded-xl border p-4",
                toneStyles[item.tone],
              )}
            >
              <p className="text-sm font-bold">{item.label}</p>
              <p className="mt-1 line-clamp-2 text-xs opacity-90">{item.description}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold">
                Abrir
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
            </div>
          ))}
        </div>
      )}

      <Card padding="md" className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide hx-text-subtle">Atalhos</p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {DASHBOARD_QUICK_ACTIONS.map((action) => {
            const meta = QUICK_ACTION_META[action.href] ?? defaultQuickMeta;
            const Icon = meta.icon;

            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "group hx-lift flex items-center gap-2.5 rounded-xl border border-[hsl(var(--sidebar-border))] bg-[var(--surface)] px-3 py-2.5 text-sm font-semibold hx-text-body",
                  meta.tone,
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition group-hover:scale-105",
                    meta.iconTone,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </Card>
    </section>
  );
}
