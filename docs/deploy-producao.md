# Deploy em produção — Hexavante Admin

Documento de referência do deploy **implementado** na VPS.

---

## Topologia

```
Internet ──HTTPS──▶ Nginx ──▶ 127.0.0.1:3002 ──▶ hexavante-admin (standalone)
                                                     └─Prisma──▶ MySQL compartilhado
```

## Passo a passo (`/opt/hexavante-admin`)

```bash
git fetch origin && git reset --hard origin/main
docker build --no-cache -t hexavante-admin .
docker stop hexavante-admin && docker rm hexavante-admin
docker run -d --name hexavante-admin --network hexavante_default -p 127.0.0.1:3002:3002 \
  -v hexavante_uploads:/app/public/uploads \
  -e DATABASE_URL='mysql://hexavante:<senha-%2F>@hexavante-mysql:3306/hexavante' \
  -e NEXTAUTH_SECRET='...' \
  -e NEXT_PUBLIC_APP_URL='https://app.hexavante.com.br' \
  -e RESEND_API_KEY='...' -e RESEND_FROM='...' \
  --restart unless-stopped hexavante-admin
```

Nginx (`painel.hexavante.com.br` → `:3002`, HTTPS via certbot). Pré-requisito: registro A `painel → 187.127.54.55` no DNS.

## Verificação

```bash
curl http://localhost:3002/admin-login        # 200
curl http://localhost:3002/admin              # 307 → /admin-login (sem cookie)
docker logs hexavante-admin                   # sem erro
```

Depois: login completo com código e navegação pelas 15 telas. Ver [casos-de-uso.md](casos-de-uso.md).
