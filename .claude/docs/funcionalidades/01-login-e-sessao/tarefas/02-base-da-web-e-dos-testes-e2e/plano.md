# Plano da F01-T02: Base da web e dos testes de ponta a ponta

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

## Critérios

### CA1

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre `apps/web/src/app/config/env.ts`, então
encontra o schema zod com `CHAT_API_URL`, `SESSION_COOKIE_NAME`, `SESSION_COOKIE_DOMAIN` e
`SESSION_COOKIE_SECURE`, a validação chamada na subida pelo `src/instrumentation.ts`, e nenhum
outro arquivo de `src/` lendo `process.env`. Quando roda
`docker compose exec -e CHAT_API_URL= web pnpm exec next start` depois de um `pnpm build`, então o
processo termina com código diferente de zero, antes de abrir a porta, e a mensagem traz
`CHAT_API_URL`.

Por que não há teste: o único seam da web é o Playwright (spec, "Decisões de teste"), que só vê a
web pelo navegador, e uma web que não sobe não tem página para ele abrir. Todo teste do
Playwright prova, de passagem, que a configuração válida deixa a web subir.

### CA2

**Marca:** teste no Playwright

**Cenário 1:** Dado a web de pé, quando o teste abre `/` com o navegador em modo claro e depois com
o `colorScheme` do navegador em escuro, então `--surface` vale `#ffffff` nos dois casos, porque o
escuro só vale com o atributo.

**Cenário 2:** Dado a web aberta, quando o teste põe `data-theme="dark"` na raiz, então `--surface`
vale `#1a1d21`, `--primary` continua `#007a5a` e `--sidebar-active` continua `#1264a3`.

**Cenário 3:** Dado a web aberta, quando o teste lê o estilo do `body`, então a fonte inclui a
Lato (variável `--font-lato` resolvida pelo `next/font`) e a cor do texto é `--fg`.

**Cenário 4:** Dado a web aberta em `/`, então a resposta é a página "não encontrada" do Next, e
não a página inicial do esqueleto: o texto "To get started" não existe na página.

**Teste previsto:** Playwright, `e2e/tokens.spec.ts`, "usa os tokens do tema claro por padrão",
"troca para os tokens do escuro só com data-theme=dark", "usa a fonte Lato e a cor de texto do
tema" e "não serve mais a página inicial do esqueleto". A lista completa de tokens (o bloco de
destino do design system) é conferida pela revisão no diff do `globals.css`; o teste amostra
tokens dos três grupos (superfície, marca, casca).

### CA3

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre o `compose.yaml` e o `package.json` da
web, então encontra o serviço `e2e` com `profile`, a imagem
`mcr.microsoft.com/playwright:v<versão>-noble` com a mesma versão exata do `@playwright/test` (sem
`^`), `PLAYWRIGHT_HTML_OPEN=never`, o comando que o mantém parado, o repositório montado como nos
outros serviços e o `depends_on` da `web`. Quando roda
`docker compose --profile e2e up -d --wait e2e` e
`docker compose exec e2e node -e "fetch('http://web:3000')"` com a web de pé, então o contêiner
sobe e alcança a web.

### CA4

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre o `playwright.config.ts`, então
encontra só o projeto `chromium`, `headless: true` e `baseURL` `http://web:3000`; e no
`package.json`, o `@axe-core/playwright`. Quando roda no contêiner `e2e` o comando
`playwright-cli` do pacote instalado (`node_modules/.bin/playwright-cli --help`), então ele
responde sem nenhuma instalação global.

### CA5

**Marca:** teste no Playwright

**Cenário:** Dado a web de pé (`pnpm dev` no contêiner `web`) e o contêiner `e2e` de pé, quando se
roda o comando dos testes de ponta a ponta no contêiner `e2e`, então o teste-semente abre a web, a
resposta chega do Next e o comando termina com sucesso.

**Teste previsto:** Playwright, `e2e/seed.spec.ts`, "abre a web". Comando:
`docker compose exec e2e node_modules/.bin/playwright test`, também como script `test:e2e` do
`package.json`.

### CA6

**Marca:** documento

**Cenário:** Dado o `AGENTS.md` da raiz, quando quem revisa lê "Execução no Docker", então
encontra o `e2e` na tabela de serviços, com o comando para subi-lo
(`docker compose --profile e2e up -d --wait e2e`) e a nota de que ele depende da web de pé. Dado o
`apps/web/AGENTS.md`, quando lê "Comandos" e "Testes", então encontra o comando dos testes de
ponta a ponta e a indicação da skill `playwright-cli` como o jeito de escrevê-los e corrigi-los.

### CA7

**Marca:** revisão humana

**Cenário:** Dado o branch da tarefa, quando quem revisa roda no contêiner `web` `pnpm lint` e
`pnpm exec tsc --noEmit`, então os dois terminam sem erro.

## Contrato

O contrato não muda. A tarefa não cria nem muda rota, evento ou tabela.

## Verificação do contrato

Nenhum item.

## Decisões

- **Configuração:** `src/app/config/env.ts` exporta `envSchema` (zod), `parseEnv(raw)`, que lança
  com o nome de cada variável inválida, e `getEnv()`, que valida `process.env` uma vez e guarda o
  resultado. Motivo: é o único arquivo que lê `process.env`, como no `AGENTS.md` da web.
- **Validação na subida:** `src/instrumentation.ts` chama `getEnv()` no `register()`, para o
  processo falhar na subida, e não na primeira requisição. É o único arquivo fora de `src/app/`,
  porque o Next só procura o `instrumentation.ts` na raiz de `src/`.
- **Variáveis:** `CHAT_API_URL` (URL, obrigatória), `SESSION_COOKIE_NAME` (texto não vazio,
  obrigatória), `SESSION_COOKIE_SECURE` (`"true"` ou `"false"`, obrigatória, convertida em
  booleano) e `SESSION_COOKIE_DOMAIN` (texto, padrão vazio, porque no local não há `Domain`).
  Valores do compose: `SESSION_COOKIE_NAME=clenio_session`, `SESSION_COOKIE_DOMAIN=` e
  `SESSION_COOKIE_SECURE=false`. O `.env.example` da web ganha as quatro, com valores falsos.
  Motivo: a lista é a do LLD ("Valores e configuração"), e só o domínio tem padrão porque o LLD diz
  "vazio no local". A F01-T03 usa o mesmo nome do cookie na API, se precisar dele.
- **Lint contra `process.env`:** regra `no-restricted-properties` do ESLint barra
  `process.env` em `src/**`, exceto em `src/app/config/**`. Motivo: a mesma garantia por máquina
  que a T01 deu à API.
- **Tokens:** o `globals.css` recebe, como estão no design system ("Tokens"), os blocos `:root`,
  `:root[data-theme="dark"]`, `@custom-variant dark`, `@theme inline` (cores, fonte, raios,
  tamanhos do shell, sombras), `@theme` (escala de texto, easing e animações) e o
  `prefers-reduced-motion`; mais o `body` com `--surface`, `--fg` e `--font-sans`. O escuro não
  usa `prefers-color-scheme`. Motivo: é o "conjunto completo" do critério, e o documento é o dono
  dos valores.
- **Fonte:** Lato pelo `next/font/google` (400, 700, 900 e itálico), variável `--font-lato`, no
  `<html lang="pt-BR">`. A Geist e a pilha do esqueleto saem. O `title` e a `description` do
  `metadata` passam para "Clenio Chat".
- **Saem do esqueleto:** `src/app/page.tsx` e os SVGs de `public/` (`file`, `globe`, `next`,
  `vercel`, `window`). O `favicon.ico` fica. A web fica sem rota `/` até a T03, e a resposta a
  `/` é a página "não encontrada" do Next.
- **Serviço `e2e`:** imagem `mcr.microsoft.com/playwright:v<versão>-noble`, `profiles: [e2e]`,
  `user: "1000:1000"` (arquivos de `test-results` e `playwright-report` ficam do usuário do host),
  `ipc: host` e `init: true` (recomendação da imagem para o Chromium), `working_dir` em
  `/home/node/app/apps/web`, o repositório montado em `/home/node/app`, `command: sleep infinity`,
  `PLAYWRIGHT_HTML_OPEN=never` e `depends_on: [web]`. Motivo: igual aos outros serviços, e o
  `playwright-cli` e o teste rodam no mesmo contêiner (LLD, "Ambiente de desenvolvimento").
- **Rodar o Playwright:** `node_modules/.bin/playwright`, e não `pnpm exec`, porque a imagem do
  Playwright não traz o pnpm e o `node_modules` vem do contêiner `web`. Um script `test:e2e` no
  `package.json` guarda o mesmo comando, para a skill e a verificação completa chamarem o mesmo.
- **Versão do Playwright:** a última estável na hora da implementação, fixada sem `^` em
  `@playwright/test`, e a imagem usa a mesma. `@axe-core/playwright` entra em `devDependencies`.
- **Onde ficam os testes:** `apps/web/e2e/` (`seed.spec.ts` e `tokens.spec.ts`), com
  `playwright.config.ts` na raiz do projeto, `testDir: ./e2e`, só o projeto `chromium` e
  `baseURL: http://web:3000` escrito no arquivo (o host é o nome do serviço, como o `AGENTS.md`
  da raiz manda). `test-results/` e `playwright-report/` entram no `.gitignore`.
- **Teste-semente:** como a web não tem rota `/` nesta tarefa, o `seed.spec.ts` abre `/`, confere
  que a resposta chegou do Next (status 404 e o título da página "não encontrada") e serve de ponto
  de partida do fluxo da skill `playwright-cli`. A T03 o troca por `/entrar` com a fixture
  `person`, como diz a spec.
- **Verificação completa da web:** passa a incluir os testes do Playwright, para quem fechar uma
  tarefa de web (`AGENTS.md` da web, "Verificação completa"); eles exigem `web` com `pnpm dev` e o
  `e2e` de pé.
- **CA1 sem teste automatizado:** fica como revisão humana, com o comando que prova a falha na
  subida, porque a spec não prevê Vitest na F01 e o Playwright não
  enxerga uma web que não sobe. A alternativa é um teste do Playwright que roda `next start`
  num processo filho com a variável a menos, mas ele depende da versão do Node do contêiner `e2e`
  (a imagem do Playwright não é Node 26) e do `next build` feito, e custa minutos por execução.
- **A web sem a rota `/` até a T03:** aceito, porque o critério pede que a página
  inicial saia, e a Home real (shell, F01-T03) é a primeira rota. O risco é o `next build` falhar
  sem nenhuma `page.tsx`; se falhar, a implementação para e volta para você, sem inventar uma
  página provisória. A alternativa é manter uma `page.tsx` mínima e vazia, o que contraria o texto
  do CA2.

## Arquivos e interfaces

- `apps/web/package.json`: dependências `zod`; dev `@playwright/test` (versão exata) e
  `@axe-core/playwright`; script `test:e2e`.
- `apps/web/src/app/config/env.ts`: `envSchema`, `type Env`, `parseEnv(raw): Env`, `getEnv(): Env`.
- `apps/web/src/instrumentation.ts`: `register()`, que chama `getEnv()`.
- `apps/web/src/app/globals.css`: tokens do design system, nos temas claro e escuro.
- `apps/web/src/app/layout.tsx`: Lato, `lang="pt-BR"`, `metadata` do produto.
- `apps/web/src/app/page.tsx` e `apps/web/public/*.svg`: removidos.
- `apps/web/eslint.config.mjs`: regra contra `process.env` fora de `src/app/config/**`.
- `apps/web/.env.example`: as quatro variáveis, com valores falsos.
- `apps/web/playwright.config.ts`: projeto `chromium`, headless, `baseURL`.
- `apps/web/e2e/seed.spec.ts` e `apps/web/e2e/tokens.spec.ts`: os testes de CA5 e CA2.
- `apps/web/.gitignore`: `test-results/` e `playwright-report/`.
- `apps/web/AGENTS.md`: comando dos testes de ponta a ponta, skill `playwright-cli`, situação e
  verificação completa (CA6).
- `AGENTS.md` (raiz): serviço `e2e` na tabela e como subi-lo (CA6).
- `compose.yaml`: serviço `e2e` e as variáveis de sessão no `web`.

## Testes existentes que mudam

Nenhum. A web não tem testes hoje.

## Mudança de dados

Nenhuma.

## Documentos atualizados

Nenhum no commit de plano: a tarefa não muda regra que o LLD ou o HLD registram. Na entrega, a
skill `lld` marca o serviço `e2e` como existente (LLD, "Ambiente de desenvolvimento"), tira o
"planejado" das variáveis da web (LLD, "Valores e configuração") e a do design system atualiza a
tabela "Estado atual" (tokens implementados).
