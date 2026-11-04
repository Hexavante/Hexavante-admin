"use server";

import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import { createImpersonation, deleteWebSession } from "@/services/web-session.service";
import { writeModerationLog } from "@/services/moderation-admin.service";

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session) throw new Error("Faça login para continuar.");
  if (!session.roles.includes("SUPERADMIN")) throw new Error("Sem permissão: impersonação exige SUPERADMIN.");
  return session;
}
function cookieOptions() { return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 7 * 24 * 60 * 60, domain: process.env.NODE_ENV === "production" ? ".hexavante.com.br" : undefined }; }

export async function impersonateUser(userId: string) {
  const admin = await requireSuperAdmin();
  const { session, user } = await createImpersonation(admin.id, userId);
  const store = await cookies();
  store.set("__Secure-hexavante.session_token", session.token, cookieOptions());
  return { success: true, user };
}

export async function stopImpersonating() {
  const admin = await getAdminSession();
  const store = await cookies();
  const token = store.get("__Secure-hexavante.session_token")?.value ?? store.get("hexavante.session_token")?.value;
  await deleteWebSession(token);
  store.delete("__Secure-hexavante.session_token");
  store.delete("hexavante.session_token");
  if (admin) await writeModerationLog({ moderatorId: admin.id, action: "IMPERSONATE", description: "Encerrou impersonação" });
  return { success: true };
}
