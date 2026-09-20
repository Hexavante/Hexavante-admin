import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export const GET = withApiErrorHandling(async (req: Request) => {
  const userId = await requireBearerAuth(req);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
      xp: true,
      wallet: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "Usuário não encontrado");
  }

  return NextResponse.json({
    id: user.id,
    name: user.fullName,
    email: user.email,
    username: user.username,
    avatarUrl: user.avatarUrl,
    isPremium: user.isPremium,
    roles: user.roles.map((r) => r.role.name),
    xp: user.xp
      ? {
          level: user.xp.level,
          currentXp: user.xp.currentXp,
          totalXp: user.xp.totalXp,
        }
      : null,
    coins: user.wallet?.coins ?? 0,
  });
});
