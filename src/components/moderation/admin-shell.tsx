"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  ChevronRight,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  MonitorCog,
  Radio,
  ReceiptText,
  Settings,
  ShieldCheck,
  Terminal,
  Tags,
  UserCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/cn";

type AdminUser = {
  name: string;
  username: string | null;
  avatarUrl: string | null;
  roles: string[];
};

type AdminItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  match?: string[];
};

type AdminSection = {
  label: string;
  items: AdminItem[];
};

const NAVIGATION: AdminSection[] = [
  {
    label: "Visão geral",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/relatorios", label: "Relatórios", icon: BarChart3, adminOnly: true },
    ],
  },
  {
    label: "Operação",
    items: [
      { href: "/admin/usuarios", label: "Usuários", icon: Users },
      { href: "/admin/perfis", label: "Perfis", icon: UserCheck, adminOnly: true },
      { href: "/admin/denuncias", label: "Denúncias", icon: Bell, adminOnly: true },
      { href: "/admin/conteudo", label: "Conteúdo", icon: FolderKanban, match: ["/admin/cursos", "/admin/simulados"] },
      { href: "/admin/tutorials", label: "Tutoriais", icon: MonitorCog },
      { href: "/admin/instrutores", label: "Instrutores", icon: GraduationCap },
      { href: "/admin/logs", label: "Auditoria", icon: ListChecks },
    ],
  },
  {
    label: "Plataforma",
    items: [
      { href: "/admin/financeiro", label: "Financeiro", icon: ReceiptText, adminOnly: true },
      { href: "/admin/broadcasts", label: "Broadcasts", icon: Megaphone, adminOnly: true },
      { href: "/admin/certificados", label: "Certificados", icon: FileText, adminOnly: true },
      { href: "/admin/salas", label: "Salas ao vivo", icon: Radio, adminOnly: true },
      { href: "/admin/categorias", label: "Categorias", icon: Tags },
      { href: "/admin/terminal", label: "Terminal", icon: Terminal },
      { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
];

function allowed(item: AdminItem, roles: string[]) {
  return !item.adminOnly || roles.includes("ADMIN") || roles.includes("SUPERADMIN");
}

function matchesPath(item: AdminItem, pathname: string) {
  const paths = [item.href, ...(item.match ?? [])];
  return paths.some((path) =>
    path === "/admin" ? pathname === path : pathname === path || pathname.startsWith(`${path}/`),
  );
}

function pageTitle(pathname: string) {
  const item = NAVIGATION.flatMap((section) => section.items).find((entry) => matchesPath(entry, pathname));
  return item?.label ?? "Administração";
}

function AdminNavigation({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  return (
    <>
      {NAVIGATION.map((section) => {
        const items = section.items.filter((item) => allowed(item, user.roles));
        if (!items.length) return null;

        return (
          <SidebarGroup key={section.label} className="px-3 py-1">
            <SidebarGroupLabel className="hx-sidebar-group-label">{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {items.map((item) => {
                  const active = matchesPath(item, pathname);
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={cn("hx-sidebar-link", active && "hx-sidebar-link-active")}
                      >
                        <Link href={item.href}>
                          <span className={cn("hx-sidebar-link-icon", active && "hx-sidebar-link-icon-active")}>
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span>{item.label}</span>
                          {active && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-70" aria-hidden="true" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
}

function AdminSidebar({ user, signOut }: { user: AdminUser; signOut: React.ReactNode }) {
  return (
    <Sidebar collapsible="offcanvas" className="hx-sidebar-shell hx-admin-sidebar">
      <SidebarHeader className="hx-sidebar-header border-b border-sidebar-border px-4 py-4">
        <Link href="/admin" className="hx-sidebar-brand" aria-label="Hexavante Administração">
          <span className="hx-sidebar-brand-mark">
            <Image src="/brand/hexavante-logo.webp" alt="" width={36} height={36} className="h-9 w-9 object-contain" priority />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-extrabold tracking-tight text-[hsl(var(--sidebar-foreground))]">HEXAVANTE</span>
            <span className="hx-sidebar-brand-subtitle block text-[11px] font-semibold uppercase tracking-[0.12em]">Administração</span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="hx-sidebar-content gap-3 py-4">
        <AdminNavigation user={user} />
      </SidebarContent>

      <SidebarFooter className="hx-sidebar-footer border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-white/[0.025] p-2.5">
          <Avatar src={user.avatarUrl} alt={user.name} size="sm" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[hsl(var(--sidebar-foreground))]">{user.name}</span>
            <span className="block truncate text-xs text-[hsl(var(--sidebar-foreground)/0.52)]">{user.roles.includes("SUPERADMIN") ? "Superadministrador" : user.roles.includes("ADMIN") ? "Administrador" : "Moderador"}</span>
          </span>
        </div>
        {signOut}
      </SidebarFooter>
    </Sidebar>
  );
}

function AdminTopbar() {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-sidebar-border bg-[hsl(var(--background)/0.78)] px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1600px] items-center gap-3">
        <SidebarTrigger className="-ml-2 text-[hsl(var(--sidebar-foreground)/0.7)] hover:text-[hsl(var(--sidebar-foreground))]" />
        <div className="h-6 w-px bg-sidebar-border" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--sidebar-foreground)/0.48)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[hsl(var(--sidebar-highlight))]" aria-hidden="true" />
            <span>Central administrativa</span>
          </div>
          <h1 className="truncate text-base font-bold tracking-tight text-[hsl(var(--sidebar-foreground))] sm:text-lg">{title}</h1>
        </div>
        <Link href="/admin/denuncias" className="relative rounded-lg p-2 text-[hsl(var(--sidebar-foreground)/0.62)] transition hover:bg-sidebar-accent hover:text-[hsl(var(--sidebar-foreground))]" aria-label="Ver denúncias">
          <Bell className="h-4.5 w-4.5" aria-hidden="true" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 ring-2 ring-[hsl(var(--background))]" aria-hidden="true" />
        </Link>
        <Link href="/admin/terminal">
          <Button variant="outline" size="sm" className="hidden gap-2 sm:inline-flex">
            <Terminal className="h-3.5 w-3.5" aria-hidden="true" />
            Terminal
          </Button>
        </Link>
      </div>
    </header>
  );
}

export function AdminShell({ children, user, signOut }: { children: React.ReactNode; user: AdminUser; signOut: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar user={user} signOut={signOut} />
      <SidebarInset className="min-h-svh bg-transparent">
        <AdminTopbar />
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <main id="main-content" className="space-y-8">{children}</main>
          <footer className="mt-12 border-t border-sidebar-border py-5 text-center text-xs text-[hsl(var(--sidebar-foreground)/0.42)]">
            Hexavante · Central administrativa
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
