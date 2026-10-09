"use server";

import { cookies } from "next/headers";
import type { ZodError } from "zod";
import { registerSchema, loginSchema } from "@/lib/validations/auth";
import { registerUser, validateCredentials } from "@/services/auth.service";
import { beginWebLogin } from "@/services/web-security.service";
import { addAccount } from "@/lib/account-switcher";
import { getClientDevice } from "@/lib/client-device";

const ALLOWED_REDIRECT_HOSTS = ["hexavante.com.br", "app.hexavante.com.br", "www.hexavante.com.br", "localhost", "127.0.0.1"];
const COOKIE_NAMES = ["hexavante.session_token", "__Secure-hexavante.session_token"];

export type ActionResult = { success: boolean; error?: string; fieldErrors?: Record<string, string>; redirectTo?: string };

function isSafeRedirect(url: string): boolean {
  if (!url.startsWith("http")) return true;
  try { return ALLOWED_REDIRECT_HOSTS.includes(new URL(url).hostname); } catch { return false; }
}
function mapZodErrors(error: ZodError) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) { const key = String(issue.path[0] ?? ""); if (key && !fieldErrors[key]) fieldErrors[key] = issue.message; }
  return fieldErrors;
}
async function clearStaleSessionCookies() { const store = await cookies(); for (const name of COOKIE_NAMES) store.delete(name); }
function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 7 * 24 * 60 * 60, domain: process.env.NODE_ENV === "production" ? ".hexavante.com.br" : undefined };
}
async function finishLogin(user: { id: string; email: string }, callbackUrl: string): Promise<ActionResult> {
  const device = await getClientDevice();
  const result = await beginWebLogin(user, { userAgent: device.deviceUa, ip: device.deviceIp });
  if (result.requiresVerification) {
    const reason = result.reason === "EMAIL_VERIFY" ? "&motivo=email" : result.reason === "TWO_FACTOR" ? "&motivo=2fa" : "";
    return { success: true, redirectTo: `/verificar-dispositivo?vid=${encodeURIComponent(result.verificationId)}${reason}&callbackUrl=${encodeURIComponent(callbackUrl)}` };
  }
  const store = await cookies();
  store.set("__Secure-hexavante.session_token", result.session.token, cookieOptions());
  try { await addAccount(result.session.token); } catch (error) { console.error("[auth] addAccount falhou:", error); }
  return { success: true, redirectTo: callbackUrl };
}

export async function registerAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";
  if (!isSafeRedirect(callbackUrl)) return { success: false, error: "URL de redirecionamento inválida." };
  const parsed = registerSchema.safeParse({ username: formData.get("username"), fullName: formData.get("fullName"), email: formData.get("email"), password: formData.get("password"), confirmPassword: formData.get("confirmPassword"), birthDate: formData.get("birthDate"), phone: formData.get("phone") || undefined, city: formData.get("city") || undefined, state: formData.get("state") || undefined, terms: formData.get("terms") ? "on" : undefined });
  if (!parsed.success) return { success: false, error: "Corrija os campos destacados.", fieldErrors: mapZodErrors(parsed.error) };
  try {
    await registerUser(parsed.data);
    await clearStaleSessionCookies();
    const user = await validateCredentials({ email: parsed.data.email, password: parsed.data.password });
    if (!user) return { success: false, error: "Não foi possível iniciar a sessão." };
    return finishLogin({ id: user.id, email: user.email }, callbackUrl);
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : "Erro ao cadastrar" }; }
}

export async function loginAction(_previous: ActionResult, formData: FormData): Promise<ActionResult> {
  const callbackUrl = (formData.get("callbackUrl") as string) || "/";
  if (!isSafeRedirect(callbackUrl)) return { success: false, error: "URL de redirecionamento inválida." };
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { success: false, error: "Corrija os campos destacados.", fieldErrors: mapZodErrors(parsed.error) };
  await clearStaleSessionCookies();
  try {
    const user = await validateCredentials(parsed.data);
    if (!user) return { success: false, error: "E-mail ou senha incorretos." };
    return finishLogin({ id: user.id, email: user.email }, callbackUrl);
  } catch (error) { return { success: false, error: error instanceof Error ? error.message : "E-mail ou senha incorretos." }; }
}
