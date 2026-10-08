import { getAdminSession } from "@/lib/admin-auth";
import { canModerate, isAdmin } from "@/lib/permissions";

export type ModeratorAccount = {
  id: string;
  username: string | null;
  roles: string[];
};

/** Sessão admin ausente/expirada — o chamador pode redirecionar para /admin-login. */
export class AuthRequiredError extends Error {
  constructor(message = "Faça login para continuar.") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

/** Sessão válida, mas papel insuficiente. */
export class ForbiddenError extends Error {
  constructor(message = "Acesso restrito a moderadores e administradores.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Guardas do painel admin.
 *
 * A autorização usa a sessão do painel (`hx_admin_session`, lida do banco via
 * getAdminSession) — e NÃO a sessão da plataforma (API), porque o login do
 * painel (e-mail + código) não cria sessão da plataforma. Usar a sessão da
 * plataforma aqui fazia actions falharem com "Faça login" para administradores
 * autenticados no painel.
 */
export async function requireModeratorAccount(): Promise<ModeratorAccount> {
  const session = await getAdminSession();
  if (!session) {
    throw new AuthRequiredError();
  }
  if (!canModerate(session.roles)) {
    throw new ForbiddenError();
  }
  return {
    id: session.id,
    username: session.username,
    roles: session.roles,
  };
}

export async function requireAdminAccount(): Promise<ModeratorAccount> {
  const session = await getAdminSession();
  if (!session) {
    throw new AuthRequiredError("Faça login para continuar.");
  }
  if (!isAdmin(session.roles)) {
    throw new ForbiddenError("Acesso restrito a administradores.");
  }
  return {
    id: session.id,
    username: session.username,
    roles: session.roles,
  };
}
