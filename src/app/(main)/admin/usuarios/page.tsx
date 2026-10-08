export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-page";
import { UserTable } from "@/components/moderation/user-table";

export default async function ModerationUsersPage() {
  await requireAdminPage();

  const [total, banned, muted, staff] = await Promise.all([
    prisma.user.count(),
    // Mesma semântica dos filtros da API (bansReceived/mutesReceived isActive).
    prisma.user.count({ where: { bansReceived: { some: { isActive: true } } } }),
    prisma.user.count({ where: { mutesReceived: { some: { isActive: true } } } }),
    prisma.user.count({
      where: { roles: { some: { role: { name: { in: ["MODERATOR", "ADMIN", "SUPERADMIN"] } } } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-sm text-slate-400">Usuários</p>
        </div>
        <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          <p className="text-2xl font-bold text-red-100">{banned}</p>
          <p className="text-sm text-red-200/90">Banidos</p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3">
          <p className="text-2xl font-bold text-amber-100">{muted}</p>
          <p className="text-sm text-amber-200/90">Silenciados</p>
        </div>
        <div className="rounded-xl border border-violet-400/20 bg-violet-400/10 px-4 py-3">
          <p className="text-2xl font-bold text-violet-100">{staff}</p>
          <p className="text-sm text-violet-200/90">Staff de moderação</p>
        </div>
      </div>

      <UserTable />
    </div>
  );
}
