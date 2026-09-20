# Escopo MVP — Hexavante Admin

Documento de referência do que está dentro e fora do escopo atual.

---

## Dentro do escopo

Login com código + sessão longa, visão geral, usuários, conteúdo, filas de curadoria, simulados e correções, logs, terminal CLI, configurações operacionais e busca global — paridade total com o `/admin` legado.

## Fora do escopo (futuro)

App mobile de moderação, aprovações em lote, webhooks/Slack, relatórios exportáveis e auditoria com retenção configurável.

## Critérios de aceite por entrega

`build` verde, login com código funcionando, `migrate diff` vazio se o schema mudou, `curl` nas rotas (200 públicas, 307 protegidas), sem segredo commitado.
