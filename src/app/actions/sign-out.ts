"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { deleteWebSession } from "@/services/web-session.service";
import { getAccounts, removeAccount } from "@/lib/account-switcher";


const COOKIE_NAMES = [
  "hexavante.session_token",
  "__Secure-hexavante.session_token",
];

export async function signOutAction() {
  const cookieStore = await cookies();
  const activeSessionToken = cookieStore.get("__Secure-hexavante.session_token")?.value
    ?? cookieStore.get("hexavante.session_token")?.value;
  await deleteWebSession(activeSessionToken);

  // Remove a conta atual da lista multiconta
  try {
    const accounts = await getAccounts();
    const current = accounts.find((a) => a.token === activeSessionToken);
    if (current) await removeAccount(current.userId);
  } catch {
    // best effort
  }

  for (const name of COOKIE_NAMES) {
    cookieStore.delete(name);
  }

  // Se restou outra conta vinculada, ativa ela em vez de deslogar tudo
  try {
    const remaining = await getAccounts();
    if (remaining.length > 0) {
      const { switchAccount } = await import("@/lib/account-switcher");
      const ok = await switchAccount(remaining[0].userId);
      if (ok) redirect("/app");
    }
  } catch {
    // segue para logout total
  }

  const { clearAccounts } = await import("@/lib/account-switcher");
  await clearAccounts();
  redirect("/");
}
