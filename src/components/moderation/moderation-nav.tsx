"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  exact?: boolean;
  /** Prefixos adicionais que iluminam esta aba (ex.: editores de conteúdo). */
  match?: string[];
  /** Telas novas: só ADMIN/SUPERADMIN. */
  adminOnly?: boolean;
};

type Group = {
  id: string;
  label: string;
  tabs: Tab[];
};

const GROUPS: Group[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    tabs: [
      { href: "/admin", label: "Visão Geral", exact: true },
      { href: "/admin/relatorios", label: "Relatórios", adminOnly: true },
    ],
  },
  {
    id: "moderacao",
    label: "Moderação",
    tabs: [
      { href: "/admin/usuarios", label: "Usuários" },
      { href: "/admin/perfis", label: "Perfis", adminOnly: true },
      { href: "/admin/denuncias", label: "Denúncias", adminOnly: true },
      { href: "/admin/conteudo", label: "Conteúdo", match: ["/admin/cursos", "/admin/simulados"] },
      { href: "/admin/tutorials", label: "Tutoriais" },
      { href: "/admin/instrutores", label: "Instrutores" },
      { href: "/admin/logs", label: "Logs" },
    ],
  },
  {
    id: "sistema",
    label: "Sistema",
    tabs: [
      { href: "/admin/financeiro", label: "Financeiro", adminOnly: true },
      { href: "/admin/broadcasts", label: "Broadcasts", adminOnly: true },
      { href: "/admin/certificados", label: "Certificados", adminOnly: true },
      { href: "/admin/salas", label: "Salas ao vivo", adminOnly: true },
      { href: "/admin/categorias", label: "Categorias" },
      { href: "/admin/terminal", label: "Terminal" },
      { href: "/admin/configuracoes", label: "Configurações" },
    ],
  },
];

function isTabActive(tab: Tab, pathname: string): boolean {
  if (tab.exact) return pathname === tab.href;
  const prefixes = [tab.href, ...(tab.match ?? [])];
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

type Props = {
  roles: string[];
};

export function ModerationNav({ roles }: Props) {
  // O layout compartilhado do /admin não é refeito a cada navegação client-side
  // (renderização parcial do App Router), então o ativo é lido da rota atual
  // no cliente — assim o indicador acompanha a tela sem refresh.
  const pathname = usePathname();

  const visible = (tabs: Tab[]) =>
    tabs.filter((tab) => !tab.adminOnly || roles.includes("ADMIN") || roles.includes("SUPERADMIN"));

  const groups = GROUPS.map((group) => ({ ...group, tabs: visible(group.tabs) })).filter(
    (group) => group.tabs.length > 0,
  );

  const activeGroup =
    groups.find((group) => group.tabs.some((tab) => isTabActive(tab, pathname))) ?? groups[0];

  return (
    <nav aria-label="Navegação principal da moderação" className="mb-6">
      {/* Grupos */}
      <div className="hx-segment-nav-inline mb-3">
        {groups.map((group) => {
          const active = group.id === activeGroup?.id;
          const firstTab = group.tabs[0];
          return (
            <Link
              key={group.id}
              href={firstTab.href}
              className={cn(
                "hx-segment-link",
                active ? "hx-segment-link-active" : "hx-segment-link-inactive",
              )}
            >
              {group.label}
            </Link>
          );
        })}
      </div>

      {/* Sub-abas do grupo ativo */}
      <div className="hx-segment-nav-inline">
        {activeGroup?.tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "hx-segment-link",
              isTabActive(tab, pathname)
                ? "hx-segment-link-active"
                : "hx-segment-link-inactive",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
