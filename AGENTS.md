# AGENTS.md — Grupo Hexavante Admin

Este conjunto trabalha no repositório **`Hexavante/Hexavante-admin`**, branch `main`, responsável por `painel.hexavante.com.br:3002`.

## Stack real

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 6
- MariaDB/MySQL
- Server Actions
- Resend
- Docker standalone

## Arquitetura

O Admin é um painel independente de moderação e operação interna. Acessa diretamente o banco compartilhado via Prisma e possui sessão própria `hx_admin_session`.

## Time

| Agente | Responsabilidade |
|---|---|
| `coordenador` | Orquestra o Admin |
| `frontend` | UI operacional de moderação |
| `backend` | Server Actions, auth admin, permissões e auditoria |
| `database` | Prisma e integridade do banco compartilhado |
| `devops` | Docker/nginx/VPS do painel |
| `landing` | Fronteira Admin ↔ App público |
| `qa` | Auth, autorização, CRUD, auditoria e runtime |


## Git e segurança

- Trabalhe somente no repositório indicado por este grupo, salvo delegação explícita do coordenador.
- **Nunca altere repositórios irmãos** (`Hexavante`, `Hexavante-api`, `Hexavante-landing`, `deploy`, etc.), nem `.gitignore`, nem arquivos fora desta pasta, sem que o usuário passe a tarefa explicitamente. Ler/pesquisar neles é permitido; modificar não.
- Revise `git status` e `git diff --cached` antes de qualquer commit.
- Não use `git add .` sem revisar; prefira paths explícitos.
- Nunca commite `.env`, tokens, chaves, senhas, keystores, credenciais de EAS, certificados ou segredos.
- **Nunca commite nada do opencode nem nada relacionado a IA**: `.opencode/`, `AGENTS.md`, `CLAUDE.md`, `opencode.json(c)`, `.cursor/`, `.copilot/` e afins. Esses caminhos estão no `.gitignore`; não remova as regras nem contorne com `git add -f`.
- Commits curtos e em português.
- Nunca force-push sem autorização explícita.
- Não apague nem sobrescreva mudanças não relacionadas de terceiros.
- Nunca diga "pronto" sem evidência de build/teste/runtime adequada.


## Regra dura de banco

- O banco MySQL/MariaDB é compartilhado entre partes da plataforma.
- Nunca use `db push --accept-data-loss`.
- Nunca rode `DROP TABLE`, `DROP COLUMN` ou `migrate reset` contra o banco real sem autorização explícita.
- Mudanças de schema exigem comparação dos schemas relevantes e validação de drift antes de produção.
