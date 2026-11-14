import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getAuthBaseUrl, getOAuthCredentials } from "@/lib/auth-env";

const PROVIDERS = {
  google: { authorization: "https://accounts.google.com/o/oauth2/v2/auth", scopes: "openid email profile" },
} as const;
const ALLOWED_HOSTS = new Set(["hexavante.com.br", "www.hexavante.com.br", "app.hexavante.com.br", "localhost", "127.0.0.1"]);

export async function GET(request: Request, context: { params: Promise<{ provider: string }> }) {
  const { provider } = await context.params;
  if (!(provider in PROVIDERS)) return NextResponse.json({ error: "Provider não suportado" }, { status: 404 });
  const credentials = getOAuthCredentials();
  const clientId = credentials.googleId;
  if (!clientId) return NextResponse.json({ error: "Provider não configurado" }, { status: 503 });
  const incoming = new URL(request.url).searchParams.get("callbackURL") || "/";
  let callback = incoming;
  if (incoming.startsWith("http")) {
    try { if (!ALLOWED_HOSTS.has(new URL(incoming).hostname)) callback = "/"; } catch { callback = "/"; }
  }
  const state = randomBytes(32).toString("base64url");
  const base = getAuthBaseUrl();
  const config = PROVIDERS[provider as keyof typeof PROVIDERS];
  const target = new URL(config.authorization);
  target.searchParams.set("client_id", clientId);
  target.searchParams.set("redirect_uri", `${base}/oauth/callback/${provider}`);
  target.searchParams.set("response_type", "code");
  target.searchParams.set("scope", config.scopes);
  target.searchParams.set("state", state);
  const response = NextResponse.redirect(target);
  response.cookies.set("hx_oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 300 });
  response.cookies.set("hx_oauth_callback", callback, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 300 });
  return response;
}
