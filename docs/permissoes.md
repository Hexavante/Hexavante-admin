# Permissões — Hexavante Admin

Documento de referência do controle de acesso **implementado**.

---

## Entrada

Só entra com sessão `hx_admin_session` válida **e** papel `ADMIN`, `MODERATOR` ou `SUPERADMIN` (verificado a cada acesso no layout; middleware barra sem cookie).

## Matriz

| Área | Quem usa |
|------|----------|
| Visão geral, logs | Qualquer moderador |
| Usuários (warn/mute/ban, cargos, excluir) | Moderador (`ADMIN` para impersonate, conforme config) |
| Publicar/rejeitar cursos e tutoriais | Moderador |
| CRUD de simulados e correções | Moderador |
| Categorias e instrutores | Moderador |
| Broadcast, booster, manutenção | Moderador |
| Terminal | Mesmas permissões da ação equivalente |

## Regras

- Perda de papel derruba na hora (validado por acesso, não só no login).
- Nunca moderar a si mesmo (ban/cargo bloqueados para o próprio id).
- Toda ação sensível gera `moderation_logs` com autor, alvo e motivo.
