import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import {
  getOrCreateConversation,
  getOrCreateConversationByUsername,
  listInboxConversations,
  getUnreadDirectMessageCount,
} from "@/services/direct-message.service";

const startConversationSchema = z
  .object({
    recipientUserId: z.string().min(1).optional(),
    username: z.string().min(1).optional(),
  })
  .refine((data) => data.recipientUserId || data.username, {
    message: "Informe recipientUserId ou username",
  });

function serializeInboxItem(item: Awaited<ReturnType<typeof listInboxConversations>>[number]) {
  return {
    id: item.id,
    otherUser: item.otherUser,
    lastMessage: item.lastMessage
      ? {
          ...item.lastMessage,
          createdAt: item.lastMessage.createdAt.toISOString(),
          readAt: item.lastMessage.readAt?.toISOString() ?? null,
        }
      : null,
    unreadCount: item.unreadCount,
    lastMessageAt: item.lastMessageAt?.toISOString() ?? null,
    createdAt: item.createdAt.toISOString(),
  };
}

export const GET = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  const [conversations, unreadCount] = await Promise.all([
    listInboxConversations(userId),
    getUnreadDirectMessageCount(userId),
  ]);

  return NextResponse.json({
    conversations: conversations.map(serializeInboxItem),
    unreadCount,
  });
});

export const POST = withApiErrorHandling(async (req) => {
  const userId = await requireBearerAuth(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError(400, "Corpo da requisição inválido");
  }

  const parsed = startConversationSchema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.issues[0]?.message ?? "Dados inválidos");
  }

  try {
    const conversation = parsed.data.recipientUserId
      ? await getOrCreateConversation(userId, parsed.data.recipientUserId)
      : await getOrCreateConversationByUsername(userId, parsed.data.username!);

    const otherUser =
      conversation.participantAId === userId
        ? conversation.participantB
        : conversation.participantA;

    return NextResponse.json(
      {
        conversationId: conversation.id,
        otherUser,
      },
      { status: 201 },
    );
  } catch (e) {
    if (e instanceof ApiError) throw e;
    if (e instanceof Error) {
      throw new ApiError(400, e.message);
    }
    throw e;
  }
});
