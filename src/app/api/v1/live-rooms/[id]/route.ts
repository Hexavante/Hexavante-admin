import { NextResponse } from "next/server";
import { ApiError, withApiErrorHandling } from "@/lib/api-error";
import { requireBearerAuth } from "@/lib/api-auth";
import { serializeLiveRoomSummary } from "@/lib/api-live";
import { getLiveRoom } from "@/services/live-room.service";

export const GET = withApiErrorHandling(async (req, ctx) => {
  const userId = await requireBearerAuth(req);
  const { id } = await ctx.params;

  const room = await getLiveRoom(id);
  if (!room) {
    throw new ApiError(404, "Sala não encontrada");
  }

  const isParticipant = room.participants.some((p) => p.userId === userId && !p.leftAt);
  const isInstructor = room.instructorId === userId;
  const activeParticipants = room.participants.filter((p) => !p.leftAt);

  return NextResponse.json({
    room: {
      ...serializeLiveRoomSummary(room),
      isInstructor,
      isParticipant,
      activeParticipants: activeParticipants.map((p) => ({
        userId: p.userId,
        username: p.user.username,
        fullName: p.user.fullName,
        joinedAt: p.joinedAt.toISOString(),
      })),
    },
  });
});
