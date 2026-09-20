# Regras de negócio — Hexavante Admin

Documento de referência das regras **implementadas** no código.

---

| ID | Regra |
|----|-------|
| RN-01 | Sem `hx_admin_session` válida, tudo cai em `/admin-login` (middleware + layout) |
| RN-02 | Sessão dura 30 dias; acesso com menos de 7 restantes renova +30 (deslizante) |
| RN-03 | Código de login: 6 dígitos, 10 min, uso único, reenvio com cooldown |
| RN-04 | Papéis verificados a cada acesso (`ADMIN`/`MODERATOR`/`SUPERADMIN`); perda de papel derruba na hora |
| RN-05 | Nunca banir a si mesmo; desban/mute registram autor e motivo |
| RN-06 | Excluir curso com matrículas é bloqueado para instrutor (moderador confirma) |
| RN-07 | Publicar curso exige status `APPROVED`; despublicar volta à fila |
| RN-08 | Uploads validam papel, tipo, tamanho e rate-limit; erro sempre JSON |
| RN-09 | Broadcast/booster/manutenção exigem moderador e geram log |
| RN-10 | Links externos de inspeção usam `APP_URL` central (`@/lib/app-url.ts`) |
