export const oauthProviders: { google?: boolean; github?: boolean; microsoft?: boolean } = {
  // google: true, // habilitar quando configurar Google Cloud Console
  // github: true, // habilitar quando configurar GitHub OAuth App
  // microsoft: true, // descomentar quando tiver credenciais
};

export function hasOAuthProviders() {
  return oauthProviders.google || oauthProviders.github;
}

export const oauthErrorMessages: Record<string, string> = {
  oauth_invalid_state: "Sessão OAuth expirada. Tente novamente.",
  oauth_no_code: "Não foi possível autenticar. Tente novamente.",
  oauth_token_exchange: "Falha ao autenticar com o provedor. Tente novamente.",
  oauth_no_token: "Não foi possível obter credenciais do provedor.",
  oauth_no_email: "O provedor não retornou seu e-mail. Use e-mail e senha.",
  oauth_callback_error: "Erro ao processar autenticação. Tente novamente.",
  oauth_provider_not_found: "Provedor não suportado.",
  provider_not_found: "Provedor não suportado.",
};
