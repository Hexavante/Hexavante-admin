"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Ban,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  FileWarning,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  Video,
} from "lucide-react";
import { ActivityChart } from "./activity-chart";
import { StatCard } from "./stat-card";

type Stats = {
  activeToday: number;
  activeBans: number;
  activeMutes: number;
  pendingReports: number;
  newMessages: number;
  xpToday: number;
  totalCoins: number;
  pendingCourses: number;
  pendingApplications: number;
  totalTutorials: number;
  publishedTutorials: number;
  totalExams: number;
  publishedExams: number;
  totalEnrollments: number;
  newUsersToday: number;
  totalUsers: number;
  activityData: {
    date: string;
    usuarios: number;
    simulados: number;
    xpGanho: number;
  }[];
};

type QueueItem = {
  href: string;
  label: string;
  detail: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "amber" | "sky" | "violet";
};

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

export function OverviewDashboard({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState(initial);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/moderation/stats");
        if (res.ok) {
          setStats(await res.json());
          setLastUpdated(new Date());
        }
      } catch {
        // Mantém os dados iniciais caso a atualização automática falhe.
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const queue = useMemo<QueueItem[]>(
    () => [
      {
        href: "/admin/denuncias",
        label: "Denúncias aguardando análise",
        detail:
          stats.pendingReports === 1
            ? "Uma ocorrência requer revisão"
            : "Ocorrências requerem revisão",
        count: stats.pendingReports,
        icon: FileWarning,
        tone: "amber",
      },
      {
        href: "/admin/instrutores",
        label: "Candidaturas de instrutor",
        detail: "Solicitações para aprovar ou rejeitar",
        count: stats.pendingApplications,
        icon: UserCheck,
        tone: "sky",
      },
      {
        href: "/admin/cursos",
        label: "Cursos em revisão",
        detail: "Conteúdos submetidos pela comunidade",
        count: stats.pendingCourses,
        icon: GraduationCap,
        tone: "violet",
      },
    ],
    [stats.pendingApplications, stats.pendingCourses, stats.pendingReports],
  );
  const totalPending = queue.reduce((total, item) => total + item.count, 0);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-2xl border border-[hsl(var(--sidebar-highlight)/0.2)] bg-[linear-gradient(120deg,hsl(var(--sidebar-highlight)/0.14),hsl(var(--sidebar-accent)/0.35)_52%,transparent)] p-5 shadow-[0_18px_45px_-30px_hsl(var(--sidebar-highlight)/0.48)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--sidebar-highlight))]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Operação em tempo real
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[hsl(var(--sidebar-foreground))] sm:text-3xl">
              Visão geral da plataforma
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[hsl(var(--sidebar-foreground)/0.65)]">
              Acompanhe a atividade, priorize pendências e mantenha a comunidade
              segura em um só lugar.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-[hsl(var(--sidebar-background)/0.38)] px-4 py-3">
            <Activity className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            <div>
              <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.5)]">
                Última atualização
              </p>
              <p className="text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">
                {lastUpdated.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="indicadores-chave">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--sidebar-highlight)/0.8)]">
              Hoje
            </p>
            <h3
              id="indicadores-chave"
              className="mt-1 text-lg font-bold text-[hsl(var(--sidebar-foreground))]"
            >
              Indicadores-chave
            </h3>
          </div>
          <p className="hidden text-xs text-[hsl(var(--sidebar-foreground)/0.48)] sm:block">
            Atualização automática a cada minuto
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Users}
            label="Usuários na plataforma"
            value={stats.totalUsers}
            color="sky"
            subtitle={`${formatNumber(stats.activeToday)} ativos hoje`}
          />
          <StatCard
            icon={UserPlus}
            label="Novos cadastros"
            value={stats.newUsersToday}
            color="emerald"
            subtitle="Entradas nas últimas 24 horas"
          />
          <StatCard
            icon={TrendingUp}
            label="XP distribuído"
            value={formatNumber(stats.xpToday)}
            color="amber"
            subtitle="Ganhos registrados hoje"
          />
          <StatCard
            icon={AlertTriangle}
            label="Pendências abertas"
            value={totalPending}
            color={totalPending > 0 ? "yellow" : "green"}
            subtitle={
              totalPending > 0 ? "Itens para priorizar" : "Nenhuma fila crítica"
            }
          />
        </div>
      </section>

      <section
        className="grid gap-6 xl:grid-cols-12"
        aria-label="Atividade e fila operacional"
      >
        <div className="xl:col-span-8">
          <ActivityChart data={stats.activityData} />
        </div>
        <aside
          className="hx-panel xl:col-span-4"
          aria-labelledby="fila-operacional"
        >
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="h-4.5 w-4.5 text-[hsl(var(--sidebar-highlight))]"
                  aria-hidden="true"
                />
                <h3
                  id="fila-operacional"
                  className="text-base font-bold text-[hsl(var(--sidebar-foreground))]"
                >
                  Fila operacional
                </h3>
              </div>
              <p className="mt-1 text-xs leading-5 text-[hsl(var(--sidebar-foreground)/0.55)]">
                Prioridades que precisam de uma decisão.
              </p>
            </div>
            <span className="rounded-full border border-[hsl(var(--sidebar-highlight)/0.24)] bg-[hsl(var(--sidebar-highlight)/0.1)] px-2.5 py-1 text-xs font-bold text-[hsl(var(--sidebar-highlight))]">
              {totalPending}
            </span>
          </div>
          <div className="space-y-2">
            {queue.map((item) => {
              const Icon = item.icon;
              const tone = {
                amber: "bg-amber-400/10 text-amber-300",
                sky: "bg-sky-400/10 text-sky-300",
                violet: "bg-violet-400/10 text-violet-300",
              }[item.tone];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl border border-sidebar-border bg-[hsl(var(--sidebar-accent)/0.24)] p-3 transition hover:border-[hsl(var(--sidebar-highlight)/0.3)] hover:bg-[hsl(var(--sidebar-highlight)/0.06)]"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-[hsl(var(--sidebar-foreground)/0.5)]">
                      {item.detail}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-sm font-bold text-[hsl(var(--sidebar-foreground))]">
                    {item.count}
                    <ArrowUpRight
                      className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/admin/logs"
            className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-sidebar-border px-3 py-2.5 text-xs font-semibold text-[hsl(var(--sidebar-foreground)/0.7)] transition hover:bg-sidebar-accent hover:text-[hsl(var(--sidebar-foreground))]"
          >
            Ver histórico de auditoria{" "}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </aside>
      </section>

      <section aria-labelledby="saude-plataforma">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--sidebar-highlight)/0.8)]">
            Plataforma
          </p>
          <h3
            id="saude-plataforma"
            className="mt-1 text-lg font-bold text-[hsl(var(--sidebar-foreground))]"
          >
            Saúde do ecossistema
          </h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <HealthCard
            icon={CheckCircle2}
            iconClass="text-emerald-400"
            value={formatNumber(stats.totalEnrollments)}
            label="Matrículas realizadas"
            className="border-emerald-400/15 bg-emerald-400/[0.035]"
          />
          <HealthCard
            icon={Video}
            iconClass="text-violet-300"
            value={`${stats.publishedTutorials}/${stats.totalTutorials}`}
            label="Tutoriais publicados"
          />
          <HealthCard
            icon={ClipboardCheck}
            iconClass="text-teal-300"
            value={`${stats.publishedExams}/${stats.totalExams}`}
            label="Simulados publicados"
          />
          <HealthCard
            icon={Coins}
            iconClass="text-amber-300"
            value={formatNumber(stats.totalCoins)}
            label="Moedas em circulação"
          />
        </div>
      </section>

      <section
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Status de moderação"
      >
        <MiniStatus
          icon={Ban}
          iconClass="text-red-300"
          value={stats.activeBans}
          label="Bans ativos"
        />
        <MiniStatus
          icon={MessageSquare}
          iconClass="text-orange-300"
          value={stats.activeMutes}
          label="Mutes ativos"
        />
        <MiniStatus
          icon={BookOpen}
          iconClass="text-sky-300"
          value={stats.pendingCourses}
          label="Cursos aguardando revisão"
        />
      </section>
    </div>
  );
}

function HealthCard({
  icon: Icon,
  iconClass,
  value,
  label,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div className={`hx-card ${className}`}>
      <Icon className={`h-4.5 w-4.5 ${iconClass}`} aria-hidden="true" />
      <p className="mt-4 text-2xl font-bold text-[hsl(var(--sidebar-foreground))]">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-[hsl(var(--sidebar-foreground)/0.75)]">
        {label}
      </p>
    </div>
  );
}

function MiniStatus({
  icon: Icon,
  iconClass,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-[hsl(var(--sidebar-accent)/0.28)] p-4">
      <Icon className={`h-5 w-5 ${iconClass}`} aria-hidden="true" />
      <span>
        <span className="block text-lg font-bold text-[hsl(var(--sidebar-foreground))]">
          {value}
        </span>
        <span className="text-xs text-[hsl(var(--sidebar-foreground)/0.55)]">
          {label}
        </span>
      </span>
    </div>
  );
}
