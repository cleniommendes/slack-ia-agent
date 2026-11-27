<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md · Web (Frontend/BFF)

A web é a interface do Clenio Chat e o BFF, o único ponto de entrada do navegador. Ela grava o
cookie de sessão, chama a API do chat e dispara os pedidos aos agentes. As regras gerais do
projeto estão no [`AGENTS.md` da raiz](../../AGENTS.md); aqui ficam só as da web.

**Situação:** base pronta (configuração, tokens do design system e Playwright, da
[F01-T02](../../.claude/docs/funcionalidades/01-login-e-sessao/tarefas/02-base-da-web-e-dos-testes-e2e/tarefa.md));
as telas entram por cima (Entrar e a Home existem desde a F01-T03). Antes de implementar uma tarefa, leia a tarefa
e o `plano.md` dela.

## Stack

| Papel | Escolha | Situação |
| --- | --- | --- |
| Framework | Next.js 16 (App Router, `src/app`), React 19 | instalado |
| Linguagem | TypeScript 5, `strict`, alias `@/*` para `src/*` | instalado |
| Estilo | Tailwind CSS 4, configurado só em CSS (`@theme`), sem `tailwind.config` | instalado |
| Build | Turbopack, com o loader `@tailwindcss/turbopack` | instalado |
| Lint | ESLint com `eslint-config-next` | instalado |
| Mutações do navegador | Server Actions | planejada (F01) |
| Leituras que o tempo real altera | SWR, atualizado pelos eventos do WebSocket | planejada (F03) |
| Tempo real | Socket.IO client | planejada (F03) |
| Configuração | schema zod | planejada (T02) |
| Testes | Playwright, só Chromium headless, com `@axe-core/playwright` | instalado |
| Interface | `lucide-react`, `radix-ui`, `class-variance-authority` + `clsx` + `tailwind-merge`, `sonner`, Lato pelo `next/font` | a instalar, quando o primeiro componente precisar |

A stack de interface, com o porquê de cada peça, está no
[design system](../../.claude/docs/design-system.md), "Stack de interface".

## Comandos

Rode dentro do contêiner, a partir da raiz do repositório: `docker compose exec web <comando>`.

| Comando | O que faz |
| --- | --- |
| `pnpm dev` | Sobe a web com recarga, em <http://localhost:3000> |
| `pnpm build` | Build de produção |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | Confere os tipos |
| `pnpm add <pacote>` | Instala uma dependência; nunca pelo host nem com `npm` |

**Testes de ponta a ponta** rodam no serviço `e2e`, com a web de pé (`pnpm dev`). Suba o serviço
com `docker compose --profile e2e up -d --wait e2e` (a imagem do Playwright não traz o pnpm, por
isso o binário é chamado direto):

| Comando | O que faz |
| --- | --- |
| `docker compose exec e2e node_modules/.bin/playwright test` | Roda todos os testes do Playwright (`e2e/`); o script `pnpm test:e2e` é o mesmo comando |
| `docker compose exec e2e node_modules/.bin/playwright test e2e/<arquivo>` | Roda um arquivo |
| `docker compose exec e2e node_modules/.bin/playwright cli <comando>` | O `playwright-cli` do pacote instalado, configurado em `.playwright/cli.config.json` (Chromium headless) |

## Verificação completa

Rodada uma vez antes de entregar uma tarefa que tocou a web, dentro do contêiner:

```bash
docker compose exec web pnpm lint
docker compose exec web pnpm exec tsc --noEmit
docker compose exec web pnpm build
docker compose --profile e2e up -d --wait e2e   # com `pnpm dev` rodando no contêiner web
docker compose exec e2e node_modules/.bin/playwright test
```

Todos terminam sem erro.

## Estrutura de pastas

```
apps/web/src/proxy.ts   sem cookie de sessão, manda para /entrar (o Next 16 chama de proxy)
apps/web/src/app/
  layout.tsx, globals.css
  config/env.ts         único lugar que lê process.env (schema zod); getEnv()
  entrar/               tela Entrar: page.tsx, entrar-form.tsx (client) e actions.ts (signIn)
  (app)/                telas logadas: layout.tsx verifica a Sessão na API; page.tsx é a Home (/)
  api/sessao/encerrar/  route handler que apaga o cookie e leva a /entrar
  services/             services HTTP: o único lugar que chama a API do chat com fetch
  components/
    ui/                 primitivos, um arquivo por componente, em kebab-case (button.tsx)
    workspace-nav/      Rail e Sidebar; ainda virão user/, agent/, conversation/, message/...
  utils/                cn.ts, initials.ts, session-cookie.ts
apps/web/e2e/           testes do Playwright, fixtures.ts e o plano-de-testes.md
```

- Tudo mora dentro de `src/app/`, exceto o `src/proxy.ts`.
- Um componente do Figma corresponde a um componente no código, com o mesmo nome em PascalCase.
  Antes de criar um, procure em `src/app/components/` um que já cubra o caso.
- As telas do Figma viram rotas e layouts, compostos a partir dos componentes.
- O `next.config.ts`, na raiz do projeto, chama `getEnv()` ao ser
  carregado, para a web falhar na subida com o nome da variável (o `register()` do
  `instrumentation.ts` não serve: o Next captura o erro e sobe a web respondendo 500).
- Os testes do Playwright ficam em `apps/web/e2e/`, com o `playwright.config.ts` na raiz do projeto.

## Server Components

- Componente nasce como Server Component. A página carrega os dados no servidor.
- `"use client"` só onde há estado, evento ou API do navegador, no menor componente possível.
  Os primitivos que embrulham Radix (Dialog, DropdownMenu, Tooltip, Switch, Tabs) e o Toaster
  são Client Components; os sem estado (Button, Avatar, CountBadge, Skeleton, EmptyState) não.
- No cliente, o SWR guarda só as leituras que o tempo real altera (mensagens, não lidas,
  notificações). Cada evento do WebSocket atualiza esse cache direto, sem nova requisição.

## API Externas

- **O navegador fala só com a web.** As mutações são Server Actions, que conferem o `Origin`
  contra CSRF. Não crie rota REST para o navegador sem combinar.
- **Nenhum componente nem Server Action chama `fetch` direto** (o ESLint barra `fetch` em
  `src/app/` fora de `services/`). Cada chamada à API do chat passa
  por um service HTTP da web, que conhece o endereço, repassa o cookie de sessão no cabeçalho
  `Cookie` e traduz o `problem+json` da API.
- A web chama a API pela rede interna (`CHAT_API_URL`, `http://chat-api:3000` no local). O
  navegador abre o WebSocket direto na API, em outro endereço (`localhost:3001` no local).
- Campos do JSON em `snake_case`, como nas APIs.
- Erros que a web devolve seguem o mesmo `problem+json` com `code`.

## Sessão e cookie

- O BFF grava o cookie com o token devolvido pela API ao entrar e o apaga ao sair ou ao receber
  401. Atributos: `HttpOnly`, `Secure` (desligado no local), `SameSite=Lax`, `Path=/`, `Domain`
  por variável (vazio no local).
- O proxy do Next confere só se o cookie existe; sem ele, manda para `/entrar`. Quem valida a
  Sessão de verdade é a API do chat.
- O layout das telas logadas verifica a Sessão a cada renderização: 401 apaga o cookie e manda
  para `/entrar`; falha de rede ou 5xx mostra "Não foi possível verificar sua sessão", com
  "Tentar de novo", e não manda para `/entrar`.
- O caminho de volta vai em `?para=`. Só vale caminho relativo que começa com `/` e não com `//`;
  outro valor leva à Home.
- As telas logadas saem com `Cache-Control: no-store`, e o layout logado recarrega no `pageshow`
  com `persisted`, para o histórico não mostrar conteúdo a quem saiu.

O comportamento completo está no LLD, "Cliente", "Sessão no cliente".

## Configuração

- Um módulo só lê e valida as variáveis, com zod: `CHAT_API_URL`, `SESSION_COOKIE_NAME`,
  `SESSION_COOKIE_DOMAIN` e `SESSION_COOKIE_SECURE`. Nenhum outro arquivo lê `process.env`.
- Faltou variável obrigatória: a web falha na subida (`next dev` e `next start`, que saem com
  código 1) com o nome dela.
- Variável nova entra no schema, no `.env.example`, no `compose.yaml` e na tabela do LLD.

## Design system e Figma

- Cores, tipografia, espaçamento, raios e componentes vêm do
  [design system](../../.claude/docs/design-system.md) e do Figma (`fileKey`
  `plW17JDOoRHydUJIIi2u87`). Leia o design system antes de qualquer tela.
- Use só tokens. Hex ou px soltos são sinal de token faltando: ache o equivalente ou pergunte,
  em vez de criar um valor.
- Temas: o claro é o padrão; o escuro vale só com `data-theme="dark"` na raiz.
- Ícones só do `lucide-react`, com cor vinda de `currentColor`. Sem SVG solto.
- Produto só para desktop, com 1440 × 900 como tamanho de referência. Escreva mobile-first com
  os prefixos do Tailwind, sem media query solta no CSS.
- Uma tela só está pronta depois da validação visual contra o Figma, nos dois temas (design
  system, "Validação visual").

## Testes

- **O único seam da web são os testes de ponta a ponta com o Playwright.** Sem teste de unidade
  na web por enquanto.
- Rodam só no Chromium headless, no serviço `e2e` do compose, contra o ambiente de
  desenvolvimento de pé (web, API e banco `chat`). Nunca rode o Playwright com `npx` no host.
- O teste-semente (`e2e/seed.spec.ts`) abre `/`, que até a F01-T03 é a página "não encontrada" do
  Next; a F01-T03 o troca por `/entrar`.
- Cada teste cria a própria Pessoa com e-mail de prefixo `e2e-` no domínio `teste.local`.
- Os testes são escritos pelo fluxo da skill `playwright-cli` (planejar, gerar e corrigir), a
  partir de um teste-semente.
- Telas Entrar e Home passam na checagem do `@axe-core/playwright` sem violações. O fluxo
  inteiro funciona só pelo teclado.

### Verificações do agente com o Claude in Chrome

A validação visual, as verificações exploratórias que a spec pede e a depuração pelo console e
pela rede usam a extensão Claude in Chrome (LLD, "Estrutura do código"). Ela não prova critério
que precise se repetir: isso continua com o Playwright.

- Carregue a skill do Claude in Chrome antes do primeiro uso.
- Abra sempre uma aba nova, contra `http://localhost:3000`, sem mexer nas abas da pessoa.
- Use só Pessoas de teste, criadas pelo comando de contas ou pela fixture, nunca dados reais.
- Registre as capturas e o que foi conferido na pasta da tarefa.

O serviço, as fixtures (`person`, `loggedInPage`) e o teste-semente chegam com a T02 e a F01.

## Onde ler mais

- Telas, estados e textos da F01: [spec da F01](../../.claude/docs/funcionalidades/01-login-e-sessao/spec.md),
  "BFF e telas (web)", e o [PRD](../../.claude/docs/funcionalidades/01-login-e-sessao/prd.md).
- Comportamento do cliente: LLD, "Cliente".
- Por que o BFF e o WebSocket direto na API:
  [ADR 0002](../../.claude/docs/adr/0002-next-bff-websocket-direto.md) e
  [ADR 0009](../../.claude/docs/adr/0009-bff-dispara-agente.md).
