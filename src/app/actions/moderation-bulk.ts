"use server";

import {
  banUser,
  unbanUser,
  muteUser,
  unmuteUser,
} from "@/app/actions/moderation-users";
import { requireAdminAccount, requireModeratorAccount } from "@/lib/moderation/guards";

export type BulkAction = "ban" | "unban" | "mute" | "unmute";

export type BulkActionResult = {
  success: boolean;
  error?: string;
  processed: number;
  failed: { id: string; error: string }[];
};

const MAX_BULK_IDS = 50;

/**
 * Ação em massa em usuários — reaproveita as actions individuais (cada uma
 * valida a sessão, audita em moderation_log e trata o próprio erro).
 * Falhas por usuário são reportadas uma a uma; nada é mascarado.
 */
export async function bulkUserAction(
  ids: string[],
  action: BulkAction,
  options?: { reason?: string; duration?: string },
): Promise<BulkActionResult> {
  try {
    if (action === "unban" || action === "unmute") await requireAdminAccount();
    else await requireModeratorAccount();
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Não autorizado.",
      processed: 0,
      failed: [],
    };
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return { success: false, error: "Nenhum usuário selecionado.", processed: 0, failed: [] };
  }
  if (ids.length > MAX_BULK_IDS) {
    return {
      success: false,
      error: `Máximo de ${MAX_BULK_IDS} usuários por ação em massa.`,
      processed: 0,
      failed: [],
    };
  }

  const reason = options?.reason?.trim() ?? "";
  if ((action === "ban" || action === "mute") && !reason) {
    return {
      success: false,
      error: "Informe um motivo para banir ou silenciar.",
      processed: 0,
      failed: [],
    };
  }

  const failed: { id: string; error: string }[] = [];
  let processed = 0;

  for (const id of ids) {
    if (typeof id !== "string" || id.length === 0) {
      failed.push({ id: String(id), error: "ID inválido." });
      continue;
    }

    let result: { success: boolean; error?: string; message?: string };
    switch (action) {
      case "ban":
        result = await banUser(id, reason);
        break;
      case "unban":
        result = await unbanUser(id);
        break;
      case "mute":
        result = await muteUser(id, reason, options?.duration?.trim() || "1d");
        break;
      case "unmute":
        result = await unmuteUser(id);
        break;
      default:
        result = { success: false, error: "Ação desconhecida." };
    }

    if (result.success) {
      processed += 1;
    } else {
      failed.push({ id, error: result.error ?? "Falha ao executar a ação." });
    }
  }

  return { success: failed.length === 0, processed, failed };
}
