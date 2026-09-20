import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { activatePremiumTrial } from "@/services/premium.service";

export const POST = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  try {
    await activatePremiumTrial(userId);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
