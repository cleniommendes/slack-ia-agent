---
status: aceita
---

# 0018 · TypeORM na API do chat

A API do chat acessa o Banco do chat pelo TypeORM, e as migrações dele são o dono do schema desse banco. O porquê está a definir.

Descartadas: Prisma; Drizzle.
Custo aceito: a tipagem das consultas é fraca, e as migrações geradas precisam ser revisadas à mão; demais custos a definir.
