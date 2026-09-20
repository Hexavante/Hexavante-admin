# DER lógico — Hexavante Admin

Documento de referência do mapeamento **implementado**: acesso Prisma direto ao banco `hexavante`, schema idêntico em cobertura ao do app e da API.

---

| Uso no painel | Tabelas |
|---------------|---------|
| Sessão/login | `admin_sessions`, `admin_verification_codes`, `users`, `user_roles`, `roles` |
| Usuários | `users`, `user_bans`, `user_mutes`, `user_warnings`, `user_xp`, `user_wallets` |
| Conteúdo | `courses`, `course_moderations`, `tutorials`, `exams`, `exam_answers` |
| Filas | `instructor_applications`, `categories` |
| Auditoria | `moderation_logs` |
| Operação | `platform_settings`, `notifications` |
| Uploads | arquivos em `public/uploads/*` (volume `hexavante_uploads`) |

## Convenções

- Mesmos `@map`, enums e índices dos outros schemas — `migrate diff` vazio entre os três.
- Escrita sempre via services/actions existentes (nada de SQL solto), exceto leituras pontuais já consolidadas.
