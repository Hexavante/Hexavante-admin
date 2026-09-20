import { ArrowRight, BookOpen, CalendarClock, Radio, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InteractiveCard } from "@/components/ui/card";
import { getStartsInLabel } from "@/lib/live-room-utils";
import { LIVE_ROOM_STATUS_LABELS } from "@/lib/validations/live-room";

type Props = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  scheduledAt: Date;
  instructorName: string | null;
  courseTitle?: string | null;
  participantCount: number;
};

export function LiveRoomCard({
  id,
  title,
  description,
  status,
  scheduledAt,
  instructorName,
  courseTitle,
  participantCount,
}: Props) {
  const isLive = status === "LIVE";
  const isScheduled = status === "SCHEDULED";
  const startsIn = isScheduled ? getStartsInLabel(scheduledAt) : null;

  return (
    <InteractiveCard
      href={`/live-rooms/${id}`}
      ariaLabel={`Entrar na sala ${title}`}
      className={`group relative overflow-hidden p-0 ${
        isLive
          ? "border-red-400/25 hover:border-red-400/45"
          : "hover:border-[hsl(var(--sidebar-highlight)/0.35)]"
      }`}
    >
      {isLive && (
        <div className="flex items-center gap-2 border-b border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-200">
          <Radio className="h-3.5 w-3.5 hx-live-pulse" />
          Transmissão ao vivo
        </div>
      )}

      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3
              className={`truncate font-bold text-white transition-colors ${
                isLive
                  ? "group-hover:text-red-100"
                  : "group-hover:text-[hsl(var(--sidebar-highlight)/0.95)]"
              }`}
            >
              {title}
            </h3>
            <p className="mt-1 text-sm text-slate-400">{instructorName}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            {isLive && <Badge variant="red">Live</Badge>}
            {startsIn && <Badge variant="sky">{startsIn}</Badge>}
            {!isLive && !startsIn && (
              <Badge>{LIVE_ROOM_STATUS_LABELS[status] || status}</Badge>
            )}
          </div>
        </div>

        {description && (
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-slate-300">{description}</p>
        )}

        <div className="space-y-2.5 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <CalendarClock className="hx-accent-soft h-4 w-4 shrink-0" />
            <span>
              {scheduledAt.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              ·{" "}
              {scheduledAt.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="hx-accent-soft h-4 w-4 shrink-0" />
            <span>
              {participantCount} {participantCount === 1 ? "participante" : "participantes"}
            </span>
          </div>

          {courseTitle && (
            <div className="flex items-center gap-2">
              <BookOpen className="hx-accent-soft h-4 w-4 shrink-0" />
              <span className="truncate">{courseTitle}</span>
            </div>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[hsl(var(--sidebar-border))] pt-4">
          <span className="flex items-center gap-2 text-sm font-semibold hx-accent-link">
            {isLive && <Radio className="h-4 w-4" />}
            {isLive ? "Entrar agora" : isScheduled ? "Ver agendamento" : "Ver detalhes"}
          </span>
          <ArrowRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-[hsl(var(--sidebar-highlight))]" />
        </div>
      </div>
    </InteractiveCard>
  );
}
