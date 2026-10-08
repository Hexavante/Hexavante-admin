"use server";

import { getAdminSession } from "@/lib/admin-auth";
import { writeModerationLog } from "@/services/moderation-admin.service";
import { cookies } from "next/headers";

const API_URL =
  process.env.AUTH_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.hexavante.com.br"
    : "http://localhost:3045");

type CookieStore = Awaited<ReturnType<typeof cookies>>;

/**
 * Impersonação é a ação mais sensível do painel: exige sessão do painel
 * (`hx_admin_session`) com SUPERADMIN — mesma política de `canImpersonate`
 * em /api/moderation/settings. A API irmã também valida o papel no servidor.
 */
async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Faça login para continuar.");
  if (!session.roles.includes("SUPERADMIN")) {
    throw new Error("Sem permissão: impersonação exige SUPERADMIN.");
  }
  return session;
}

export async function impersonateUser(userId: string) {
  const admin = await requireSuperAdmin();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_URL}/admin/impersonate-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Falha ao iniciar impersonação");
  }

  await writeModerationLog({
    moderatorId: admin.id,
    targetUserId: userId,
    action: "IMPERSONATE",
    description: "Iniciou impersonação de usuário",
    metadata: { userId },
  });

  applySetCookies(res.headers, cookieStore);

  const data = await res.json();
  return data;
}

/**
 * Sem guard rígido: precisa funcionar mesmo durante a impersonação,
 * quando a sessão ativa da plataforma é a do usuário alvo.
 * Auditoria é gravada apenas se a sessão do painel estiver presente.
 */
export async function stopImpersonating() {
  const admin = await getAdminSession();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_URL}/admin/stop-impersonating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Falha ao parar impersonação");
  }

  applySetCookies(res.headers, cookieStore);

  if (admin) {
    await writeModerationLog({
      moderatorId: admin.id,
      action: "IMPERSONATE",
      description: "Encerrou impersonação",
    });
  }

  return { success: true };
}

/**
 * Aplica os Set-Cookie devolvidos pela API no cookie store do painel.
 * Usa `getSetCookie()` (um header por cookie): `headers.get("set-cookie")`
 * concatena tudo numa string só e o antigo `split(", ")` partia
 * `Expires=Wed, 21 Oct ...` ao meio, corrompendo o parsing.
 */
function applySetCookies(headers: Headers, cookieStore: CookieStore) {
  for (const header of headers.getSetCookie()) {
    const [name, value, attrs] = parseSetCookieHeader(header);
    cookieStore.set(name, value, {
      path: attrs.Path || "/",
      httpOnly: true,
      sameSite: attrs.SameSite === "none" ? "none" : "lax",
      secure: attrs.Secure !== undefined,
      domain: attrs.Domain,
      maxAge: attrs["Max-Age"] ? parseInt(attrs["Max-Age"]) : undefined,
    });
  }
}

function parseSetCookieHeader(header: string): [string, string, Record<string, string>] {
  const parts = header.split(";").map((p) => p.trim());
  const [nameValue, ...attrs] = parts;
  const eqIndex = nameValue.indexOf("=");
  const name = nameValue.slice(0, eqIndex);
  const value = nameValue.slice(eqIndex + 1);
  const attrMap: Record<string, string> = {};
  for (const attr of attrs) {
    const eqIdx = attr.indexOf("=");
    if (eqIdx === -1) {
      attrMap[attr] = "";
    } else {
      attrMap[attr.slice(0, eqIdx)] = attr.slice(eqIdx + 1);
    }
  }
  return [name, value, attrMap];
}
