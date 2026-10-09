"use client";

import { invoke } from "@tauri-apps/api/core";
import { fetch as tauriFetch } from "@tauri-apps/plugin-http";
import { load } from "@tauri-apps/plugin-store";
import { isTauriDesktop } from "@/lib/native-app";

type DesktopApiConfig = { baseUrl: string; client: "desktop"; version: string };
const STORE_PATH = "desktop-auth.json";
const TOKEN_KEY = "access-token";
let configPromise: Promise<DesktopApiConfig> | null = null;

async function config() {
  configPromise ??= invoke<DesktopApiConfig>("desktop_api_config");
  return configPromise;
}
export async function setDesktopToken(token: string | null) {
  const store = await load(STORE_PATH, { autoSave: true });
  if (token) await store.set(TOKEN_KEY, token); else await store.delete(TOKEN_KEY);
}
export async function getDesktopToken() {
  const store = await load(STORE_PATH, { autoSave: true });
  return (await store.get<string>(TOKEN_KEY)) ?? null;
}
export async function desktopApiFetch(path: string, init: RequestInit = {}) {
  if (!isTauriDesktop()) throw new Error("Desktop API disponível somente no shell Tauri");
  if (!path.startsWith("/") || path.startsWith("//")) throw new Error("Caminho Desktop inválido");
  const [{ baseUrl, client, version }, token] = await Promise.all([config(), getDesktopToken()]);
  const headers = new Headers(init.headers);
  headers.set("X-Hexavante-Client", client);
  headers.set("X-Hexavante-Client-Version", version);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return tauriFetch(`${baseUrl}${path}`, { ...init, headers });
}
export async function uploadDesktopAvatar(file: Blob) {
  const body = new FormData(); body.set("file", file, "avatar");
  return desktopApiFetch("/api/v1/users/me/avatar", { method: "POST", body });
}
export async function uploadDesktopBanner(file: Blob) {
  const body = new FormData(); body.set("file", file, "banner");
  return desktopApiFetch("/api/v1/users/me/banner", { method: "POST", body });
}

type DesktopAuthUser = { id: string; name: string; email: string; username: string | null; avatarUrl?: string | null; roles: string[] };
async function desktopJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await desktopApiFetch(path, { ...init, headers });
  const data = await response.json().catch(() => ({})) as T & { error?: string; message?: string };
  if (!response.ok) throw new Error(data.error || data.message || `Erro ${response.status}`);
  return data;
}
export async function desktopLogin(email: string, password: string) {
  const data = await desktopJson<{ user: DesktopAuthUser; session?: { token?: string; expiresAt?: string }; requiresVerification?: boolean; verificationId?: string; reason?: string }>("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  if (data.session?.token) await setDesktopToken(data.session.token);
  return data;
}
export async function desktopVerifyDevice(verificationId: string, code: string) {
  const data = await desktopJson<{ user: DesktopAuthUser; session: { token: string; expiresAt: string } }>("/api/v1/auth/verify-device", { method: "POST", body: JSON.stringify({ verificationId, code }) });
  await setDesktopToken(data.session.token);
  return data;
}
export async function desktopSession() { return desktopJson<{ user: DesktopAuthUser; session: { expiresAt: string } }>("/api/v1/auth/session"); }
export async function desktopLogout() { try { await desktopJson("/api/v1/auth/logout", { method: "POST" }); } finally { await setDesktopToken(null); } }
