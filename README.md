<p align="center">
  <img src="https://img.shields.io/badge/HEXAVANTE-Painel_Admin-0ea5e9?style=for-the-badge&labelColor=0f172a" alt="Hexavante Admin" />
</p>

<p align="center">
  <strong>Painel de moderação da Hexavante — projeto e deploy independentes.</strong><br/>
  <em>Standalone moderation panel: users, content, logs, terminal and settings.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/MariaDB-11-003545?logo=mariadb&logoColor=white" alt="MariaDB" />
</p>

<p align="center">
  <a href="#português">🇧🇷 Português</a> · <a href="#english">🇺🇸 English</a> · <a href="docs/visão-geral.md">Docs</a>
</p>

---

<a id="português"></a>

## Português

### Índice

- [Sobre](#sobre)
- [Arquitetura e separação](#arquitetura-e-separação)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Páginas](#páginas)
- [Setup](#setup)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts](#scripts)
- [Sessão persistente](#sessão-persistente)
- [Deploy](#deploy)
- [Solução de problemas](#solução-de-problemas)
- [Como contribuir](#como-contribuir)

### Sobre

Painel de moderação servido em `painel.hexavante.com.br` (porta 3002, container `hexavante-admin`, Next.js standalone). Repo, build e deploy **independentes** do app web — paridade total com o antigo `/admin`.

### Arquitetura e separação

```
Moderador ──HTTPS──▶ Nginx ──▶ hexavante-admin:3002 ──Prisma──▶ MySQL (mesmo banco)
```

Acesso a dados via Prisma direto no banco compartilhado (ferramenta interna — sem necessidade da camada API). Links "ver no app" apontam para `APP_URL` (`@/lib/app-url.ts`).

### Estrutura de pastas

```
src/
├── app/(main)/admin/     # visão geral, usuarios, conteudo, cursos, tutorials,
│                         # simulados (+new/edit/correcoes), categorias,
│                         # instrutores, logs, terminal, configuracoes
├── app/(main)/           # admin-login, admin-verificar (públicas)
├── app/api/upload/       # Upload de capas (sempre JSON)
├── components/           # ui, moderation (user-table, terminal, panels...),
│                         # exams/courses/tutorials (forms e uploads)
├── services/             # moderação, cursos, exames, tutoriais, certificados...
├── app/actions/          # Server Actions (moderação, conteúdo, admin-auth)
├── lib/                  # admin-auth (sessão 30d), admin-page, permissions,
│                         # email (Resend), rate-limit, upload-client, app-url
├── middleware.ts         # Só passa com cookie hx_admin_session; resto → /admin-login
└── styles/               # themes, components (hx-*), animations
prisma/schema.prisma      # Espelho exato do banco (ver docs/der-logico.md)
```

### Páginas

| Página | O quê |
|---|---|
| `/admin` | Visão geral (stats, gráfico 7 dias, acessos rápidos) |
| `/admin/usuarios` | Busca, cargos, warn/mute/ban, XP, impersonate, excluir |
| `/admin/conteudo` | Publicar/despublicar/excluir cursos e simulados |
| `/admin/cursos`, `/admin/tutorials` | Filas de revisão e gerenciamento |
| `/admin/simulados` | CRUD, correções dissertativas |
| `/admin/categorias`, `/admin/instrutores` | Aprovar sugestões e candidaturas |
| `/admin/logs` | Auditoria; `/admin/terminal` CLI; `/admin/configuracoes` broadcast/booster/manutenção |

### Setup

```bash
npm install
cp .env.example .env   # DATABASE_URL, NEXTAUTH_SECRET, NEXT_PUBLIC_APP_URL, RESEND_API_KEY...
npx prisma generate
npm run dev            # :3002 (use PORT=3002)
```

Login de teste: conta com papel `MODERATOR`/`ADMIN` + código por e-mail.

### Variáveis de ambiente

| Variável | Para que |
|---|---|
| `DATABASE_URL` | MySQL (`mysql://...`, `%2F` na senha) |
| `NEXTAUTH_SECRET` | Assinatura de sessão |
| `NEXT_PUBLIC_APP_URL` | Links "ver no app" (`https://app.hexavante.com.br`) |
| `RESEND_API_KEY` / `RESEND_FROM` | Código de 6 dígitos por e-mail |
| `PORT` | `3002` |

### Scripts

| Comando | Para que |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção (**obrigatório**) |
| `npm start` | Roda o standalone |
| `npx prisma migrate dev` | Nova migration (espelhar nos outros schemas) |

### Sessão persistente

`hx_admin_session` de **30 dias com renovação deslizante** (a cada acesso com menos de 7 dias restantes, estende +30). Login sempre com código de 6 dígitos por e-mail. Sem sessão válida, tudo cai em `/admin-login`.

### Deploy

```bash
git pull                            # em /opt/hexavante-admin
docker build --no-cache -t hexavante-admin .
docker stop hexavante-admin && docker rm hexavante-admin
docker run -d --name hexavante-admin --network hexavante_default -p 127.0.0.1:3002:3002 \
  -v hexavante_uploads:/app/public/uploads \
  -e DATABASE_URL='...' -e NEXTAUTH_SECRET='...' \
  -e NEXT_PUBLIC_APP_URL='https://app.hexavante.com.br' \
  -e RESEND_API_KEY='...' -e RESEND_FROM='...' \
  --restart unless-stopped hexavante-admin
```

Nginx roteia `painel.hexavante.com.br` → `:3002` (HTTPS via certbot). Verificação: `curl` em `/admin-login` + login completo com código.

### Solução de problemas

| Sintoma | Causa provável | Ação |
|---|---|---|
| Cai no login em loop | Sessão expirada/revogada ou papéis removidos | Novo login; conferir `admin_sessions` e `user_roles` |
| Código não chega | Resend sem chave ou domínio não verificado | Ver `RESEND_*` + logs `[email]` |
| Upload retorna texto | Sharp/binário (ver app web) | Mesma correção: try/catch + lazy import |
| `db push` quer derrubar | Schema divergente | Alinhar com web/API, nunca `--accept-data-loss` |

### Como contribuir

1. Branch de `main`, commits curtos em português.
2. `npx next build` verde; mudança de banco nos 3 schemas + `migrate diff` vazio.
3. Nunca commitar `.env`, chaves ou `node_modules`.

### Documentação técnica (`docs/`)

`visão-geral`, `requisitos-funcionais`, `regras-de-negocio`, `casos-de-uso`, `der-conceitual`, `der-logico`, `glossario`, `stack`, `permissoes`, `instalacao-e-desenvolvimento`, `deploy-producao`, `escopo-mvp`.

---

<a id="english"></a>

## English (summary)

Standalone Hexavante moderation panel (Next.js 16, port 3002, `painel.hexavante.com.br`). Own repo/build/deploy, direct Prisma access to the shared MySQL, 30-day sliding admin sessions with email-code login. Build with `npm run build`; see `docs/` (in Portuguese) for full technical documentation.
