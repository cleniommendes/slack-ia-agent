---
status: aceita
---

# 0017 · Três projetos pnpm independentes, sem workspace

`web`, `chat-api` e `chat-events` são projetos pnpm independentes, cada um com o seu lockfile, sem workspace; `chat-events` entra em `web` e em `chat-api` como dependência `file:`. O porquê está a definir.

Descartadas: pnpm workspaces; pnpm workspaces com Turborepo; npm workspaces.
Custo aceito: cada mudança em `chat-events` exige reinstalar nos dois projetos; não há cache nem ordem de tarefas entre os projetos; demais custos a definir.
