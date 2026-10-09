# Desktop API

O shell Tauri usa exclusivamente `DESKTOP_API_URL`. O valor padrão de produção é:

```text
https://desktop-api.hexavante.com.br
```

A URL é lida no processo Rust pelo comando específico `desktop_api_config`; o renderer não recebe acesso genérico ao filesystem nem a variáveis arbitrárias. Em produção, apenas HTTPS é aceito. HTTP é permitido somente para `localhost` em builds de desenvolvimento.

Toda requisição envia `X-Hexavante-Client: desktop`, `X-Hexavante-Client-Version` e, depois do login, o JWT Desktop em `Authorization: Bearer`. O token fica no Tauri Store. Uploads usam apenas as operações específicas de avatar/banner e nunca persistem o caminho local selecionado.

O Web continua usando Server Components, Server Actions, Route Handlers locais e Prisma. O script `npm run check:web-api-isolation` falha se `src/` voltar a referenciar qualquer uma das APIs Hexavante ou as variáveis antigas de URL.
