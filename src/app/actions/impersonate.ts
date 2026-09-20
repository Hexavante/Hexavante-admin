"use server";

import { cookies } from "next/headers";

const API_URL =
  process.env.AUTH_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.hexavante.com.br"
    : "http://localhost:3045");

export async function impersonateUser(userId: string) {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_URL}/admin/impersonate-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({ userId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Falha ao iniciar impersonação");
  }

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const parsed = parseSetCookie(setCookie);
    for (const [name, value, attrs] of parsed) {
      cookieStore.set(name, value, {
        path: attrs.Path || "/",
        httpOnly: true,
        sameSite: attrs.SameSite === "none" ? "none" : "lax",
        secure: attrs.Secure !== undefined,
        domain: attrs.Domain,
        maxAge: attrs["Max-Age"] ? parseInt(attrs["Max-Age"]) : undefined,
      });
    }
  }

  const data = await res.json();
  return data;
}

export async function stopImpersonating() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch(`${API_URL}/admin/stop-impersonating`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "Falha ao parar impersonação");
  }

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const parsed = parseSetCookie(setCookie);
    for (const [name, value, attrs] of parsed) {
      cookieStore.set(name, value, {
        path: attrs.Path || "/",
        httpOnly: true,
        sameSite: attrs.SameSite === "none" ? "none" : "lax",
        secure: attrs.Secure !== undefined,
        domain: attrs.Domain,
        maxAge: attrs["Max-Age"] ? parseInt(attrs["Max-Age"]) : undefined,
      });
    }
  }

  return { success: true };
}

function parseSetCookie(setCookieHeader: string): Array<[string, string, Record<string, string>]> {
  const cookies = setCookieHeader.split(", ").map((c) => {
    const parts = c.split(";").map((p) => p.trim());
    const [nameValue, ...attrs] = parts;
    const eqIndex = nameValue.indexOf("=");
    const name = nameValue.slice(0, eqIndex);
    const value = nameValue.slice(eqIndex + 1);
    const attrMap: Record<string, string> = {};
    for (const attr of attrs) {
      const eqIdx = attr.indexOf("=");
      if (eqIdx === -1) {
        attrMap[attr] = "";
      } else {
        attrMap[attr.slice(0, eqIdx)] = attr.slice(eqIdx + 1);
      }
    }
    return [name, value, attrMap] as [string, string, Record<string, string>];
  });
  return cookies;
}
