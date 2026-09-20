# Requisitos funcionais — Hexavante Admin

Documento de referência do comportamento **implementado**.

---

| ID | Requisito |
|----|-----------|
| RF-01 | Login com e-mail/senha + código de 6 dígitos (10 min, reenvio 60s) |
| RF-02 | Sessão de 30 dias com renovação deslizante; logout encerra |
| RF-03 | Visão geral com stats, gráfico de 7 dias e acessos rápidos |
| RF-04 | Usuários: busca, filtros, cargos, warn/mute/ban/unban, XP/moedas, impersonate, excluir |
| RF-05 | Conteúdo: publicar/despublicar/excluir cursos e simulados; gerenciar tutoriais |
| RF-06 | Simulados: CRUD completo + correções dissertativas |
| RF-07 | Categorias e candidaturas de instrutor: aprovar/rejeitar com motivo |
| RF-08 | Logs de auditoria com filtros; terminal CLI (`/tutorials`, `/stats`, `/broadcast`...) |
| RF-09 | Configurações: broadcast, booster global, modo manutenção |
| RF-10 | Busca rápida `Ctrl+K` (usuários, tutoriais, cursos, simulados) |
| RF-11 | Upload de capas com erro sempre em JSON |
| RF-12 | Links "ver no app" externos para conteúdo publicado |
