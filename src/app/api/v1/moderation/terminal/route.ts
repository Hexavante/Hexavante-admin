import { NextResponse } from "next/server";
import { createWebSession } from "@/services/web-session.service";
import { prisma } from "@/lib/prisma";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAdmin } from "@/lib/api-auth";
import { executeModerationCommand } from "@/services/moderation-admin.service";


export const POST = withApiErrorHandling(async (req) => {
  const ctx = await requireBearerAdmin(req);

  let body: { command?: string };
  try {
    body = (await req.json()) as { command?: string };
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  if (!body.command?.trim()) {
    throw new ApiError(400, "Comando vazio");
  }

  if (body.command.length > 500) {
    throw new ApiError(400, "Comando muito longo");
  }

  const result = await executeModerationCommand(body.command, ctx.userId, ctx.roles);

  const data = result.data as { action?: string; userId?: string; username?: string } | undefined;
  if (data?.action === "impersonate" && data.userId) {
    const target = await prisma.user.findUnique({ where: { id: data.userId }, select: { id: true } });
    if (target) {
      const session = await createWebSession(target.id);
      await prisma.session.update({ where: { id: session.id }, data: { impersonatedBy: ctx.userId } });
      const response = NextResponse.json({
        ...result,
        message: `✅ Iniciando visualização como @${data.username}...`,
        data: { redirect: "/" },
      });
      response.cookies.set("__Secure-hexavante.session_token", session.token, {
        httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
        maxAge: 7 * 24 * 60 * 60, domain: process.env.NODE_ENV === "production" ? ".hexavante.com.br" : undefined,
      });
      return response;
    }
  }

  return NextResponse.json(result);
});
