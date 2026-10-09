import { auth } from "@/auth";
import { updateWebPresence } from "@/services/web-security.service";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) return Response.json({ ok: false }, { status: 401 });
    await updateWebPresence(session.user.id);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
