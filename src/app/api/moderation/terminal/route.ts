import { getAdminSession } from "@/lib/admin-auth";
import { canModerate } from "@/lib/permissions";
import { executeModerationCommand } from "@/services/moderation-admin.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session?.id || !canModerate(session.roles)) {
    return NextResponse.json({ status: "error", message: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as { command?: string };
  if (!body.command?.trim()) {
    return NextResponse.json({ status: "error", message: "Comando vazio." }, { status: 400 });
  }

  try {
    const result = await executeModerationCommand(
      body.command,
      session.id,
      session.roles ?? [],
    );
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao executar comando.";
    return NextResponse.json({ status: "error", message }, { status: 400 });
  }
}
