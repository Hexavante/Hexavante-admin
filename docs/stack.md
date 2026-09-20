# Stack técnica — Hexavante Admin

Documento de referência da arquitetura **implementada** no repositório.

---

## Visão geral

| Camada | Tecnologia | Versão (referência) |
|--------|------------|---------------------|
| Framework | Next.js (App Router) | 16.x |
| Linguagem | TypeScript | 6.x |
| UI | React | 19.x |
| Estilização | Tailwind CSS | 4.x |
| Banco | Prisma + MySQL/MariaDB (direto) | 6.x |
| E-mail | Resend (`src/lib/email.ts`) | `RESEND_API_KEY`, `RESEND_FROM` |
| Upload | sharp → webp | `src/app/api/upload/*` |
| Fonte | Space Grotesk (`--font-display`) | Google Fonts |

---

## Arquitetura em camadas

```
┌─────────────────────────────────────────┐
│  Nginx :443 → admin :3002               │
│  ┌────────────┐  ┌──────────────────┐   │
│  │ middleware │  │ layout (valida   │   │
│  │ (cookie)   │  │ sessão + papéis) │   │
│  └────────────┘  └──────────────────┘   │
│  ┌────────────┐  ┌──────────────────┐   │
│  │ Pages +    │  │ Server Actions   │   │
│  │ componentes│  │ + services       │   │
│  └────────────┘  └──────────────────┘   │
└────────────────────────────┬────────────┘
                             │
┌────────────────────────────▼────────────┐
│   Prisma Client → MySQL compartilhado   │
└─────────────────────────────────────────┘
```

### Responsabilidades por pasta

| Pasta | Responsabilidade |
|-------|------------------|
| `src/app/(main)/admin/` | As 15 telas (visão, usuários, conteúdo, filas, logs, terminal, config) |
| `src/app/(main)/admin-login`, `admin-verificar` | Entrada pública (senha + código) |
| `src/components/moderation/` | Tabelas, terminal, painéis, busca |
| `src/components/{exams,courses,tutorials}/` | Forms e uploads de conteúdo |
| `src/services/` | Regras (moderação, cursos, exames, tutoriais...) |
| `src/app/actions/` | Server Actions (tudo retorna `{ success, error }`) |
| `src/lib/` | `admin-auth` (sessão 30d), `admin-page`, `permissions`, `email` |
