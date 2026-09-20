/** URL pública do app principal — links "ver no app" saem do painel. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://app.hexavante.com.br";
