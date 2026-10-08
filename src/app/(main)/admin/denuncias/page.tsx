export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-page";
import { isAdmin } from "@/lib/permissions";
import { countCommunityReports } from "@/services/community-reports.service";
import { ReportsTable } from "@/components/moderation/reports-table";

export default async function AdminDenunciasPage() {
  const user = await requireAdminPage();
  if (!isAdmin(user.roles)) redirect("/admin");

  const counts = await countCommunityReports();

  const cards = [
    {
      label: "Pendentes",
      value: counts.pending,
      cls: "border-amber-400/20 bg-amber-400/10 text-amber-100",
    },
    {
      label: "Revisadas",
      value: counts.reviewed,
      cls: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100",
    },
    {
      label: "Dispensadas",
      value: counts.dismissed,
      cls: "border-white/10 bg-white/[0.04] text-white",
    },
    {
      label: "Total",
      value: counts.total,
      cls: "border-white/10 bg-white/[0.04] text-white",
    },
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

      <ReportsTable />
    </div>
  );
}
