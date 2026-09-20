export const dynamic = 'force-dynamic';

import { OverviewDashboard } from "@/components/moderation/overview-dashboard";
import { getPlatformModerationStats } from "@/services/moderation-admin.service";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ModerationDashboardPage() {
  const [stats, pendingTutorials] = await Promise.all([
    getPlatformModerationStats(),
    prisma.tutorial.count({ where: { isPublished: false } }),
  ]);

  return (
    <div className="space-y-8">
      <OverviewDashboard initial={stats} />

      <section>
        <h2 className="text-lg font-bold text-white">Acesso rápido</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/instrutores"
            className="hx-stat transition hover:border-sky-400/35 hover:bg-white/[0.06]"
          >
            <p className="text-3xl font-bold text-sky-300">{stats.pendingApplications}</p>
            <p className="mt-1 font-medium text-white">Instrutores pendentes</p>
          </Link>
          <Link
            href="/admin/cursos"
            className="hx-stat transition hover:border-sky-400/35 hover:bg-white/[0.06]"
          >
            <p className="text-3xl font-bold text-sky-300">{stats.pendingCourses}</p>
            <p className="mt-1 font-medium text-white">Cursos pendentes</p>
          </Link>
          <Link
            href="/admin/tutorials"
            className="hx-stat transition hover:border-violet-400/35 hover:bg-white/[0.06]"
          >
            <p className="text-3xl font-bold text-violet-300">{pendingTutorials}</p>
            <p className="mt-1 font-medium text-white">Tutoriais pendentes</p>
            <p className="mt-1 text-sm text-slate-400">{stats.publishedTutorials} publicados</p>
          </Link>
          <Link
            href="/admin/terminal"
            className="hx-stat transition hover:border-green-400/35 hover:bg-white/[0.06]"
          >
            <p className="text-3xl font-bold text-green-400">$</p>
            <p className="mt-1 font-medium text-white">Terminal CLI</p>
            <p className="mt-1 text-sm text-slate-400">Comandos de moderação</p>
          </Link>
          <Link
            href="/admin/categorias"
            className="hx-stat transition hover:border-amber-400/35 hover:bg-white/[0.06]"
          >
            <p className="text-3xl font-bold text-amber-300">🏷️</p>
            <p className="mt-1 font-medium text-white">Categorias pendentes</p>
            <p className="mt-1 text-sm text-slate-400">Aprovar sugestões de instrutores</p>
          </Link>
          <Link
            href="/admin/conteudo"
            className="hx-stat transition hover:border-teal-400/35 hover:bg-white/[0.06]"
          >
            <p className="text-3xl font-bold text-teal-300">📋</p>
            <p className="mt-1 font-medium text-white">Gerenciar conteúdo</p>
            <p className="mt-1 text-sm text-slate-400">Cursos e simulados</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
