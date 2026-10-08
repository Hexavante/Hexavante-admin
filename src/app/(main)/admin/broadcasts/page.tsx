export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/admin-page";
import { isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { daysAgo } from "@/lib/dates";
import { Card, CardTitle } from "@/components/ui/card";
import { SearchForm } from "@/components/ui/search-form";
import { ServerPagination } from "@/components/ui/server-pagination";

const PAGE_SIZE = 25;

export default async function AdminBroadcastsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const account = await requireAdminPage();
  if (!isAdmin(account.roles)) redirect("/admin");

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const pageNum = Math.max(1, Math.floor(Number(sp.page) || 1));

  // Broadcasts saem da auditoria (action=BROADCAST, índice em action).
  const where = {
    action: "BROADCAST" as const,
    ...(q ? { description: { contains: q } } : {}),
  };

  const [total, month30] = await Promise.all([
    prisma.moderationLog.count({ where }),
    prisma.moderationLog.count({ where: { action: "BROADCAST", createdAt: { gte: daysAgo(30) } } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageNum, totalPages);

  const items = await prisma.moderationLog.findMany({
    where,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
    include: { moderator: { select: { username: true, fullName: true } } },
  });

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    return `?${params.toString()}`;
  };

  const cards = [
    { label: "Broadcasts", value: total, cls: "border-white/10 bg-white/[0.04] text-white" },
    { label: "Enviados (30 dias)", value: month30, cls: "border-teal-400/20 bg-teal-400/10 text-teal-100" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl border px-4 py-3 ${card.cls}`}>
            <p className="text-2xl font-bold">{card.value.toLocaleString("pt-BR")}</p>
            <p className="text-sm opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <CardTitle>Broadcasts enviados</CardTitle>
          <SearchForm placeholder="Buscar na mensagem" defaultValue={q} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Moderador</th>
                <th className="px-4 py-3">Mensagem</th>
                <th className="px-4 py-3">Destinatários</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    Nenhum broadcast encontrado.
                  </td>
                </tr>
              ) : (
                items.map((log) => {
                  const meta = log.metadata as { recipients?: number } | null;
                  const message = log.description.replace(/^Broadcast:\s*/, "");
                  return (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="px-4 py-3 text-slate-400">
                        {log.createdAt.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-slate-300">{log.moderator.fullName}</p>
                        <p className="text-xs text-slate-500">@{log.moderator.username ?? "—"}</p>
                      </td>
                      <td className="max-w-[420px] px-4 py-3 text-slate-200">
                        <span className="line-clamp-2">{message}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-sky-300">
                        {typeof meta?.recipients === "number"
                          ? meta.recipients.toLocaleString("pt-BR")
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 px-5 py-3">
          <ServerPagination
            page={page}
            totalPages={totalPages}
            total={total}
            prev={page > 1 ? buildHref(page - 1) : null}
            next={page < totalPages ? buildHref(page + 1) : null}
          />
        </div>
      </Card>
    </div>
  );
}
