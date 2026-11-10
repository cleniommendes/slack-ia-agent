---
status: aceita
---

# 0012 · Ferramenta própria em Python em vez de MCP

O agente consulta o Banco de negócio por uma ferramenta própria em Python, no Serviço de agentes, e não por um servidor MCP, como sugeria o brief. Assim, a auditoria e os limites de cada consulta ficam sob controle total, sem peça nova.

Descartadas: servidor MCP de Postgres usado como ferramenta pelo ADK.
Custo aceito: foge do padrão MCP que o brief cita; cada fonte de dados nova vira código no agente.
