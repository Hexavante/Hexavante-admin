import { NextResponse } from "next/server";
import { getAuthBaseUrl, getOAuthCredentials } from "@/lib/auth-env";
import { prisma } from "@/lib/prisma";
import { createWebSession } from "@/services/web-session.service";
import { ensureUserProvisioned } from "@/services/auth.service";

async function profile(provider: string, accessToken: string) {
  if (provider === "google") {
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!response.ok) throw new Error("Perfil Google indisponível");
    const data = await response.json() as { id: string; email: string; verified_email?: boolean; name?: string; picture?: string };
    if (!data.email || data.verified_email !== true) throw new Error("O Google não forneceu um e-mail verificado");
    return { id: data.id, email: data.email, name: data.name || data.email.split("@")[0], avatar: data.picture ?? null };
  }
  throw new Error("Provider não suportado");
}
const ALLOWED_CALLBACK_HOSTS = new Set(["hexavante.com.br", "www.hexavante.com.br", "app.hexavante.com.br", "localhost", "127.0.0.1"]);
function safeDestination(raw: string | undefined) {
  if (!raw) return "/";
  if (!raw.startsWith("http")) return raw.startsWith("/") ? raw : `/${raw}`;
  try { const value = new URL(raw); return ALLOWED_CALLBACK_HOSTS.has(value.hostname) ? value.toString() : "/"; } catch { return "/"; }
}
function usernameBase(name: string, email: string) { return (name || email.split("@")[0]).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").slice(0, 20) || "user"; }
async function uniqueUsername(name: string, email: string) {
  const base = usernameBase(name, email);
  for (let index = 0; index < 20; index++) { const value = index === 0 ? base : `${base}${index}`; if (!await prisma.user.findUnique({ where: { username: value }, select: { id: true } })) return value; }
  return `${base}${Date.now().toString(36)}`;
}

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  const url = new URL(request.url);
  const base = getAuthBaseUrl();
  const callback = request.headers.get("cookie")?.match(/(?:^|; )hx_oauth_callback=([^;]+)/)?.[1];
  const destination = safeDestination(callback ? decodeURIComponent(callback) : undefined);
  const stateCookie = request.headers.get("cookie")?.match(/(?:^|; )hx_oauth_state=([^;]+)/)?.[1];
  if (!url.searchParams.get("state") || url.searchParams.get("state") !== stateCookie || !url.searchParams.get("code")) return NextResponse.redirect(new URL("/login?error=oauth_invalid_state", base));
  try {
    const credentials = getOAuthCredentials();
    const clientId = credentials.googleId;
    const clientSecret = credentials.googleSecret;
    if (!clientId || !clientSecret || provider !== "google") throw new Error("Provider não configurado");
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const tokenResponse = await fetch(tokenEndpoint, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, code: url.searchParams.get("code")!, redirect_uri: `${base}/oauth/callback/${provider}`, grant_type: "authorization_code" }) });
    const tokenData = await tokenResponse.json() as { access_token?: string };
    if (!tokenResponse.ok || !tokenData.access_token) throw new Error("Falha ao trocar código OAuth");
    const remote = await profile(provider, tokenData.access_token);
    let user = await prisma.user.findFirst({ where: { OR: [{ email: remote.email.toLowerCase() }, { provider, providerId: remote.id }] } });
    if (!user) user = await prisma.user.create({ data: { email: remote.email.toLowerCase(), fullName: remote.name, username: await uniqueUsername(remote.name, remote.email), provider, providerId: remote.id, avatarUrl: remote.avatar, emailVerified: true } });
    else user = await prisma.user.update({ where: { id: user.id }, data: { provider, providerId: remote.id, emailVerified: true, avatarUrl: user.avatarUrl || remote.avatar } });
    await ensureUserProvisioned(user.id);
    const session = await createWebSession(user.id);
    const response = NextResponse.redirect(new URL(destination, base));
    response.cookies.set("__Secure-hexavante.session_token", session.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 7 * 24 * 60 * 60, domain: process.env.NODE_ENV === "production" ? ".hexavante.com.br" : undefined });
    response.cookies.delete("hx_oauth_state"); response.cookies.delete("hx_oauth_callback");
    return response;
  } catch { return NextResponse.redirect(new URL("/login?error=oauth_callback_error", base)); }
}
