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

export default async function AdminCertificadosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const account = await requireAdminPage();
  if (!isAdmin(account.roles)) redirect("/admin");

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const pageNum = Math.max(1, Math.floor(Number(sp.page) || 1));

  const where = q
    ? {
        OR: [
          { user: { OR: [{ username: { contains: q } }, { fullName: { contains: q } }] } },
          { course: { title: { contains: q } } },
          { code: { contains: q } },
        ],
      }
    : {};

  const [total, issued30d, verifiedTotal] = await Promise.all([
    prisma.certificate.count({ where }),
    prisma.certificate.count({ where: { issuedAt: { gte: daysAgo(30) } } }),
    prisma.certificate.count({ where: { verifiedAt: { not: null } } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(pageNum, totalPages);

  const items = await prisma.certificate.findMany({
    where,
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    orderBy: { issuedAt: "desc" },
    include: {
      user: { select: { username: true, fullName: true } },
      course: { select: { title: true } },
    },
  });

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return `?${s}`;
  };

  const cards = [
    { label: "Certificados", value: total, cls: "border-white/10 bg-white/[0.04] text-white" },
    { label: "Emitidos (30 dias)", value: issued30d, cls: "border-sky-400/20 bg-sky-400/10 text-sky-100" },
    { label: "Verificados", value: verifiedTotal, cls: "border-emerald-400/20 bg-emerald-400/10 text-emerald-100" },
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
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <CardTitle>Certificados emitidos</CardTitle>
          <SearchForm placeholder="Buscar por usuário, curso ou código" defaultValue={q} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
              <tr>
                <th className="px-4 py-3">Emitido em</th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Usuário</th>
                <th className="px-4 py-3">Curso</th>
                <th className="px-4 py-3">Verificado</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Nenhum certificado encontrado.
                  </td>
                </tr>
              ) : (
                items.map((cert) => (
                  <tr key={cert.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-4 py-3 text-slate-400">
                      {cert.issuedAt.toLocaleString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-sky-300">{cert.code}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{cert.user.fullName}</p>
                      <p className="text-xs text-slate-500">@{cert.user.username ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{cert.course.title}</td>
                    <td className="px-4 py-3">
                      {cert.verifiedAt ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                          Sim
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">Não</span>
                      )}
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
