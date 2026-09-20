import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { ContentPolicyError } from "@/lib/profanity-filter";
import { assertUserCanInteract } from "@/lib/moderation/status";
import { serializeLiveChatMessage } from "@/lib/api-live";
import { sendChatMessageSchema } from "@/lib/validations/live-room";
import {
  getLiveChatMessagesSince,
  sendLiveChatMessage,
} from "@/services/live-room.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : undefined;

  if (sinceParam && since && Number.isNaN(since.getTime())) {
    throw new ApiError(400, "Parâmetro since inválido");
  }

  try {
    const messages = await getLiveChatMessagesSince(id, userId, since);
    return NextResponse.json(messages.map(serializeLiveChatMessage));
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      const status = e.message.includes("acesso") ? 403 : 500;
      throw new ApiError(status, e.message);
    }
    throw e;
  }
});

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = sendChatMessageSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Mensagem inválida");
  }

  try {
    await assertUserCanInteract(userId);
    const created = await sendLiveChatMessage(id, userId, parsed.data.message);
    return NextResponse.json(serializeLiveChatMessage(created), { status: 201 });
  } catch (e) {
    if (e instanceof ContentPolicyError) {
      throw new ApiError(422, e.message);
    }
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      const status = e.message.includes("acesso") ? 403 : 400;
      throw new ApiError(status, e.message);
    }
    throw e;
  }
});
