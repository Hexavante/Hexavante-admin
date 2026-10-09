import { cookies } from "next/headers";
import { getWebUserForToken } from "@/services/web-session.service";

export interface AuthSession {
  user: { id: string; name: string; email: string; image: string | null; username: string | null; roles: string[] } | null;
  session?: { expiresAt: string };
  expires: string;
}

export async function getApiSession(): Promise<AuthSession | null> {
  try {
    const store = await cookies();
    const token = store.get("__Secure-hexavante.session_token")?.value ?? store.get("hexavante.session_token")?.value;
    if (!token) return null;
    const user = await getWebUserForToken(token);
    if (!user) return null;
    return {
      user: { id: user.id, name: user.name, email: user.email, image: user.avatarUrl, username: user.username, roles: user.roles },
      session: { expiresAt: user.expiresAt.toISOString() },
      expires: user.expiresAt.toISOString(),
    };
  } catch { return null; }
}

// Compatibilidade transitória enquanto ações antigas são migradas uma a uma.
export { getApiUrl } from "@/lib/api-url";
