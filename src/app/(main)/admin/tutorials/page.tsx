export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { toggleTutorialPublishAction, deleteTutorialModeratorAction } from "@/app/actions/moderation";
import { StatusBadge } from "@/components/ui/status-badge";
import { APP_URL } from "@/lib/app-url";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Eye, Clock, Trash2 } from "lucide-react";
import { requireAdminPage } from "@/lib/admin-page";

function formatDuration(seconds: number | null): string {
  if (!seconds) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function AdminTutorialsPage() {
  await requireAdminPage();

  const tutorials = await prisma.tutorial.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
      category: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
      _count: { select: { tags: true } },
    },
  });

  const publishedCount = tutorials.filter((t) => t.isPublished).length;
  const draftCount = tutorials.length - publishedCount;
  const totalViews = tutorials.reduce((sum, t) => sum + t.viewCount, 0);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-2xl font-bold text-white">{tutorials.length}</p>
          <p className="text-sm text-slate-400">Total de tutoriais</p>
        </div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
          <p className="text-2xl font-bold text-emerald-100">{publishedCount}</p>
          <p className="text-sm text-emerald-200/90">Publicados</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
          <p className="text-2xl font-bold text-amber-100">{draftCount}</p>
          <p className="text-sm text-amber-200/90">Rascunhos</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-4 py-3">Tutorial</th>
              <th className="px-4 py-3">Autor</th>
              <th className="px-4 py-3">Categoria</th>
              <th className="px-4 py-3">Duração</th>
              <th className="px-4 py-3">Views</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                  Nenhum tutorial encontrado.
                </td>
              </tr>
            ) : (
              tutorials.map((tut) => (
                <tr key={tut.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {tut.thumbnailUrl ? (
                        <img
                          src={tut.thumbnailUrl}
                          alt={tut.title}
                          className="h-10 w-14 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-14 items-center justify-center rounded bg-white/5 text-slate-500">
                          <Eye className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-white truncate max-w-[250px]">{tut.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[250px]">{tut.description ?? "Sem descrição"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={tut.author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(tut.author.fullName)}&background=2563eb&color=fff&size=24`}
                        alt={tut.author.fullName}
                        className="h-5 w-5 rounded-full"
                      />
                      <span className="text-slate-300 text-xs">@{tut.author.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {tut.category ? (
                      <Badge variant="sky" className="text-[10px]">{tut.category.name}</Badge>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">
                    {formatDuration(tut.duration)}
                  </td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{tut.viewCount}</td>
                  <td className="px-4 py-3">
                    {tut.isPublished ? (
                      <StatusBadge status="APPROVED" label="Publicado" />
                    ) : (
                      <StatusBadge status="PENDING_REVIEW" label="Rascunho" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <form action={toggleTutorialPublishAction.bind(null, tut.id)}>
                        <button
                          type="submit"
                          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                            tut.isPublished
                              ? "border-amber-400/30 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20"
                              : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300 hover:bg-emerald-400/20"
                          }`}
                        >
                          {tut.isPublished ? "Despublicar" : "Publicar"}
                        </button>
                      </form>
                      {tut.isPublished && (
                        <Link
                          href={`${APP_URL}/tutorials/${tut.slug}`}
                          target="_blank"
                          className="text-xs text-slate-400 hover:text-slate-200"
                        >
                          Ver
                        </Link>
                      )}
                      <form action={deleteTutorialModeratorAction.bind(null, tut.id)}>
                        <button
                          type="submit"
                          title="Excluir tutorial"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-red-500/30 text-slate-400 transition hover:border-red-500/60 hover:text-red-400"
                          onClick={(e) => {
                            if (!confirm(`Excluir o tutorial "${tut.title}" permanentemente?`)) {
                              e.preventDefault();
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
