import Link from "next/link";
import {
  Award,
  BarChart3,
  BookOpen,
  Calendar,
  Coins,
  Flame,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { XpProgressBar } from "@/components/gamification/xp-progress-bar";
import { StatCard } from "@/components/stats/stat-card";
import type { PersonalStats } from "@/services/personal-stats.service";

type Props = {
  stats: PersonalStats;
  variant?: "full" | "compact";
  showHeader?: boolean;
  tourId?: string;
};

export function PersonalStatsView({
  stats,
  variant = "full",
  showHeader = true,
  tourId,
}: Props) {
  const compact = variant === "compact";

  return (
    <section data-tour={tourId} className={compact ? undefined : "space-y-6"}>
      {showHeader ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 hx-accent-text" />
              <h2 className="text-lg font-bold text-white">
                {compact ? "Resumo do progresso" : "Suas estatísticas"}
              </h2>
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {compact
                ? "Visão rápida da sua jornada na Hexavante"
                : "Acompanhe XP, estudos, simulados e conquistas em detalhe"}
            </p>
          </div>
          {compact ? (
            <Link
              href="/estatisticas"
              className="text-sm font-semibold hx-accent-link"
            >
              Ver página completa →
            </Link>
          ) : null}
        </div>
      ) : null}

      <Card padding="md" className="space-y-6 border-[hsl(var(--sidebar-highlight)/0.15)] bg-gradient-to-br from-[hsl(var(--sidebar-highlight)/0.06)] via-transparent to-[hsl(var(--sidebar-accent)/0.2)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[hsl(var(--sidebar-border))] pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sky">Nível {stats.level}</Badge>
              {stats.rank ? (
                <Badge variant="default">
                  <Trophy className="h-3.5 w-3.5" />#{stats.rank} no ranking
                </Badge>
              ) : null}
              {stats.studyStreakDays > 0 ? (
                <Badge variant="emerald">
                  <Flame className="h-3.5 w-3.5" />
                  {stats.studyStreakDays} dias seguidos
                </Badge>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-slate-400">
              {stats.totalXp.toLocaleString("pt-BR")} XP total ·{" "}
              {stats.xpThisWeek.toLocaleString("pt-BR")} XP esta semana
            </p>
          </div>
          <div className="min-w-[200px] flex-1 sm:max-w-xs">
            <XpProgressBar
              level={stats.level}
              currentXp={Math.round((stats.progressPercent / 100) * stats.xpToNextLevel)}
              xpToNextLevel={stats.xpToNextLevel}
              progressPercent={stats.progressPercent}
            />
          </div>
        </div>

        <div className={`grid gap-3 ${compact ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
          <StatCard icon={BookOpen} label="Aulas concluídas" value={stats.lessonsCompleted} />
          <StatCard
            icon={Award}
            label="Cursos concluídos"
            value={stats.coursesCompleted}
            sub={`${stats.coursesEnrolled} matriculados`}
            tone="text-teal-300"
          />
          <StatCard
            icon={Target}
            label="Simulados"
            value={stats.examsTaken}
            sub={
              stats.averageExamScore != null
                ? `Média ${Math.round(stats.averageExamScore)}% · ${stats.examsPassed} aprovados`
                : `${stats.examsPassed} aprovados`
            }
            tone="text-amber-300"
          />
          <StatCard
            icon={Coins}
            label="Moedas"
            value={stats.coins.toLocaleString("pt-BR")}
            sub={`${stats.certificatesCount} certificados`}
            tone="text-yellow-300"
          />
        </div>

        {!compact ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={Zap}
              label="Conquistas"
              value={`${stats.achievementsUnlocked}/${stats.achievementsTotal}`}
              sub="Desbloqueadas no perfil"
              tone="text-violet-300"
            />
            <StatCard
              icon={Calendar}
              label="Dias ativos"
              value={stats.activeDays}
              sub="Com atividade registrada"
              tone="text-slate-300"
            />
            <StatCard
              icon={Flame}
              label="Sequência"
              value={stats.studyStreakDays > 0 ? `${stats.studyStreakDays} dias` : "—"}
              sub="Estudando em dias consecutivos"
              tone="text-orange-300"
            />
          </div>
        ) : null}
      </Card>
    </section>
  );
}
