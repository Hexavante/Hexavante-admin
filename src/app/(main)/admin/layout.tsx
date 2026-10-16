import { getAdminSession } from "@/lib/admin-auth";
import { SpotlightSearch } from "@/components/moderation/spotlight-search";
import { AdminShell } from "@/components/moderation/admin-shell";
import { canModerate } from "@/lib/permissions";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminSession();
  if (!user) redirect("/admin-login");
  if (!canModerate(user.roles)) redirect("/");

  const signOut = (
    <form action={async () => {
      "use server";
      const { deleteAdminSession } = await import("@/lib/admin-auth");
      await deleteAdminSession();
      redirect("/admin-login");
    }}>
      <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 text-[hsl(var(--sidebar-foreground)/0.65)] hover:text-red-300">
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Encerrar sessão
      </Button>
    </form>
  );

  return (
    <AdminShell user={user} signOut={signOut}>
      {children}
      <SpotlightSearch />
    </AdminShell>
  );
}
