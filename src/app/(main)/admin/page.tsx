export const dynamic = 'force-dynamic';

import { OverviewDashboard } from "@/components/moderation/overview-dashboard";
import { getPlatformModerationStats } from "@/services/moderation-admin.service";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import {
  UserCheck,
  GraduationCap,
  Video,
  Terminal,
  Tag,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/cn";

type QuickAccessItem = {
  href: string;
  label: string;
  count?: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isSymbol?: boolean;
};

export default async function ModerationDashboardPage() {
  const [stats, pendingTutorials] = await Promise.all([
    getPlatformModerationStats(),
    prisma.tutorial.count({ where: { isPublished: false } }),
  ]);

  const quickAccess: QuickAccessItem[] = [
    {
      href: "/admin/instrutores",
      label: "Instrutores pendentes",
      count: stats.pendingApplications,
      description: "Aprovar ou rejeitar candidaturas",
      icon: UserCheck,
      color: "sky",
    },
    {
      href: "/admin/cursos",
      label: "Cursos pendentes",
      count: stats.pendingCourses,
      description: "Revisar cursos submetidos",
      icon: GraduationCap,
      color: "sky",
    },
    {
      href: "/admin/tutorials",
      label: "Tutoriais pendentes",
      count: pendingTutorials,
      description: `${stats.publishedTutorials} publicados`,
      icon: Video,
      color: "violet",
    },
    {
      href: "/admin/terminal",
      label: "Terminal CLI",
      description: "Comandos de moderação",
      icon: Terminal,
      color: "green",
      isSymbol: true,
    },
    {
      href: "/admin/categorias",
      label: "Categorias pendentes",
      description: "Aprovar sugestões de instrutores",
      icon: Tag,
      color: "amber",
    },
    {
      href: "/admin/conteudo",
      label: "Gerenciar conteúdo",
      description: "Cursos e simulados",
      icon: FolderOpen,
      color: "teal",
    },
  ];

  return (
    <div className="space-y-8">
      <OverviewDashboard initial={stats} />

      {/* BLOCO 5 - Acessos Rápidos */}
      <section aria-labelledby="acesso-rapido">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-9 w-9 flex items-center justify-center rounded-lg bg-[hsl(var(--sidebar-highlight)/0.1)] border border-[hsl(var(--sidebar-highlight)/0.2)]">
              <svg className="h-5 w-5 text-[hsl(var(--sidebar-highlight))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8" />
                <path d="M12 17v4" />
              </svg>
            </span>
            <div>
              <h2 id="acesso-rapido" className="text-lg font-bold text-white">Acesso rápido</h2>
              <p className="text-xs text-slate-400">Atalhos para áreas que precisam de atenção</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickAccess.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group hx-card-interactive p-4 min-h-[112px] flex flex-col justify-between"
              aria-label={item.label}
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors",
                  item.isSymbol
                    ? "bg-green-500/10 border-green-500/20 text-green-400"
                    : `bg-${item.color}-500/10 border-${item.color}-500/20 text-${item.color}-400`
                )}>
                  {item.isSymbol ? (
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                  )}
                </div>
                {typeof item.count === "number" && item.count > 0 && (
                  <span className="hx-badge hx-badge-primary">
                    {item.count}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="font-medium text-white group-hover:text-[hsl(var(--sidebar-highlight))] transition-colors">
                  {item.label}
                </p>
                <p className="mt-1 text-xs text-slate-400">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}