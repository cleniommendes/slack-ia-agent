# Roteiro manual da F01-T04: nota de Acessibilidade do Lighthouse

**Quem faz:** uma pessoa, no Chrome. O agente prepara o roteiro; a pessoa registra o resultado.

**Antes:** o ambiente de pé (`docker compose up -d --wait`, `pnpm start:dev` na API e `pnpm dev` na
web), sem sessão aberta no navegador (aba anônima ou sem o cookie `clenio_session`).

1. Abra <http://localhost:3000/entrar> numa aba anônima.
2. Abra o Chrome DevTools, aba Lighthouse.
3. Marque só a categoria **Acessibilidade**, modo **Desktop**, e rode "Analyze page load".
4. Registre abaixo a nota e, se for menor que 100, as auditorias que falharam.

| Item | Resultado |
| --- | --- |
| Data e versão do Chrome | _a preencher_ |
| Nota de Acessibilidade na tela Entrar | _a preencher (a meta é 100)_ |
| Auditorias que falharam | _a preencher_ |

O `@axe-core/playwright` já passa sem violações (`e2e/a11y.spec.ts`), mas ele não substitui o
Lighthouse: as duas ferramentas têm conjuntos de regras diferentes.
