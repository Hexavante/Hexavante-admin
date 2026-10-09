"use server";

import { cookies } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { createWebSession, deleteWebSession } from "@/services/web-session.service";
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
  const target = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, fullName: true } });
  if (!target) throw new Error("Usuário não encontrado");
  const session = await createWebSession(target.id);
  await prisma.session.update({ where: { id: session.id }, data: { impersonatedBy: admin.id } });
  const store = await cookies();
  store.set("__Secure-hexavante.session_token", session.token, cookieOptions());
  await writeModerationLog({ moderatorId: admin.id, targetUserId: userId, action: "IMPERSONATE", description: "Iniciou impersonação de usuário", metadata: { userId } });
  return { success: true, user: target };
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
