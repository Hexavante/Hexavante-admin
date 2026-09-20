import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const POST = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  await prisma.user.update({
    where: { id: userId },
    data: { onboardingCompletedAt: new Date() },
  });

  return NextResponse.json({ success: true });
});
