import { auth } from "@/auth";
import { canModerate } from "@/lib/permissions";
import { executeModerationCommand } from "@/services/moderation-admin.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !canModerate(session.user.roles)) {
    return NextResponse.json({ status: "error", message: "Não autorizado." }, { status: 403 });
  }

  const body = (await request.json()) as { command?: string };
  if (!body.command?.trim()) {
    return NextResponse.json({ status: "error", message: "Comando vazio." }, { status: 400 });
  }

  try {
    const result = await executeModerationCommand(
      body.command,
      session.user.id,
      session.user.roles ?? [],
    );
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao executar comando.";
    return NextResponse.json({ status: "error", message }, { status: 400 });
  }
}
