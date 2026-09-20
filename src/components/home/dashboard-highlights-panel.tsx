import Link from "next/link";
import { Calendar, Radio, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { DashboardHighlights } from "@/services/dashboard-goals.service";

type Props = {
  highlights: DashboardHighlights;
};

function formatEventDate(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardHighlightsPanel({ highlights }: Props) {
  const { nextGoal, nextLiveEvent } = highlights;
  const hasContent = nextGoal || nextLiveEvent;

  if (!hasContent) return null;

  return (
    <section className="mt-10 grid gap-3 md:grid-cols-2">
      {nextGoal && (
        <div className="anim-enter anim-d1">
        <Card padding="md" className="hx-lift h-full border-[hsl(var(--sidebar-highlight)/0.22)] bg-[hsl(var(--sidebar-highlight)/0.06)]">
          <div className="flex items-start gap-3">
            <span className="hx-icon-box">
              <Target className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide hx-accent-text">Próxima meta</p>
              <p className="mt-1 truncate font-semibold text-white">{nextGoal.courseTitle}</p>
              <p className="mt-1 text-sm text-slate-400">{nextGoal.label}</p>
              <div className="hx-progress-track mt-3 h-1.5">
                <div
                  className="hx-progress-fill"
                  style={{ width: `${nextGoal.progress}%` }}
                />
              </div>
              <Link
                href={`/courses/${nextGoal.courseSlug}/learn`}
                className="mt-3 inline-block text-sm font-semibold hx-accent-link"
              >
                Continuar curso →
              </Link>
            </div>
          </div>
        </Card>
        </div>
      )}

      {nextLiveEvent && (
        <div className="anim-enter anim-d2">
        <Card
          padding="md"
          className={
            nextLiveEvent.status === "LIVE"
              ? "hx-lift h-full border-red-400/25 bg-red-400/5"
              : "hx-lift h-full border-violet-400/20 bg-violet-400/5"
          }
        >
          <div className="flex items-start gap-3">
            <span
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${
                nextLiveEvent.status === "LIVE"
                  ? "border-red-400/30 bg-red-400/10 text-red-300"
                  : "border-violet-400/25 bg-violet-400/10 text-violet-300"
              }`}
            >
              <Radio className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold uppercase tracking-wide text-violet-300">
                  Próximo evento
                </p>
                {nextLiveEvent.status === "LIVE" && <Badge variant="red">Ao vivo</Badge>}
              </div>
              <p className="mt-1 truncate font-semibold text-white">{nextLiveEvent.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                {nextLiveEvent.instructorName}
                {nextLiveEvent.courseTitle ? ` · ${nextLiveEvent.courseTitle}` : ""}
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                {formatEventDate(nextLiveEvent.scheduledAt)}
              </p>
              <Link
                href={nextLiveEvent.href}
                className="mt-3 inline-block text-sm font-semibold text-violet-300 hover:text-violet-200"
              >
                {nextLiveEvent.status === "LIVE" ? "Entrar agora →" : "Ver sala →"}
              </Link>
            </div>
          </div>
        </Card>
        </div>
      )}
    </section>
  );
}
