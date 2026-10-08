import { getAdminSession } from "@/lib/admin-auth";
import { ModerationNav } from "@/components/moderation/moderation-nav";
import { SpotlightSearch } from "@/components/moderation/spotlight-search";
import { PageHeader } from "@/components/ui/page-header";
import { PageShell } from "@/components/ui/page-shell";
import { canModerate } from "@/lib/permissions";
import { Shield, LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminSession();
  if (!user) redirect("/admin-login");
  if (!canModerate(user.roles)) redirect("/");

  return (
    <PageShell size="lg" className="max-w-[1440px]">
      {/* Header */}
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          badge="Administração"
          icon={Shield}
          title="Moderação"
          description="Gerencie usuários, conteúdo e a plataforma."
        />
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="hidden sm:block h-8 w-px bg-[hsl(var(--sidebar-border))]" aria-hidden="true" />
          <form action={async () => {
            "use server";
            const { deleteAdminSession } = await import("@/lib/admin-auth");
            await deleteAdminSession();
            redirect("/admin-login");
          }}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </Button>
          </form>
        </div>
      </header>

      {/* Navigation */}
      <ModerationNav roles={user.roles} />

      {/* Content */}
      <main className="space-y-8" id="main-content">
        {children}
      </main>

      {/* Spotlight Search */}
      <SpotlightSearch />

      {/* Footer hint */}
      <p className="mt-10 text-center text-xs text-slate-500">
        Atalho: <kbd className="rounded border border-white/10 px-1.5 py-0.5 font-mono">Ctrl+K</kbd> busca rápida
      </p>
    </PageShell>
  );
}