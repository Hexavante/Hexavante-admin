import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export async function createWebSession(userId: string, ipAddress?: string, userAgent?: string) {
  return prisma.session.create({
    data: { token: randomBytes(32).toString("base64url"), userId, expiresAt: new Date(Date.now() + SESSION_MS), ipAddress: ipAddress ?? null, userAgent: userAgent ?? null },
  });
}

export async function getWebSession(token: string | null | undefined) {
  if (!token) return null;
  const session = await prisma.session.findUnique({ where: { token }, include: { user: { include: { roles: { include: { role: true } } } } } });
  if (!session) return null;
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  if (session.user.banned) return null;
  return session;
}

export async function deleteWebSession(token: string | null | undefined) {
  if (token) await prisma.session.deleteMany({ where: { token } });
}

export async function getWebUserForToken(token: string) {
  const session = await getWebSession(token);
  if (!session) return null;
  return {
    id: session.user.id,
    name: session.user.fullName,
    email: session.user.email,
    username: session.user.username,
    avatarUrl: session.user.avatarUrl,
    roles: session.user.roles.map((entry) => entry.role.name),
    expiresAt: session.expiresAt,
  };
}
