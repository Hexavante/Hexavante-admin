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
    <div className="space-y-6">
      {/* Primary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Users} label="Usuários totais" value={stats.totalUsers} />
        <StatCard icon={UserPlus} label="Novos hoje" value={stats.newUsersToday} color="green" />
        <StatCard icon={TrendingUp} label="XP distribuído hoje" value={stats.xpToday} />
        <StatCard
          icon={Coins}
          label="Moedas em circulação"
          value={stats.totalCoins.toLocaleString("pt-BR")}
        />
      </div>

      {/* Content stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={GraduationCap}
          label="Cursos publicados"
          value={stats.totalEnrollments}
          subtitle={`${stats.pendingCourses} pendentes`}
        />
        <StatCard
          icon={Video}
          label="Tutoriais publicados"
          value={stats.publishedTutorials}
          subtitle={`${stats.totalTutorials - stats.publishedTutorials} rascunhos`}
        />
        <StatCard
          icon={ClipboardCheck}
          label="Simulados publicados"
          value={stats.publishedExams}
          subtitle={`${stats.totalExams - stats.publishedExams} rascunhos`}
        />
        <StatCard
          icon={AlertTriangle}
          label="Denúncias pendentes"
          value={stats.pendingReports}
          color="yellow"
        />
      </div>

      {/* Mod stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Ban} label="Bans ativos" value={stats.activeBans} color="red" />
        <StatCard icon={MessageSquare} label="Mutes ativos" value={stats.activeMutes} />
        <StatCard icon={Users} label="Usuários ativos hoje" value={stats.activeToday} color="green" />
      </div>

      <ActivityChart data={stats.activityData} />
    </div>
  );
}
