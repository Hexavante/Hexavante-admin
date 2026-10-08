/** Labels e pills das ações de auditoria (módulo compartilhado server/client). */

export const ACTION_LABELS: Record<string, string> = {
  BAN: "Ban",
  UNBAN: "Unban",
  MUTE: "Mute",
  UNMUTE: "Unmute",
  WARN: "Advertência",
  XP_ADD: "XP",
  XP_REMOVE: "XP removido",
  XP_SET: "XP definido",
  LEVEL_SET: "Nível",
  COIN_ADD: "Moedas",
  COIN_REMOVE: "Moedas removidas",
  COIN_SET: "Moedas definidas",
  ROLE_ADD: "Cargo",
  ROLE_REMOVE: "Cargo removido",
  BROADCAST: "Broadcast",
  MAINTENANCE: "Manutenção",
  GLOBAL_BOOSTER: "Booster global",
  COURSE_PUBLISH: "Curso publicado",
  COURSE_UNPUBLISH: "Curso despublicado",
  EXAM_RESET: "Reset de simulado",
  PASSWORD_RESET: "Senha redefinida",
  IMPERSONATE: "Impersonar",
  DELETE_USER: "Excluir conta",
  DELETE_PROFILE: "Limpar perfil",
  OTHER: "Outro",
};

export const ACTION_PILLS: Record<string, string> = {
  BAN: "border-red-400/25 bg-red-400/10 text-red-300",
  UNBAN: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  MUTE: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  UNMUTE: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  WARN: "border-yellow-400/25 bg-yellow-400/10 text-yellow-300",
  XP_ADD: "border-sky-400/25 bg-sky-400/10 text-sky-300",
  COIN_ADD: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  ROLE_ADD: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  BROADCAST: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  DELETE_USER: "border-red-400/25 bg-red-400/10 text-red-300",
  DELETE_PROFILE: "border-red-400/25 bg-red-400/10 text-red-300",
  IMPERSONATE: "border-violet-400/25 bg-violet-400/10 text-violet-300",
  MAINTENANCE: "border-orange-400/25 bg-orange-400/10 text-orange-300",
  GLOBAL_BOOSTER: "border-teal-400/25 bg-teal-400/10 text-teal-300",
  COURSE_PUBLISH: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  PASSWORD_RESET: "border-sky-400/25 bg-sky-400/10 text-sky-300",
};

export const ACTION_PILL_BASE =
  "inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold";

/** Motivos de denúncia do feed (CommunityReport.reason). */
export const REPORT_REASON_LABELS: Record<string, string> = {
  SPAM: "Spam",
  HARASSMENT: "Assédio",
  INAPPROPRIATE: "Inapropriado",
  MISINFORMATION: "Desinformação",
  OTHER: "Outro",
};

/** Status de denúncia (CommunityReport.status). */
export const REPORT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  REVIEWED: "Revisada",
  DISMISSED: "Dispensada",
};

/** Tipos de atividade social (SocialActivity.type). */
export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  COURSE_COMPLETED: "Curso concluído",
  SIMULADO_PASSED: "Simulado",
  LEVEL_UP: "Nível",
  ACHIEVEMENT: "Conquista",
  STREAK: "Sequência",
  DISCUSSION: "Discussão",
};
