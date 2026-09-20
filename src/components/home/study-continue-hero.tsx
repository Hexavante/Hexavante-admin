import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Play, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { ClientRelativeTime } from "@/components/ui/client-relative-time";
import { Card } from "@/components/ui/card";
import type { StudyContinuation } from "@/services/study-continuation.service";

type Props = {
  continuation: StudyContinuation | null;
};

export function StudyContinueHero({ continuation }: Props) {
  if (!continuation) {
    return (
      <Card
        padding="md"
        data-tour="study-continue"
        className="border-dashed border-[hsl(var(--sidebar-highlight)/0.25)] bg-[hsl(var(--sidebar-highlight)/0.06)]"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="sky">Comece sua jornada</Badge>
            <h2 className="mt-3 text-xl font-bold hx-text-title">Nenhum estudo em andamento</h2>
            <p className="mt-2 text-sm hx-text-muted">
              Matricule-se em um curso ou faça um simulado para retomar daqui.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton href="/courses" className="min-h-11">
              <BookOpen className="h-4 w-4" />
              Explorar cursos
            </LinkButton>
            <LinkButton href="/simulados" variant="outline" className="min-h-11">
              <Target className="h-4 w-4" />
              Simulados
            </LinkButton>
          </div>
        </div>
      </Card>
    );
  }

  const isExam = continuation.type === "exam";

  return (
    <Card padding="md" data-tour="study-continue" className="hx-hero-card">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="sky">
              {isExam ? <Target className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              Continue estudando
            </Badge>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              <ClientRelativeTime date={continuation.lastStudyAt} />
            </span>
          </div>

          <h2 className="mt-3 truncate text-xl font-black hx-text-title">
            {isExam ? continuation.examTitle : continuation.courseTitle}
          </h2>
          <p className="mt-1 text-sm hx-text-muted">
            {isExam
              ? `Última nota: ${Math.round(continuation.examScore ?? continuation.progress)}% — tente melhorar`
              : `Próxima aula: ${continuation.lessonTitle}`}
          </p>

          {!isExam && (
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>Progresso do curso</span>
                <span>{Math.round(continuation.progress)}%</span>
              </div>
              <div className="hx-progress-track h-2">
                <div
                  className="hx-progress-fill"
                  style={{ width: `${Math.min(100, continuation.progress)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <Link href={continuation.href} className="hx-hero-btn group animate-pulse-glow shrink-0">
          {isExam ? "Ver simulado" : "Retomar aula"}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
}
