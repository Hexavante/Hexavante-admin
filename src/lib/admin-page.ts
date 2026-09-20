import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";

/** Exige sessão admin; o layout valida de verdade. Redireciona ao login do painel. */
export async function requireAdminPage() {
  const user = await getAdminSession();
  if (!user) redirect("/admin-login");
  return user;
}
