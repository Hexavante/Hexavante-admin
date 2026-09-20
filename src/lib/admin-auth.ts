import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { canModerate } from "./permissions";

const COOKIE = "hx_admin_session";
// Sessão longa (30 dias) com renovação deslizante: continua logado.
const SESSION_HOURS = 30 * 24;
const RENEW_WITHIN_HOURS = 7 * 24;

export async function getAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (!token) return null;

    const session = await prisma.adminSession.findUnique({
      where: { token },
    });
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      await prisma.adminSession.delete({ where: { id: session.id } });
      return null;
    }

    // Renovação deslizante: faltando menos de 7 dias, estende por mais 30
    if (session.expiresAt.getTime() - Date.now() < RENEW_WITHIN_HOURS * 60 * 60 * 1000) {
      const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
      await prisma.adminSession.update({ where: { id: session.id }, data: { expiresAt } });
      const cookieStore = await cookies();
      cookieStore.set(COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_HOURS * 60 * 60,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, fullName: true, email: true, username: true, avatarUrl: true },
    });
    if (!user) return null;

    const userRoles = await prisma.userRole.findMany({
      where: { userId: session.userId },
      include: { role: { select: { name: true } } },
    });
    const roles = userRoles.map((r) => r.role.name);

    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      roles,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const user = await getAdminSession();
  if (!user) throw new Error("UNAUTHORIZED");
  if (!canModerate(user.roles)) throw new Error("FORBIDDEN");
  return user;
}

export async function createAdminSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000);

  await prisma.adminSession.create({
    data: { userId, token, expiresAt },
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  });

  return token;
}

export async function deleteAdminSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE)?.value;
    if (token) {
      await prisma.adminSession.deleteMany({ where: { token } });
    }
    cookieStore.delete(COOKIE);
  } catch {}
}

export async function createVerificationCode(userId: string, email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.adminVerificationCode.deleteMany({
    where: { userId, used: false },
  });

  await prisma.adminVerificationCode.create({
    data: { userId, code, email, expiresAt },
  });

  return code;
}

export async function verifyCode(userId: string, code: string) {
  const record = await prisma.adminVerificationCode.findFirst({
    where: { userId, code, used: false, expiresAt: { gt: new Date() } },
  });
  if (!record) return false;

  await prisma.adminVerificationCode.update({
    where: { id: record.id },
    data: { used: true },
  });

  return true;
}
