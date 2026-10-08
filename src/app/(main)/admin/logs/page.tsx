export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-page";
import { LogList } from "@/components/moderation/log-list";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { ACTION_LABELS, ACTION_PILLS, ACTION_PILL_BASE } from "@/lib/moderation/log-labels";
import { daysAgo } from "@/lib/dates";

export default async function ModerationLogsPage() {
  await requireAdminPage();

  const since = daysAgo(7);
  const [weekTotal, byAction] = await Promise.all([
    prisma.moderationLog.count({ where: { createdAt: { gte: since } } }),
    prisma.moderationLog.groupBy({
      by: ["action"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { action: "desc" } },
      take: 10,
    }),
  ]);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-8">
        <LogList />
      </div>

      <aside className="min-w-0 space-y-6 lg:col-span-4">
        <Card>
          <CardTitle>Resumo — 7 dias</CardTitle>
          <CardDescription>Eventos de auditoria registrados na última semana.</CardDescription>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <p className="text-2xl font-bold text-white">{weekTotal}</p>
            <p className="text-sm text-slate-400">eventos na semana</p>
          </div>

          <ul className="mt-4 space-y-2">
            {byAction.length === 0 ? (
              <li className="py-4 text-center text-sm text-slate-500">
                Nenhuma atividade nos últimos 7 dias.
              </li>
            ) : (
              byAction.map((row) => (
                <li
                  key={row.action}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
                >
                  <span
                    className={`${ACTION_PILL_BASE} ${ACTION_PILLS[row.action] ?? "border-white/10 bg-white/[0.05] text-slate-400"}`}
                  >
                    {ACTION_LABELS[row.action] ?? row.action}
                  </span>
                  <span className="text-sm font-semibold text-slate-200">{row._count._all}</span>
                </li>
              ))
            )}
          </ul>
        </Card>
      </aside>
    </div>
  );
}
