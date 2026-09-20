import type { AuthSession } from "@/lib/auth-session";

declare global {
  type Session = AuthSession;
}
