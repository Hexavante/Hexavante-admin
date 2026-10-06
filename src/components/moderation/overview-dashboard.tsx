"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Ban,
  Coins,
  GraduationCap,
  MessageSquare,
  TrendingUp,
  Users,
  Video,
  ClipboardCheck,
  UserPlus,
  BookOpen,
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
  activityData: { date: string; usuarios: number; simulados: number; xpGanho: number }[];
};

function SectionTitle({ title, description, icon: Icon, id }: { title: string; description?: string; icon?: React.ComponentType<{ className?: string }>; id?: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      {Icon && <Icon className="h-5 w-5 text-[hsl(var(--sidebar-highlight)/0.8)]" aria-hidden="true" />}
      <div>
        <h3 id={id} className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </div>
  );
}

export function OverviewDashboard({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState(initial);

  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch("/api/moderation/stats");
        if (res.ok) setStats(await res.json());
      } catch {
        /* ignore */
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* BLOCO 1 - Métricas Principais */}
      <section aria-labelledby="metricas-principais">
        <SectionTitle
          id="metricas-principais"
          title="Métricas principais"
          description="Indicadores-chave da plataforma nas últimas 24h"
          icon={TrendingUp}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="Usuários totais"
            value={stats.totalUsers}
            color="sky"
          />
          <StatCard
            icon={Users}
            label="Usuários ativos hoje"
            value={stats.activeToday}
            color="green"
          />
          <StatCard
            icon={UserPlus}
            label="Novos usuários hoje"
            value={stats.newUsersToday}
            color="emerald"
          />
          <StatCard
            icon={AlertTriangle}
            label="Denúncias pendentes"
            value={stats.pendingReports}
            color="yellow"
            subtitle={stats.pendingReports > 0 ? "Requer atenção" : "Tudo limpo"}
          />
        </div>
      </section>

      {/* BLOCO 2 - Métricas da Plataforma */}
      <section aria-labelledby="metricas-plataforma">
        <SectionTitle
          id="metricas-plataforma"
          title="Métricas da plataforma"
          description="Conteúdo e economia"
          icon={BookOpen}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            icon={TrendingUp}
            label="XP distribuído hoje"
            value={stats.xpToday.toLocaleString("pt-BR")}
            color="amber"
          />
          <StatCard
            icon={Coins}
            label="Moedas em circulação"
            value={stats.totalCoins.toLocaleString("pt-BR")}
            color="amber"
          />
          <StatCard
            icon={GraduationCap}
            label="Cursos"
            value={stats.pendingCourses > 0 ? `${stats.totalEnrollments} (${stats.pendingCourses} pend.)` : stats.totalEnrollments.toLocaleString("pt-BR")}
            color="sky"
            subtitle={`${stats.pendingCourses} aguardando revisão`}
          />
          <StatCard
            icon={Video}
            label="Tutoriais"
            value={stats.publishedTutorials}
            color="violet"
            subtitle={`${stats.totalTutorials - stats.publishedTutorials} rascunhos`}
          />
          <StatCard
            icon={ClipboardCheck}
            label="Simulados"
            value={stats.publishedExams}
            color="teal"
            subtitle={`${stats.totalExams - stats.publishedExams} rascunhos`}
          />
        </div>
      </section>

      {/* BLOCO 3 - Moderação */}
      <section aria-labelledby="moderacao">
        <SectionTitle
          id="moderacao"
          title="Moderação"
          description="Ações ativas de moderação"
          icon={Ban}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            icon={AlertTriangle}
            label="Denúncias pendentes"
            value={stats.pendingReports}
            color="yellow"
            subtitle={stats.pendingReports > 0 ? "Requer atenção" : "Tudo limpo"}
          />
          <StatCard
            icon={Ban}
            label="Bans ativos"
            value={stats.activeBans}
            color="red"
          />
          <StatCard
            icon={MessageSquare}
            label="Mutes ativos"
            value={stats.activeMutes}
            color="orange"
          />
        </div>
      </section>

      {/* BLOCO 4 - Gráfico de Atividade */}
      <section aria-labelledby="atividade">
        <ActivityChart data={stats.activityData} />
      </section>
    </div>
  );
}