import type { AuthSession } from "@/lib/auth-session";
import { auth } from "@/auth";

export async function safeAuth(): Promise<AuthSession | null> {
  try {
    return await auth();
  } catch {
    return null;
  }
}
