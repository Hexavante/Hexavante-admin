import { jwtVerify, SignJWT } from "jose";
import { ApiError } from "@/lib/api-error";
import { canModerate, isAdmin } from "@/lib/permissions";
import { getAuthSecret } from "@/lib/auth-env";

function getKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export type BearerAuthContext = {
  userId: string;
  roles: string[];
};

async function verifyBearerToken(req: Request): Promise<BearerAuthContext> {
  const authHeader = req.headers.get("Authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Token inválido ou ausente");
  }

  try {
    const { payload } = await jwtVerify(token, getKey());
    const userId = payload.sub;
    if (!userId) {
      throw new ApiError(401, "Token inválido ou ausente");
    }
    const roles = Array.isArray(payload.roles)
      ? payload.roles.filter((r): r is string => typeof r === "string")
      : [];
    return { userId, roles };
  } catch (e) {
    if (e instanceof ApiError) throw e;
    throw new ApiError(401, "Token inválido ou ausente");
  }
}

export async function requireBearerAuth(req: Request): Promise<string> {
  const ctx = await verifyBearerToken(req);
  return ctx.userId;
}

export async function requireBearerAuthContext(req: Request): Promise<BearerAuthContext> {
  return verifyBearerToken(req);
}

export async function requireBearerModerator(req: Request): Promise<BearerAuthContext> {
  const ctx = await verifyBearerToken(req);
  if (!canModerate(ctx.roles)) {
    throw new ApiError(403, "Acesso negado");
  }
  return ctx;
}

export async function requireBearerAdmin(req: Request): Promise<BearerAuthContext> {
  const ctx = await verifyBearerToken(req);
  if (!isAdmin(ctx.roles)) {
    throw new ApiError(403, "Acesso negado");
  }
  return ctx;
}

export async function getOptionalBearerAuth(req: Request): Promise<string | null> {
  try {
    return (await verifyBearerToken(req)).userId;
  } catch {
    return null;
  }
}

export async function getOptionalBearerAuthContext(req: Request): Promise<BearerAuthContext | null> {
  try {
    return await verifyBearerToken(req);
  } catch {
    return null;
  }
}

export async function signApiToken(userId: string, roles: string[]): Promise<string> {
  return new SignJWT({ roles })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getKey());
}
