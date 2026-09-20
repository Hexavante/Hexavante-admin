import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { ContentPolicyError } from "@/lib/profanity-filter";
import {
  getConversationMessages,
  markConversationRead,
  sendDirectMessage,
  serializeDirectMessage,
} from "@/services/direct-message.service";

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
    const messages = await getConversationMessages(id, userId, { since, limit: 100 });
    if (!since) {
      await markConversationRead(id, userId);
    }
    return NextResponse.json(messages.map(serializeDirectMessage));
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(404, e.message);
    }
    throw e;
  }
});

export const PATCH = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;

  try {
    await markConversationRead(id, userId);
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(404, e.message);
    }
    throw e;
  }
});

export const POST = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const body =
    payload && typeof payload === "object" && "body" in payload
      ? String((payload as { body: unknown }).body ?? "")
      : "";

  try {
    const message = await sendDirectMessage(id, userId, body);
    return NextResponse.json(serializeDirectMessage(message), { status: 201 });
  } catch (e) {
    if (e instanceof ContentPolicyError) {
      throw new ApiError(422, e.message);
    }
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      const status = e.message.includes("não encontrada") ? 404 : 400;
      throw new ApiError(status, e.message);
    }
    throw e;
  }
});
