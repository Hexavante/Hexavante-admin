"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getAccounts, removeAccount, switchAccount } from "@/lib/account-switcher";
import { confirmWebTwoFactor, listWebDevices, revokeWebDevice, setWebTwoFactor, updateWebPresence } from "@/services/web-security.service";

export type SecurityResult = { ok: boolean; error?: string };
export type DeviceInfo = { id: string; name: string; ipAddress: string | null; lastSeenAt: string; revoked: boolean; createdAt: string };
async function requireUserId() { const session = await auth(); if (!session?.user) throw new Error("Faça login para continuar."); return session.user.id; }

export async function getMyDevices(): Promise<{ devices: DeviceInfo[]; currentFingerprintNote: string }> {
  try { return { devices: await listWebDevices(await requireUserId()), currentFingerprintNote: "" }; }
  catch { return { devices: [], currentFingerprintNote: "" }; }
}

export async function revokeDeviceAction(deviceId: string): Promise<SecurityResult & { signedOut?: boolean }> {
  try {
    const userId = await requireUserId();
    await revokeWebDevice(userId, deviceId);
    revalidatePath("/configuracoes/dispositivos");
    const current = await auth();
    if (!current) {
      const store = await cookies();
      store.delete("__Secure-hexavante.session_token");
      store.delete("hexavante.session_token");
      return { ok: true, signedOut: true };
    }
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Não foi possível remover o dispositivo." }; }
}

export type SecurityProfile = { twoFactorEnabled: boolean; presence: string };
export async function getSecurityProfile(): Promise<SecurityProfile> {
  try {
    const user = await prisma.user.findUnique({ where: { id: await requireUserId() }, select: { twoFactorEnabled: true, presence: true } });
    return { twoFactorEnabled: Boolean(user?.twoFactorEnabled), presence: user?.presence ?? "ONLINE" };
  } catch { return { twoFactorEnabled: false, presence: "ONLINE" }; }
}

export async function setPresenceAction(status: string): Promise<SecurityResult> {
  try { await updateWebPresence(await requireUserId(), status); revalidatePath("/configuracoes/seguranca"); return { ok: true }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Erro ao atualizar status." }; }
}
export async function enableTwoFactorAction(): Promise<SecurityResult & { verificationId?: string }> {
  try { return { ok: true, ...(await setWebTwoFactor(await requireUserId(), true)) }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Erro ao ativar 2FA." }; }
}
export async function confirmTwoFactorAction(verificationId: string, code: string): Promise<SecurityResult> {
  try { await confirmWebTwoFactor(verificationId, code, await requireUserId()); revalidatePath("/configuracoes/seguranca"); return { ok: true }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Código inválido." }; }
}
export async function disableTwoFactorAction(): Promise<SecurityResult> {
  try { await setWebTwoFactor(await requireUserId(), false); revalidatePath("/configuracoes/seguranca"); return { ok: true }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Não foi possível desativar." }; }
}
export async function switchAccountAction(userId: string) { if (await switchAccount(userId)) redirect("/app"); }
export async function removeAccountAction(userId: string) { await removeAccount(userId); revalidatePath("/configuracoes/contas"); }
export async function getLinkedAccounts() { return getAccounts(); }
