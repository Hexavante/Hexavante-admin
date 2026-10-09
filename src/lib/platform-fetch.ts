"use client";

import { desktopApiFetch } from "@/lib/desktop-api";
import { isTauriDesktop } from "@/lib/native-app";

const DESKTOP_PATHS: Record<string, string> = {
  "/api/presence/heartbeat": "/api/v1/users/me/heartbeat",
  "/api/notifications": "/api/v1/notifications",
  "/api/conversations": "/api/v1/conversations",
  "/api/v1/user/profile/photo": "/api/v1/users/me/avatar",
};
function mapDesktopPath(path: string) {
  const [pathname, query = ""] = path.split("?", 2);
  const mapped = DESKTOP_PATHS[pathname] ?? pathname.replace(/^\/api\/moderation\//, "/api/v1/moderation/");
  return query ? `${mapped}?${query}` : mapped;
}
export function platformFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (isTauriDesktop() && typeof input === "string" && input.startsWith("/api/")) return desktopApiFetch(mapDesktopPath(input), init);
  return fetch(input, init);
}
