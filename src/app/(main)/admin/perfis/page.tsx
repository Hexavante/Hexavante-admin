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

const FIELD_LABELS: Record<string, string> = {
  bio: "Bio",
  avatar: "Avatar",
  banner: "Banner",
  fullName: "Nome",
  username: "Usuário",
};

export default async function AdminPerfisPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const account = await requireAdminPage();
  if (!isAdmin(account.roles)) redirect("/admin");

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const pageNum = Math.max(1, Math.floor(Number(sp.page) || 1));

  // Fila de moderação de perfis: violações de política com contexto PROFILE.
  const where = {
    context: "PROFILE",
    ...(q
      ? {
          OR: [
            { user: { OR: [{ username: { contains: q } }, { fullName: { contains: q } }] } },
            { preview: { contains: q } },
            { matchedTerm: { contains: q } },
          ],
        }
      : {}),
  };

  const [total, month30] = await Promise.all([
    prisma.contentPolicyViolation.count({ where }),
    prisma.contentPolicyViolation.count({
      where: { context: "PROFILE", createdAt: { gte: daysAgo(30) } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageNum, totalPages);

  const items = await prisma.contentPolicyViolation.findMany({
    where,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true, fullName: true } } },
  });

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    return `?${params.toString()}`;
  };

  const cards = [
    { label: "Violações de perfil", value: total, cls: "border-white/10 bg-white/[0.04] text-white" },
    { label: "Nos últimos 30 dias", value: month30, cls: "border-amber-400/20 bg-amber-400/10 text-amber-100" },
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
          <CardTitle>Moderação de perfis</CardTitle>
          <SearchForm placeholder="Buscar por usuário ou termo" defaultValue={q} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Campo</th>
                <th className="px-4 py-3">Trecho</th>
                <th className="px-4 py-3">Termo</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Nenhuma violação de perfil encontrada.
                  </td>
                </tr>
              ) : (
                items.map((violation) => (
                  <tr key={violation.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-slate-400">
                      {violation.createdAt.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3">
                      {violation.user ? (
                        <>
                          <p className="font-medium text-white">{violation.user.fullName}</p>
                          <p className="text-xs text-slate-500">@{violation.user.username ?? "—"}</p>
                        </>
                      ) : (
                        <span className="text-xs text-slate-600">conta excluída</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {FIELD_LABELS[violation.field] ?? violation.field}
                    </td>
                    <td className="max-w-[320px] px-4 py-3 text-slate-400">
                      <span className="line-clamp-2">{violation.preview}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex shrink-0 items-center rounded-full border border-red-400/25 bg-red-400/10 px-2 py-0.5 text-[11px] font-semibold text-red-300">
                        {violation.matchedTerm}
                      </span>
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
