# Instalação e desenvolvimento — Hexavante Admin

Documento de referência do setup **implementado** neste repositório.

---

## Pré-requisitos

Node.js 22+, MySQL 8+/MariaDB 11+ (pode ser o banco compartilhado de dev).

## Passo a passo

```bash
git clone https://github.com/Hexavante/Hexavante-admin.git
cd Hexavante-admin
npm install
cp .env.example .env
# DATABASE_URL=mysql://hexavante:senha@localhost:3306/hexavante
# NEXTAUTH_SECRET=segredo-forte
# NEXT_PUBLIC_APP_URL=https://app.hexavante.com.br
# RESEND_API_KEY=... (códigos de login; sem ela, só log)
npx prisma generate
PORT=3002 npm run dev
```

Login: conta com papel `MODERATOR`/`ADMIN` + código por e-mail.

## Nova tela de moderação (checklist)

1. Rota em `src/app/(main)/admin/<area>/page.tsx` com `await requireAdminPage()`.
2. Entrada no `ModerationNav` se for seção fixa.
3. Server Action retornando `{ success, error }` + log de auditoria quando sensível.
4. `npx next build` verde.

## Comandos úteis

`npm run dev` · `npm run build` · `npm start` · `npx prisma studio`.
