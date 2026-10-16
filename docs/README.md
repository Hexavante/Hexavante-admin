# Documentação Hexavante

Índice oficial da documentação do projeto.

> Os arquivos ficam em **`docs/`** (plural). Não existe pasta `doc/` na raiz do repositório.

**Idiomas:** a maioria dos documentos está em português. O [README.md](../README.md) na raiz é **bilíngue (PT/EN)**.

---

## Comece aqui (desenvolvedores)

| Documento | Conteúdo |
|-----------|----------|
| **[instalacao-e-desenvolvimento.md](instalacao-e-desenvolvimento.md)** | Setup local, `.env`, Prisma, migrations, troubleshooting |
| [stack.md](stack.md) | Arquitetura, tecnologias e convenções de código |
| [der-logico.md](der-logico.md) | **DER oficial** — espelho do `prisma/schema.prisma` |
| [deploy-producao.md](deploy-producao.md) | Docker, VPS, Cloudflare Tunnel, DNS no IP próprio |

---

## Produto

> `categorias.md`, `monetizacao.md` e `publicacao-cursos.md` são herdados do app web
> (referência de negócio — o painel não os implementa).

| Documento | Conteúdo |
|-----------|----------|
| [visão-geral.md](visão-geral.md) | Descrição, papel no ecossistema e princípios do painel |
| [escopo-mvp.md](escopo-mvp.md) | O que está dentro e fora do escopo do painel |
| [categorias.md](categorias.md) | Categorias iniciais de cursos |
| [monetizacao.md](monetizacao.md) | Modelo de negócio |
| [publicacao-cursos.md](publicacao-cursos.md) | Fluxo de instrutores, moderação e capa |

---

## Requisitos e regras

| Documento | Conteúdo |
|-----------|----------|
| [requisitos-funcionais.md](requisitos-funcionais.md) | RF-01 a RF-12 (login, sessão, telas do painel) |
| [casos-de-uso.md](casos-de-uso.md) | UC-01 a UC-05 — sessão longa, moderação, publicação, correção, terminal |
| [regras-de-negocio.md](regras-de-negocio.md) | RN-01 a RN-10 (sessão, papéis, uploads, operação) |
| [permissoes.md](permissoes.md) | Papéis, RBAC e matriz de acesso |

---

## Técnico

| Documento | Conteúdo |
|-----------|----------|
| [stack.md](stack.md) | Stack e arquitetura |
| [der-conceitual.md](der-conceitual.md) | Modelo conceitual (visão macro) |
| [der-logico.md](der-logico.md) | DER relacional detalhado |
| [glossario.md](glossario.md) | Nomenclaturas, enums e status |
| [deploy-producao.md](deploy-producao.md) | Deploy com domínio, Docker e Cloudflare |

---

## Módulos implementados (referência rápida)

| Módulo | Rotas / serviços |
|--------|------------------|
| Login/sessão | `/admin-login`, `/admin-verificar`, `lib/admin-auth.ts` |
| Visão geral | `/admin` (stats, gráfico 7 dias, atalhos) |
| Usuários | `/admin/usuarios` (cargos, warn/mute/ban, XP, impersonate) |
| Conteúdo | `/admin/conteudo`, `/admin/cursos`, `/admin/tutorials` |
| Simulados | `/admin/simulados` (+ CRUD e correções dissertativas) |
| Curadoria | `/admin/categorias`, `/admin/instrutores` |
| Auditoria/operação | `/admin/logs`, `/admin/terminal`, `/admin/configuracoes` |

---

## Arquivo

| Pasta | Conteúdo |
|-------|----------|
| [archive/](archive/) | Histórico de decisões (referência) |

---

## Manutenção da documentação

Ao implementar uma feature que altere modelo, API ou fluxo de usuário:

1. Atualize `prisma/schema.prisma` e [der-logico.md](der-logico.md).
2. Documente scripts SQL novos em [instalacao-e-desenvolvimento.md](instalacao-e-desenvolvimento.md) e `package.json`.
3. Ajuste [stack.md](stack.md) se mudar arquitetura ou dependências.
4. Registre requisitos novos em [requisitos-funcionais.md](requisitos-funcionais.md) e o fluxo em [casos-de-uso.md](casos-de-uso.md) quando aplicável.
5. Atualize o [README.md](../README.md) se mudar setup, features visíveis ou deploy.
