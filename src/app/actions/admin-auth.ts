"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createAdminSession, createVerificationCode, verifyCode, deleteAdminSession } from "@/lib/admin-auth";
import { sendEmail, adminCodeEmailHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { canModerate } from "@/lib/permissions";
import { redirect } from "next/navigation";

export type AdminAuthResult = { ok: boolean; error?: string; email?: string };

async function getUserRoles(userId: string): Promise<string[]> {
  const roles = await prisma.userRole.findMany({
    where: { userId },
    include: { role: { select: { name: true } } },
  });
  return roles.map((r) => r.role.name);
}

export async function adminLoginAction(email: string, password: string): Promise<AdminAuthResult> {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      select: { id: true, email: true, passwordHash: true },
    });
    if (!user) return { ok: false, error: "E-mail ou senha incorretos." };
    if (!user.passwordHash) return { ok: false, error: "Conta criada via OAuth. Use recuperação de senha." };

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return { ok: false, error: "E-mail ou senha incorretos." };

    const roles = await getUserRoles(user.id);
    if (!canModerate(roles)) return { ok: false, error: "Sem permissão de administração." };

    const code = await createVerificationCode(user.id, user.email);

    const emailResult = await sendEmail({
      to: user.email,
      subject: "Seu código de acesso — Hexavante",
      html: adminCodeEmailHtml(code),
      text: `Seu código de verificação Hexavante: ${code} (expira em 10 minutos)`,
    });

    if (!emailResult.sent) {
      if (!process.env.RESEND_API_KEY) {
        console.log(`\n╔══════════════════════════════════════╗`);
        console.log(`║   CÓDIGO DE VERIFICAÇÃO ADMIN (DEV)  ║`);
        console.log(`║   ${user.email}`);
        console.log(`║   Código: ${code}`);
        console.log(`╚══════════════════════════════════════╝\n`);
      } else {
        return { ok: false, error: "Não foi possível enviar o código por e-mail. Tente novamente." };
      }
    } else {
      console.log(`[admin-auth] Código enviado para ${user.email}`);
    }

    return { ok: true, email: user.email };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erro ao fazer login" };
  }
}

export async function adminVerifyAction(email: string, code: string): Promise<AdminAuthResult> {
  try {
    const normalized = email.toLowerCase().trim();

    // Anti brute-force: 5 tentativas a cada 10 minutos por e-mail
    if (!rateLimit(`admin-verify:${normalized}`, { maxRequests: 5, windowMs: 10 * 60_000 })) {
      return { ok: false, error: "Muitas tentativas. Aguarde 10 minutos e solicite um novo código." };
    }

    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true },
    });
    if (!user) return { ok: false, error: "Usuário não encontrado." };

    const roles = await getUserRoles(user.id);
    if (!canModerate(roles)) return { ok: false, error: "Sem permissão." };

    const valid = await verifyCode(user.id, code);
    if (!valid) return { ok: false, error: "Código inválido ou expirado." };

    await createAdminSession(user.id);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erro ao verificar" };
  }
}

export async function adminLogoutAction() {
  await deleteAdminSession();
  redirect("/admin-login");
}

const RESEND_COOLDOWN_MS = 60_000;

export async function adminResendCodeAction(email: string): Promise<AdminAuthResult> {
  try {
    const normalized = email.toLowerCase().trim();
    const user = await prisma.user.findUnique({
      where: { email: normalized },
      select: { id: true, email: true },
    });
    if (!user) return { ok: false, error: "Usuário não encontrado." };

    const roles = await getUserRoles(user.id);
    if (!canModerate(roles)) return { ok: false, error: "Sem permissão." };

    const last = await prisma.adminVerificationCode.findFirst({
      where: { userId: user.id, used: false },
      orderBy: { createdAt: "desc" },
    });
    if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - last.createdAt.getTime())) / 1000);
      return { ok: false, error: `Aguarde ${wait}s antes de solicitar um novo código.` };
    }

    const code = await createVerificationCode(user.id, user.email);
    const emailResult = await sendEmail({
      to: user.email,
      subject: "Seu código de acesso — Hexavante",
      html: adminCodeEmailHtml(code),
      text: `Seu código de verificação Hexavante: ${code} (expira em 10 minutos)`,
    });

    if (!emailResult.sent) {
      if (!process.env.RESEND_API_KEY) {
        console.log(`[admin-auth:dev] Novo código para ${user.email}: ${code}`);
      } else {
        return { ok: false, error: "Não foi possível enviar o código por e-mail. Tente novamente." };
      }
    }

    return { ok: true, email: user.email };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Erro ao reenviar código" };
  }
}
