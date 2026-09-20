import { cookies } from "next/headers";
import { getApiUrl } from "@/lib/auth-session";

/** Proxy do heartbeat: encaminha o cookie de sessão para a API. */
export async function POST() {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    if (!cookieHeader) return Response.json({ ok: false }, { status: 401 });

    const res = await fetch(`${getApiUrl()}/api/v1/users/me/heartbeat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", cookie: cookieHeader },
      body: JSON.stringify({}),
      cache: "no-store",
    });
    return Response.json({ ok: res.ok }, { status: res.ok ? 200 : res.status });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
