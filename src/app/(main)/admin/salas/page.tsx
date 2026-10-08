export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin-page";
import { isAdmin } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/cn";
import { Card, CardTitle } from "@/components/ui/card";
import { SearchForm } from "@/components/ui/search-form";
import { ServerPagination } from "@/components/ui/server-pagination";
import type { LiveRoomStatus } from "@prisma/client";

const PAGE_SIZE = 25;
const STATUSES = ["all", "LIVE", "SCHEDULED", "ENDED", "CANCELLED"] as const;
const STATUS_LABELS: Record<string, string> = {
  all: "Todas",
  LIVE: "Ao vivo",
  SCHEDULED: "Agendadas",
  ENDED: "Encerradas",
  CANCELLED: "Canceladas",
};
const STATUS_PILLS: Record<string, string> = {
  LIVE: "border-red-400/25 bg-red-400/10 text-red-300",
  SCHEDULED: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  ENDED: "border-white/10 bg-white/[0.05] text-slate-400",
  CANCELLED: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

export default async function AdminSalasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const account = await requireAdminPage();
  if (!isAdmin(account.roles)) redirect("/admin");

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const rawStatus = typeof sp.status === "string" ? sp.status : "all";
  const status = (STATUSES as readonly string[]).includes(rawStatus) ? rawStatus : "all";
  const pageNum = Math.max(1, Math.floor(Number(sp.page) || 1));

  const where = {
    ...(status !== "all" ? { status: status as LiveRoomStatus } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: q } },
            { instructor: { OR: [{ username: { contains: q } }, { fullName: { contains: q } }] } },
          ],
        }
      : {}),
  };

  const [total, liveCount, scheduledCount] = await Promise.all([
    prisma.liveRoom.count({ where }),
    prisma.liveRoom.count({ where: { status: "LIVE" } }),
    prisma.liveRoom.count({ where: { status: "SCHEDULED" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageNum, totalPages);

  const items = await prisma.liveRoom.findMany({
    where,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { scheduledAt: "desc" },
    include: {
      instructor: { select: { username: true, fullName: true } },
      course: { select: { title: true } },
      _count: { select: { participants: true } },
    },
  });

  const buildHref = (p: number, statusFilter = status) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (p > 1) params.set("page", String(p));
    return `?${params.toString()}`;
  };

  const cards = [
    { label: "Salas", value: total, cls: "border-white/10 bg-white/[0.04] text-white" },
    { label: "Ao vivo agora", value: liveCount, cls: "border-red-400/20 bg-red-400/10 text-red-100" },
    { label: "Agendadas", value: scheduledCount, cls: "border-sky-400/20 bg-sky-400/10 text-sky-100" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-xl border px-4 py-3 ${card.cls}`}>
            <p className="text-2xl font-bold">{card.value.toLocaleString("pt-BR")}</p>
            <p className="text-sm opacity-80">{card.label}</p>
          </div>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden p-0">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle>Salas ao vivo</CardTitle>
            <SearchForm placeholder="Buscar por sala ou instrutor" defaultValue={q} hidden={{ status }} />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link
                key={s}
                href={buildHref(1, s)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                  s === status
                    ? "border-sky-400/40 bg-sky-400/15 text-sky-200"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
                )}
              >
                {STATUS_LABELS[s]}
              </Link>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                <th className="px-4 py-3">Agendada</th>
                <th className="px-4 py-3">Sala</th>
                <th className="px-4 py-3">Instrutor</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Participantes</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Nenhuma sala encontrada.
                  </td>
                </tr>
              ) : (
                items.map((room) => (
                  <tr key={room.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-slate-400">
                      {room.scheduledAt.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{room.title}</p>
                      {room.course && <p className="text-xs text-slate-500">{room.course.title}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-300">{room.instructor.fullName}</p>
                      <p className="text-xs text-slate-500">@{room.instructor.username ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${STATUS_PILLS[room.status] ?? ""}`}
                      >
                        {STATUS_LABELS[room.status] ?? room.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {room._count.participants}
                      {room.maxParticipants ? ` / ${room.maxParticipants}` : ""}
                    </td>
                  </tr>
                ))
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
