import { NextResponse } from "next/server";
import { withApiErrorHandling } from "@/lib/api-error";
import { serializeLiveRoomSummary } from "@/lib/api-live";
import {
  listAvailableLiveRooms,
  type LiveRoomListFilter,
} from "@/services/live-room.service";

function parseFilter(value: string | null): LiveRoomListFilter {
  if (value === "scheduled" || value === "live" || value === "ended") return value;
  return "all";
}

export const GET = withApiErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const filter = parseFilter(searchParams.get("status"));
  const rooms = await listAvailableLiveRooms(filter);

  return NextResponse.json({
    rooms: rooms.map(serializeLiveRoomSummary),
  });
});
