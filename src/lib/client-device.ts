import { headers } from "next/headers";
import { extractClientIp } from "@/lib/rate-limit";

/**
 * UA e IP reais do navegador. As Server Actions rodam no servidor Next,
 * então sem isso a API enxergaria todo mundo como UA "node" + IP interno
 * (um fingerprint só para todos os usuários — quebra a detecção de
 * dispositivo novo).
 */
export async function getClientDevice(): Promise<{ deviceUa?: string; deviceIp?: string }> {
  try {
    const h = await headers();
    const userAgent = h.get("user-agent") ?? undefined;
    const ip = extractClientIp(h.get("x-forwarded-for"), h.get("x-real-ip"));
    return {
      ...(userAgent ? { deviceUa: userAgent } : {}),
      ...(ip && ip !== "unknown" ? { deviceIp: ip } : {}),
    };
  } catch {
    return {};
  }
}
