import { createHash, randomInt } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { createWebSession } from "@/services/web-session.service";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

export function webDeviceFingerprint(userAgent?: string, ip?: string) {
  return createHash("sha256").update(`${userAgent ?? "unknown"}|${ip ?? "unknown"}`).digest("hex").slice(0, 64);
}

async function issueCode(userId: string, email: string, purpose: string, fingerprint?: string | null) {
  const code = String(randomInt(100000, 1000000));
  const record = await prisma.deviceVerificationCode.create({ data: { userId, code, purpose, fingerprint: fingerprint ?? null, expiresAt: new Date(Date.now() + CODE_TTL_MS) } });
  const sent = await sendEmail({
    to: email,
    subject: "Código de verificação — Hexavante",
    html: `<p>Seu código Hexavante é:</p><p style="font-size:32px;font-weight:bold;letter-spacing:8px">${code}</p><p>Ele expira em 10 minutos.</p>`,
    text: `Seu código Hexavante é ${code}. Ele expira em 10 minutos.`,
  });
  if (!sent.sent && process.env.RESEND_API_KEY) throw new Error("Não foi possível enviar o código por e-mail.");
  return record.id;
}

async function consumeCode(id: string, code: string) {
  const record = await prisma.deviceVerificationCode.findUnique({ where: { id } });
  if (!record || record.used || record.expiresAt <= new Date() || record.attempts >= MAX_ATTEMPTS) throw new Error("Código inválido ou expirado.");
  if (record.code !== code) {
    await prisma.deviceVerificationCode.update({ where: { id }, data: { attempts: { increment: 1 } } });
    throw new Error("Código inválido ou expirado.");
  }
  await prisma.deviceVerificationCode.update({ where: { id }, data: { used: true } });
  return record;
}

export async function beginWebLogin(user: { id: string; email: string }, input: { userAgent?: string; ip?: string }) {
  const account = await prisma.user.findUnique({ where: { id: user.id }, select: { emailVerified: true, twoFactorEnabled: true } });
  if (!account) throw new Error("Usuário não encontrado.");
  const fingerprint = webDeviceFingerprint(input.userAgent, input.ip);
  const device = await prisma.trustedDevice.findUnique({ where: { userId_fingerprint: { userId: user.id, fingerprint } } });
  const reason = !account.emailVerified ? "EMAIL_VERIFY" : (!device || device.revokedAt) && process.env.SKIP_DEVICE_VERIFICATION !== "true" ? "DEVICE" : account.twoFactorEnabled ? "TWO_FACTOR" : null;
  if (reason) return { requiresVerification: true as const, verificationId: await issueCode(user.id, user.email, reason, fingerprint), reason };
  await prisma.trustedDevice.updateMany({ where: { userId: user.id, fingerprint, revokedAt: null }, data: { lastSeenAt: new Date(), ipAddress: input.ip } });
  return { requiresVerification: false as const, session: await createWebSession(user.id, input.ip, input.userAgent) };
}

export async function finishWebVerification(id: string, code: string, input: { userAgent?: string; ip?: string }) {
  const record = await consumeCode(id, code);
  if (!record.fingerprint || !["DEVICE", "EMAIL_VERIFY", "TWO_FACTOR"].includes(record.purpose)) {
    throw new Error("Verificação inválida para login.");
  }
  const fingerprint = webDeviceFingerprint(input.userAgent, input.ip);
  if (record.fingerprint !== fingerprint) throw new Error("A verificação pertence a outro dispositivo.");
  await prisma.trustedDevice.upsert({
    where: { userId_fingerprint: { userId: record.userId, fingerprint } },
    create: { userId: record.userId, fingerprint, name: "Navegador Web", ipAddress: input.ip, userAgent: input.userAgent, lastSeenAt: new Date() },
    update: { revokedAt: null, ipAddress: input.ip, userAgent: input.userAgent, lastSeenAt: new Date() },
  });
  if (record.purpose === "EMAIL_VERIFY") {
    await prisma.user.update({ where: { id: record.userId }, data: { emailVerified: true } });
  }
  return createWebSession(record.userId, input.ip, input.userAgent);
}

export async function resendWebVerification(id: string) {
  const record = await prisma.deviceVerificationCode.findFirst({ where: { id, used: false }, include: { user: { select: { email: true } } } });
  if (!record || record.expiresAt <= new Date()) throw new Error("Verificação expirada. Faça login novamente.");
  if (Date.now() - record.createdAt.getTime() < RESEND_MS) throw new Error("Aguarde antes de solicitar um novo código.");
  return issueCode(record.userId, record.user.email, record.purpose, record.fingerprint);
}

export async function listWebDevices(userId: string) {
  const devices = await prisma.trustedDevice.findMany({ where: { userId }, orderBy: { lastSeenAt: "desc" } });
  return devices.map((d) => ({ id: d.id, name: d.name ?? "Dispositivo", ipAddress: d.ipAddress, lastSeenAt: d.lastSeenAt.toISOString(), revoked: Boolean(d.revokedAt), createdAt: d.createdAt.toISOString() }));
}

export async function revokeWebDevice(userId: string, deviceId: string) {
  const device = await prisma.trustedDevice.findFirst({ where: { id: deviceId, userId } });
  if (!device) throw new Error("Dispositivo não encontrado.");
  await prisma.trustedDevice.update({ where: { id: device.id }, data: { revokedAt: new Date() } });
  await prisma.session.deleteMany({ where: { userId, ...(device.ipAddress ? { ipAddress: device.ipAddress } : {}), ...(device.userAgent ? { userAgent: device.userAgent } : {}) } });
}

export async function setWebTwoFactor(userId: string, enabled: boolean) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, twoFactorEnabled: true } });
  if (!user) throw new Error("Usuário não encontrado.");
  if (enabled && !user.twoFactorEnabled) return { verificationId: await issueCode(userId, user.email, "TWO_FACTOR") };
  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: enabled } });
  return {};
}

export async function confirmWebTwoFactor(id: string, code: string, userId: string) {
  const record = await consumeCode(id, code);
  if (record.userId !== userId || record.purpose !== "TWO_FACTOR") throw new Error("Verificação inválida.");
  await prisma.user.update({ where: { id: userId }, data: { twoFactorEnabled: true } });
}

export async function updateWebPresence(userId: string, status?: string) {
  const allowed = new Set(["ONLINE", "AWAY", "STUDYING", "DND", "INVISIBLE"]);
  if (status && !allowed.has(status)) throw new Error("Status inválido.");
  await prisma.user.update({ where: { id: userId }, data: { lastSeenAt: new Date(), ...(status ? { presence: status, presenceUpdatedAt: new Date() } : {}) } });
}
