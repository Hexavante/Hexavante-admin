export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-page";
import { isAdmin } from "@/lib/permissions";
import { getFinanceStats } from "@/services/moderation-finance.service";
import { FinanceTable } from "@/components/moderation/finance-table";

export default async function AdminFinanceiroPage() {
  const user = await requireAdminPage();
  if (!isAdmin(user.roles)) redirect("/admin");

  const stats = await getFinanceStats();

  const cards = [
    {
      label: "Transações de XP (7 dias)",
      value: stats.xpWeekCount.toLocaleString("pt-BR"),
      cls: "border-white/10 bg-white/[0.04] text-white",
    },
    {
      label: "XP líquido (7 dias)",
      value: `${stats.xpWeekNet > 0 ? "+" : ""}${stats.xpWeekNet.toLocaleString("pt-BR")}`,
      cls: "border-sky-400/20 bg-sky-400/10 text-sky-100",
    },
    {
      label: "Transações de moedas (7 dias)",
      value: stats.coinWeekCount.toLocaleString("pt-BR"),
      cls: "border-white/10 bg-white/[0.04] text-white",
    },
    {
      label: "Moedas líquidas (7 dias)",
      value: `${stats.coinWeekNet > 0 ? "+" : ""}${stats.coinWeekNet.toLocaleString("pt-BR")}`,
      cls: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl border px-4 py-3 ${card.cls}`}>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      <FinanceTable />
    </div>
  );
}
