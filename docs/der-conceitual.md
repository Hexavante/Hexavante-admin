# DER conceitual — Hexavante Admin

Documento de referência das entidades **operadas** (banco compartilhado, sem banco próprio).

---

```
MODERADOR (USER com papel) 1───* ADMIN_SESSION, ADMIN_VERIFICATION_CODE
MODERADOR ──ações──▶ USER (ban/mute/warn, cargos, XP)
MODERADOR ──curadoria──▶ COURSE / TUTORIAL / EXAM / CATEGORY / INSTRUCTOR_APPLICATION
MODERADOR ──correção──▶ EXAM_ANSWER (dissertativas)
MODERADOR ──operação──▶ PLATFORM_SETTING / NOTIFICATION (broadcast, booster, manutenção)
TUDO ──auditoria──▶ MODERATION_LOG
```

Sessão admin expira em 30 dias (renovável); códigos em 10 min. Ver o lógico em [der-logico.md](der-logico.md).
