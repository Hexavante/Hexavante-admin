import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuthContext, signApiToken } from "@/lib/api-auth";
import { getActiveModerationStatus } from "@/lib/moderation/status";
import { prisma } from "@/lib/prisma";

export const POST = withApiErrorHandling(async (req) => {
  const { userId } = await requireBearerAuthContext(req);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: { include: { role: true } },
    },
  });

  if (!user) {
    throw new ApiError(401, "Usuário não encontrado");
  }

  const moderationStatus = await getActiveModerationStatus(user.id);
  if (moderationStatus.isBanned) {
    throw new ApiError(403, "Conta suspensa");
  }

  const roles = user.roles.map((row) => row.role.name);
  const token = await signApiToken(user.id, roles);

  return NextResponse.json({
    token,
    user: {
      id: user.id,
      name: user.fullName,
      email: user.email,
      username: user.username,
      roles,
    },
  });
});
