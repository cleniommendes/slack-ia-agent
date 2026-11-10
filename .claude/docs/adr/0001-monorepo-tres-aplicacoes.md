---
status: aceita
---

# 0001 · Monorepo com três aplicações: BFF, chat e agentes

O sistema é um monorepo com três aplicações implantadas separadamente: Frontend/BFF (Next.js), API do chat (NestJS) e agentes (Python, com o Serviço de agentes e o Worker como dois processos do mesmo projeto). Assim, as linguagens e o ciclo de cada parte ficam separados sem virar microsserviços.

Descartadas: monólito modular num processo só, com worker; monólito único com o segundo plano no mesmo processo; serviços separados por capacidade, com contratos próprios.
Custo aceito: o chat e os agentes ficam em processos diferentes, ligados por REST; três implantações para coordenar.
