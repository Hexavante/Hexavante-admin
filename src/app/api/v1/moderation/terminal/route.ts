import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAdmin } from "@/lib/api-auth";
import { executeModerationCommand } from "@/services/moderation-admin.service";

const API_URL =
  process.env.AUTH_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.hexavante.com.br"
    : "http://localhost:3045");

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
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const res = await fetch(`${API_URL}/admin/impersonate-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
      body: JSON.stringify({ userId: data.userId }),
    });

    if (res.ok) {
      const setCookie = res.headers.get("set-cookie");
      const response = NextResponse.json({
        ...result,
        message: `✅ Iniciando visualização como @${data.username}...`,
        data: { redirect: "/" },
      });
      if (setCookie) {
        response.headers.set("Set-Cookie", setCookie);
      }
      return response;
    }
  }

  return NextResponse.json(result);
});
