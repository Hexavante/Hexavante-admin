export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-page";
import { isAdmin } from "@/lib/permissions";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  getAdminReportStats,
  getDailyNewUsers,
  getDailyRewards,
  getModerationActions30d,
  getReportReasons30d,
} from "@/services/admin-reports.service";
import {
  ModerationActionsChart,
  NewUsersChart,
  ReportReasonsChart,
  RewardsChart,
} from "@/components/moderation/report-charts";

export default async function AdminRelatoriosPage() {
  const user = await requireAdminPage();
  if (!isAdmin(user.roles)) redirect("/admin");

  const [stats, newUsers, rewards, actions, reasons] = await Promise.all([
    getAdminReportStats(),
    getDailyNewUsers(30),
    getDailyRewards(30),
    getModerationActions30d(),
    getReportReasons30d(),
  ]);

  const cards = [
    { label: "Usuários totais", value: stats.totalUsers, cls: "border-white/10 bg-white/[0.04] text-white" },
    { label: "Novos (7 dias)", value: stats.newUsers7d, cls: "border-sky-400/20 bg-sky-400/10 text-sky-100" },
    { label: "Auditorias (30 dias)", value: stats.logs30d, cls: "border-violet-400/20 bg-violet-400/10 text-violet-100" },
    { label: "Denúncias pendentes", value: stats.reportsPending, cls: "border-amber-400/20 bg-amber-400/10 text-amber-100" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl border px-4 py-3 ${card.cls}`}>
            <p className="text-2xl font-bold">{card.value.toLocaleString("pt-BR")}</p>
            <p className="text-sm opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <div>
              <CardTitle>Novos usuários — 30 dias</CardTitle>
              <CardDescription>Cadastros por dia na plataforma</CardDescription>
            </div>
          </CardHeader>
          <NewUsersChart data={newUsers} />
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <div>
              <CardTitle>Denúncias por motivo — 30 dias</CardTitle>
              <CardDescription>Distribuição do feed social</CardDescription>
            </div>
          </CardHeader>
          <ReportReasonsChart data={reasons} />
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>XP e moedas gerados — 30 dias</CardTitle>
              <CardDescription>Valores distribuídos por dia</CardDescription>
            </div>
          </CardHeader>
          <RewardsChart data={rewards} />
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <div>
              <CardTitle>Ações de auditoria — 30 dias</CardTitle>
              <CardDescription>Top 8 tipos de ação no painel</CardDescription>
            </div>
          </CardHeader>
          <ModerationActionsChart data={actions} />
        </Card>
      </div>
    </div>
  );
}
