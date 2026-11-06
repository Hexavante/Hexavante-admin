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
  -e AUTH_SECRET='...' \
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

## Capas de simulados e uploads

O App e o Admin devem montar o **mesmo volume persistente** em `/app/public/uploads`. Compartilhar apenas o banco não compartilha as imagens. Confira os mounts dos dois containers antes de publicar; preserve o volume existente.

A rota `/uploads/[...path]` serve arquivos enviados após a inicialização do Next standalone. Depois do deploy, envie uma capa e abra o mesmo caminho `/uploads/exams/<arquivo>.webp` nos domínios do painel e do app. Ambos devem responder 200 com Content-Type image/webp. Se apenas um responder, corrija o compartilhamento do volume. Se o arquivo já não existir no volume, envie a capa novamente.
