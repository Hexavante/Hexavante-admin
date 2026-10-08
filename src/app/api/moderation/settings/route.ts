import { getAdminSession } from "@/lib/admin-auth";
import { canModerate } from "@/lib/permissions";
import { getPlatformSettingsSnapshot } from "@/services/platform-settings.service";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getAdminSession();
  if (!session?.id || !canModerate(session.roles)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const roles = session.roles ?? [];
  const isSuperAdmin = roles.includes("SUPERADMIN");
  const settings = await getPlatformSettingsSnapshot();

  return NextResponse.json({
    ...settings,
    canManageMaintenance: isSuperAdmin,
    canImpersonate: isSuperAdmin,
  });
}
