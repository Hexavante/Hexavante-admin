"use server";

import { cookies } from "next/headers";
import { addAccount } from "@/lib/account-switcher";
import { getClientDevice } from "@/lib/client-device";
import { finishWebVerification, resendWebVerification } from "@/services/web-security.service";

export type DeviceAuthResult = { ok: boolean; error?: string };
function sessionCookieOpts() { return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 7 * 24 * 60 * 60, domain: process.env.NODE_ENV === "production" ? ".hexavante.com.br" : undefined }; }

export async function verifyDeviceAction(verificationId: string, code: string): Promise<DeviceAuthResult> {
  try {
    const device = await getClientDevice();
    const session = await finishWebVerification(verificationId, code, { userAgent: device.deviceUa, ip: device.deviceIp });
    const store = await cookies();
    store.set("__Secure-hexavante.session_token", session.token, sessionCookieOpts());
    try { await addAccount(session.token); } catch (error) { console.error("[device-auth] addAccount falhou:", error); }
    return { ok: true };
  } catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Erro ao verificar" }; }
}

export async function resendDeviceCodeAction(verificationId: string): Promise<DeviceAuthResult & { verificationId?: string }> {
  try { return { ok: true, verificationId: await resendWebVerification(verificationId) }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Erro ao reenviar" }; }
}
