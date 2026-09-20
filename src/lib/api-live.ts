type LiveRoomRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  scheduledAt: Date;
  startedAt: Date | null;
  endedAt: Date | null;
  videoUrl: string | null;
  videoProvider: string | null;
  maxParticipants: number | null;
  course: { id: string; title: string; slug: string } | null;
  instructor: { id: string; username: string | null; fullName: string };
  _count?: { participants: number };
};

export function serializeLiveRoomSummary(room: LiveRoomRow) {
  return {
    id: room.id,
    title: room.title,
    description: room.description,
    status: room.status,
    scheduledAt: room.scheduledAt.toISOString(),
    startedAt: room.startedAt?.toISOString() ?? null,
    endedAt: room.endedAt?.toISOString() ?? null,
    videoUrl: room.videoUrl,
    videoProvider: room.videoProvider,
    maxParticipants: room.maxParticipants,
    participantCount: room._count?.participants ?? 0,
    course: room.course,
    instructor: room.instructor,
  };
}

export function serializeLiveChatMessage(msg: {
  id: string;
  userId: string;
  message: string;
  createdAt: Date;
  user: { username: string | null; fullName: string };
}) {
  return {
    id: msg.id,
    userId: msg.userId,
    username: msg.user.username,
    fullName: msg.user.fullName,
    message: msg.message,
    createdAt: msg.createdAt.toISOString(),
  };
}
