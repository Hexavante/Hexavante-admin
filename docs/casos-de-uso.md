# Casos de uso — Hexavante Admin

Documento de referência dos fluxos **implementados**, com rotas reais.

---

## UC-01 — Primeiro acesso (sessão longa)

1. Abre `painel.hexavante.com.br` → cai em `/admin-login`.
2. E-mail/senha → código de 6 dígitos no e-mail → `/admin-verificar`.
3. Confirma → sessão de 30 dias → `/admin`. Próximos acessos entram direto; uso renova.

## UC-02 — Moderar usuário

1. `/admin/usuarios` → busca → abre ações → warn/mute/ban com motivo.
2. Tudo registrado em `/admin/logs` com autor e data.

## UC-03 — Publicar curso

1. `/admin/cursos` → abre pendente → revisa módulos → aprova com nota.
2. Instrutor é notificado; curso aparece no catálogo.

## UC-04 — Corrigir dissertativa

1. `/admin/simulados/correcoes` → lê resposta x gabarito → lança nota.
2. Nota da tentativa recalcula ao concluir a fila.

## UC-05 — Via terminal

`/admin/terminal` → `/tutorials list|publish`, `/stats`, `/broadcast "..."` — mesmas ações da UI.
