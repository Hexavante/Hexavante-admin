import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { getMaintenanceMode } from "@/services/platform-settings.service";

export const GET = withApiErrorHandling(async () => {
  const maintenance = await getMaintenanceMode();

  return NextResponse.json({
    maintenance: maintenance.enabled,
    ...(maintenance.enabled && { message: maintenance.message }),
  });
});
