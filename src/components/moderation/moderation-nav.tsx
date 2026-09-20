import Link from "next/link";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/admin", label: "Visão Geral", exact: true },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/conteudo", label: "Conteúdo" },
  { href: "/admin/tutorials", label: "Tutoriais" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/terminal", label: "Terminal" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

type Props = {
  pathname: string;
};

export function ModerationNav({ pathname }: Props) {
  return (
    <nav className="hx-segment-nav-inline mb-6">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "hx-segment-link",
              active ? "hx-segment-link-active" : "hx-segment-link-inactive",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
