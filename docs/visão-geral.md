# Hexavante Admin — visão geral

Documento de referência da arquitetura **implementada** no repositório.

---

## Descrição

Painel de moderação da plataforma Hexavante (`https://painel.hexavante.com.br`): projeto, repo e deploy independentes do app web, com paridade total de funções e acesso direto ao banco compartilhado.

**Stack atual:** Next.js 16, React 19, Tailwind, Prisma, MariaDB, Resend. Ver [stack.md](stack.md) e [instalacao-e-desenvolvimento.md](instalacao-e-desenvolvimento.md).

---

## Papel no ecossistema

| Papel | Detalhe |
|-------|---------|
| Moderação | Usuários (cargos, warn/mute/ban), conteúdo, logs, terminal |
| Curadoria | Filas de cursos, tutoriais, categorias e instrutores; correções dissertativas |
| Operação | Broadcast, booster global, modo manutenção |
| Auditoria | Logs e estatísticas de 7 dias |

## Princípios

1. **Separação total**: container, repo e domínio próprios; o app web redireciona `/admin*` para cá.
2. **Sessão longa**: 30 dias com renovação deslizante; login sempre com código por e-mail.
3. **Validação em duas camadas**: middleware barra sem cookie; layout valida sessão e papéis.
