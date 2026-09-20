import { getAdminSession } from "@/lib/admin-auth";
import { ModerationNav } from "@/components/moderation/moderation-nav";
import { SpotlightSearch } from "@/components/moderation/spotlight-search";
import { PageHeader } from "@/components/ui/page-header";
import { PageShell } from "@/components/ui/page-shell";
import { canModerate } from "@/lib/permissions";
import { Shield, LogOut } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminSession();
  if (!user) redirect("/admin-login");
  if (!canModerate(user.roles)) redirect("/");

  const pathname = (await headers()).get("x-pathname") ?? "/admin";

  return (
    <PageShell size="lg">
      <div className="flex items-center justify-between">
        <PageHeader
          badge="Administração"
          icon={Shield}
          title="Moderação"
          description="Gerencie usuários, conteúdo e a plataforma."
        />
        <form action={async () => {
          "use server";
          const { deleteAdminSession } = await import("@/lib/admin-auth");
          await deleteAdminSession();
          redirect("/admin-login");
        }}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:border-red-500/30 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
      <ModerationNav pathname={pathname} />
      <div className="mt-6">{children}</div>
      <SpotlightSearch />
      <p className="mt-8 text-center text-xs text-slate-600">
        Atalho: <kbd className="rounded border border-white/10 px-1">Ctrl+K</kbd> busca rápida
      </p>
    </PageShell>
  );
}
