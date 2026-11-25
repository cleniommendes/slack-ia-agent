# Plano da F01-T03: Entrar com uma conta criada por comando e ver a Home

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

## Critérios

### CA1

**Marca:** teste de integração

**Cenário:** Dado o banco `chat_test` com as migrações rodadas, quando o teste insere uma Pessoa
com um e-mail que já existe, e outra com um e-mail com maiúsculas ou espaços nas pontas, então o
banco recusa as duas inserções (unicidade e `CHECK` de e-mail normalizado). Quem revisa abre a
migração e confere as colunas de `people` e `sessions` contra a spec e a nota do `CHECK` escrito à
mão.

**Teste previsto:** e2e da API, `test/people.e2e-spec.ts`, "o banco recusa e-mail repetido e e-mail
fora do formato normalizado", pelo `DataSource` da aplicação criada com `createTestApp()`.

### CA2

**Marca:** teste de integração

**Cenário 1:** Dado o módulo de contas montado contra o `chat_test` e um `PasswordPrompt` que
devolve uma senha dada, quando o teste roda `create` com e-mail e nome, então a Pessoa existe, o
`password_hash` começa com `$argon2id$` e verifica contra a senha dada, e o resultado diz que a
conta foi criada.

**Cenário 2:** Dado uma Pessoa já criada, quando o teste roda `create` com o mesmo e-mail (com
outras maiúsculas), então o resultado é de falha com a mensagem "Já existe uma conta com este
e-mail." e nenhuma segunda linha foi gravada.

**Teste previsto:** integração, `src/accounts/accounts.int-spec.ts`, "cria a Pessoa com a senha em
Argon2id" e "recusa um e-mail que já existe, com mensagem". O `PasswordPrompt` entra como argumento
de `AccountsCommand.run(argv, prompt)`, sem `overrideProvider`.

### CA3

**Marca:** teste HTTP

**Cenário:** Dado uma Pessoa com conta, quando ela chama `POST /v1/sessions` com o e-mail em
maiúsculas e com espaços nas pontas e a senha certa, então recebe 201 com `token` e `person`
(`id`, `name`, `email`), e a tabela `sessions` tem uma linha cujo `token_hash` é o SHA-256 do token
e não contém o token.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "responde 201 com o token e grava só o
hash da Sessão" e "aceita o e-mail com maiúsculas e espaços nas pontas".

### CA4

**Marca:** teste HTTP

**Cenário:** Dado uma Pessoa com conta, quando alguém entra com um e-mail sem conta e quando
alguém entra com o e-mail dela e a senha errada, então as duas respostas são 401 com
`code` `invalid_credentials` e o mesmo corpo. A verificação do e-mail sem conta contra o hash
fictício é tempo de resposta, e o teste não a prova: quem revisa a confere em
`SessionsService.login`.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "responde 401 invalid_credentials com
o mesmo corpo para e-mail sem conta e para senha errada".

### CA5

**Marca:** teste HTTP

**Cenário:** Dado a API de pé, quando alguém chama `POST /v1/sessions` com e-mail fora do formato,
com e-mail de 255 caracteres, com senha vazia e com senha de 257 caracteres, então cada uma
responde 400 com `validation_failed`.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "responde 400 validation_failed para
entrada inválida" (um caso por entrada inválida).

### CA6

**Marca:** teste HTTP

**Cenário 1:** Dado uma Sessão criada ao entrar, quando alguém chama `GET /v1/sessions/current`
com o cookie dela, então recebe 200 com a `person`.

**Cenário 2:** Dado a API de pé, quando alguém chama a mesma rota sem cookie e com um token
desconhecido, então recebe 401 `unauthenticated` nos dois casos, com o mesmo corpo.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "responde 200 com a Pessoa da
Sessão", "responde 401 unauthenticated sem cookie" e "responde 401 unauthenticated com token
desconhecido". Que a verificação mora num guard reaproveitável é conferido na revisão do diff
(`SessionGuard`, exportado pelo `SessionsModule`).

### CA7

**Marca:** teste no Playwright

**Cenário:** Dado uma Pessoa de teste, quando ela entra pela tela, então o navegador guarda o
cookie de sessão com o nome configurado, `HttpOnly`, `SameSite=Lax`, `Path=/`, sem `Secure` no
local e com validade de cerca de 400 dias, e o valor é o token (nenhum script da página o lê). Que
nenhum componente nem Server Action chama a API direto é imposto pelo lint: a regra
`no-restricted-globals` barra `fetch` em `src/app/**` fora de `src/app/services/**`.

**Teste previsto:** Playwright, `e2e/entrar.spec.ts`, "grava o cookie de sessão com os atributos do
LLD".

### CA8

**Marca:** teste no Playwright

**Cenário 1:** Dado um contexto sem cookie, quando o teste abre `/`, então termina em `/entrar`.

**Cenário 2:** Dado um contexto com o cookie de sessão apontando para um token que a API não
conhece, quando o teste abre `/`, então termina em `/entrar` e o cookie foi apagado.

**Teste previsto:** Playwright, `e2e/sessao.spec.ts`, "leva a Entrar sem cookie" e "leva a Entrar e
apaga o cookie quando a API não reconhece a Sessão".

### CA9

**Marca:** teste no Playwright

**Cenário 1:** Dado a tela Entrar aberta, então o foco está no campo E-mail.

**Cenário 2:** Dado uma Pessoa de teste, quando o teste envia o formulário e o envio demora, então o
botão fica em `loading` (desabilitado e com o spinner) e um segundo clique não dispara um segundo
envio.

**Cenário 3:** Dado uma Pessoa de teste, quando ela envia a senha errada, então a mensagem "E-mail
ou senha incorretos. Confira os dados e tente de novo." aparece abaixo da Senha, a Senha fica
vazia, o foco vai para a Senha e o e-mail continua preenchido.

A fidelidade aos frames "Padrão" (19:1306), "Enviando" (19:1369) e "Credenciais incorretas"
(19:1399) é provada no CA14.

**Teste previsto:** Playwright, `e2e/entrar.spec.ts`, "começa com o foco no e-mail", "bloqueia o
segundo envio e mostra o botão carregando" e "mostra a mensagem, limpa a senha, foca a senha e
mantém o e-mail com credenciais incorretas".

### CA10

**Marca:** teste no Playwright

**Cenário:** Dado uma Pessoa de teste logada (`loggedInPage`), quando o teste abre `/`, então vê o
Rail com "FC", "Início" ativo e o avatar com as iniciais do nome dela; a Sidebar só com o
cabeçalho "Clenio"; e o Main com o estado vazio da Home. Não há Atividade, controle de tema,
ponto de presença, lista de canais nem ícone de nova mensagem.

**Teste previsto:** Playwright, `e2e/home.spec.ts`, "mostra o shell da Home com as iniciais da
Pessoa". O texto do estado vazio é o do frame 19:1645, lido com o `get_design_context` na
implementação.

### CA11

**Marca:** revisão humana

**Cenário:** Dado o arquivo do Figma, quando quem revisa abre a seção Login da página Telas, então
o frame que era "Erro do servidor" (19:1399) se chama "Login / Credenciais incorretas".

### CA12

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre `test/sessions.e2e-spec.ts` e
`src/accounts/accounts.int-spec.ts`, então encontra os casos dos CA2 a CA6 (criar a Pessoa e entrar
pelos atalhos de `test/support/auth-routes.ts`, uma requisição por Act), e o `pnpm test:int` e o
`pnpm test:e2e` passam no contêiner `chat-api`.

### CA13

**Marca:** teste no Playwright

**Cenário:** Dado a web, a API e o banco `chat` de pé, quando se roda o Playwright no contêiner
`e2e`, então passam: entrar com sucesso até a Home e o caso das credenciais incorretas
(`e2e/entrar.spec.ts`); o teste-semente abre `/entrar` com uma Pessoa pronta (`e2e/seed.spec.ts`);
as fixtures `person` e `loggedInPage` existem em `e2e/fixtures.ts`; e o plano de testes da F01,
`e2e/plano-de-testes.md`, foi escrito pelo fluxo da skill `playwright-cli`.

**Teste previsto:** Playwright, `e2e/entrar.spec.ts`, "entra com e-mail e senha e chega à Home".

### CA14

**Marca:** revisão humana

**Cenário:** Dado a pasta desta tarefa, quando quem revisa abre `validacao-visual.md`, então
encontra, para Entrar (Padrão, Enviando e Credenciais incorretas) e para a Home, as capturas em
1440 × 900, no tema claro e no escuro, ao lado do `get_screenshot` do frame do Figma, e a
conclusão de cada par.

### CA15

**Marca:** documento

**Cenário:** Dado o `apps/chat-api/AGENTS.md`, quando quem revisa lê "Comandos", então encontra o
comando de contas (`pnpm accounts create <e-mail> <nome>`), com a nota de que a senha é lida do
terminal sem eco.

## Contrato

### people · chat · nova

| Coluna | Tipo | Nulo | Padrão | Observação |
| --- | --- | --- | --- | --- |
| `id` | uuid | não | | UUID v7, gerado na aplicação |
| `email` | texto | não | | Já normalizado: sem espaços nas pontas e em minúsculas |
| `name` | texto | não | | Nome exibido e fonte das iniciais |
| `password_hash` | texto | não | | Argon2id |
| `created_at`, `updated_at` | timestamptz | não | agora | Convenção da entidade base |

- Chave primária: `id`. Única: `email`.
- `CHECK (email = lower(btrim(email)))`, escrito à mão na migração: o TypeORM não o expressa.

### sessions · chat · nova

| Coluna | Tipo | Nulo | Padrão | Observação |
| --- | --- | --- | --- | --- |
| `id` | uuid | não | | UUID v7 |
| `person_id` | uuid | não | | Referência a `people` |
| `token_hash` | texto | não | | SHA-256 do token, em hexadecimal; nunca o token |
| `expires_at` | timestamptz | não | | `created_at` mais a `duração da Sessão` |
| `last_used_at` | timestamptz | não | agora | |
| `created_at`, `updated_at` | timestamptz | não | agora | Convenção da entidade base |

- Chave primária: `id`. Única: `token_hash`.
- Chave estrangeira `person_id` para `people(id)`, `ON DELETE CASCADE`.
- Índice em `person_id` (a revogação e a limpeza por Pessoa, nas tarefas seguintes).

### POST /v1/sessions · nova

| Item | Descrição |
| --- | --- |
| Autenticação | Pública |
| Corpo da requisição | `email` (texto, obrigatório, formato de e-mail, até 254 caracteres), `password` (texto, obrigatório, não vazio, até 256 caracteres) |
| Resposta de sucesso | 201, `{ "token": string, "person": { "id": string, "name": string, "email": string } }` |
| Erros | 400 `validation_failed`; 401 `invalid_credentials` |

O 429 `too_many_login_attempts` entra na F01-T08.

### GET /v1/sessions/current · nova

| Item | Descrição |
| --- | --- |
| Autenticação | Cookie de sessão (nome em `SESSION_COOKIE_NAME`), repassado pelo BFF no cabeçalho `Cookie` |
| Resposta de sucesso | 200, `{ "person": { "id": string, "name": string, "email": string } }` |
| Erros | 401 `unauthenticated` (cookie ausente, token desconhecido ou Sessão vencida) |

### BFF: Server Action de entrar · nova

Chamada pelo formulário da tela Entrar. Recebe `email` e `password`, chama `POST /v1/sessions` pelo
service da web e, com 201, grava o cookie de sessão (token como valor, `HttpOnly`, `SameSite=Lax`,
`Path=/`, `Secure` por `SESSION_COOKIE_SECURE`, `Domain` por `SESSION_COOKIE_DOMAIN` quando não
vazio, `Max-Age` de 400 dias) e leva a `/`. Com 401 `invalid_credentials`, devolve o estado de
credenciais incorretas, sem cookie. Não é rota REST.

### BFF: GET /api/sessao/encerrar · nova

Rota do navegador, a única da F01 fora de Server Action (ver "Decisões"). Apaga o cookie de
sessão e responde 307 para `/entrar`. Não lê nem valida a Sessão.

## Verificação do contrato

- `people`, unicidade e `CHECK` do e-mail: CA1.
- `people`, `sessions` (colunas, chave estrangeira, índice): conferidas no fim da tarefa contra a
  migração, e a gravação do hash em `sessions`, CA3.
- `POST /v1/sessions`: 201, CA3; 401 `invalid_credentials`, CA4; 400 `validation_failed`, CA5.
- `GET /v1/sessions/current`: 200, CA6; 401 `unauthenticated`, CA6 (Sessão vencida: F01-T06).
- Server Action de entrar: cookie e destino, CA7 e CA13; credenciais incorretas, CA9.
- `GET /api/sessao/encerrar`: provada pelo CA8 (cookie apagado e redirecionamento).

## Decisões

**API do chat**

- **Módulos:** `people/` (entidade `Person`, `PeopleService`), `sessions/` (entidade `Session`,
  `SessionsService`, `SessionsController`, DTO, `SessionGuard`) e `accounts/` (comando de
  contas). Motivo: um módulo por domínio, como o `AGENTS.md` da API.
- **Hash de senha:** `@node-rs/argon2` (Argon2id, parâmetros padrão da biblioteca, que seguem a
  recomendação da OWASP). Motivo: traz binários prontos e não compila nada no contêiner `slim`,
  e a `argon2` do npm exige aprovar um script de build. Entra no LLD, "Estrutura do código".
- **Normalização do e-mail:** `PeopleService.normalizeEmail` (trim e minúsculas), usada por login
  e por criação. O `CHECK` do banco é a rede de segurança.
- **Token:** 32 bytes aleatórios (`crypto.randomBytes`) em base64url; o banco guarda o SHA-256 em
  hexadecimal (`crypto.createHash`).
- **Hash fictício:** `SessionsService` calcula uma vez, na primeira necessidade, o Argon2id de um
  texto fixo, e verifica a senha contra ele quando o e-mail não tem conta. Motivo: o tempo de
  resposta não revela se a conta existe (LLD, "Segurança").
- **Erros de domínio novos:** `InvalidCredentialsError` (`invalid_credentials`, 401),
  `UnauthenticatedError` (`unauthenticated`, 401) e `EmailAlreadyUsedError`
  (`email_already_used`, 409), com o `code` no mapa `ERROR_PROBLEMS`. O `detail` de
  `invalid_credentials` e de `unauthenticated` é fixo; `email_already_used` só é visto pelo
  comando, que imprime a mensagem.
- **Variáveis da API:** `SESSION_COOKIE_NAME` (obrigatória, igual à da web, `clenio_session` no
  compose) e `SESSION_TTL_DAYS` (inteiro positivo, padrão 30). Entram no schema, no
  `.env.example`, no `compose.yaml` e no LLD, "Valores e configuração".
- **Guard:** `SessionGuard` lê o cookie do cabeçalho `Cookie` com o pacote `cookie` (já em
  `express`, declarado como dependência), procura a Sessão pelo hash do token, junta a Pessoa e a
  põe em `request.auth`; `@AuthenticatedPerson()` lê de lá. Sessão com `expires_at` no passado é
  tratada como `unauthenticated`; apagar a vencida e renovar são da F01-T06, que também a testa.
- **Comando de contas:** `pnpm accounts <operação> ...`, que compila `src` para `dist-cli/` com
  `tsc` e roda `node dist-cli/accounts/accounts.cli.js`. Motivo: o Nest precisa dos metadados dos
  decorators, que o `tsx` não emite, e o `nest build` apagaria o `dist/` de um `start:dev`
  aberto. `dist-cli/` entra no `.gitignore`. Esta tarefa implementa só `create <e-mail> <nome>`;
  `reset-password`, `revoke-sessions` e `purge-expired-sessions` entram com as tarefas que as
  usam.
- **Senha do comando:** `PasswordPrompt` (classe abstrata, `read(label): Promise<string>`), com
  `TerminalPasswordPrompt`, que lê do `stdin` em modo cru, sem eco e sem gravar no histórico. O
  `AccountsCommand.run(argv, prompt)` devolve `{ ok, message }`, e o `accounts.cli.ts` imprime e
  define o código de saída. Senha vazia é recusada.
- **Testes de integração com banco:** o `vitest.config.int.ts` passa a usar o mesmo `globalSetup`
  e `setupFiles` do e2e, para rodar no `chat_test`.
- **Atalhos de teste:** `test/support/auth-routes.ts` com `createPerson(app, options?)` (cria pelo
  `PeopleService`, devolve e-mail, senha e Pessoa) e `login(app, email, password)` (chama
  `POST /v1/sessions` e devolve o token e a Pessoa). Cada teste cria a própria Pessoa com
  `uniqueEmail()`.

**Web**

- **Estrutura:** `src/app/entrar/` (rota pública), `src/app/(app)/` (layout logado e Home em `/`),
  `src/app/services/` (services HTTP) e `src/proxy.ts` (o Next 16 procura o arquivo de `proxy` na
  raiz de `src/`, e não em `src/app/`).
- **Proxy:** sem cookie com o nome configurado, redireciona para `/entrar`; deixa passar
  `/entrar`, `/api/sessao/encerrar`, `/_next`, arquivos estáticos e o `favicon.ico`. O parâmetro
  `?para=` é da F01-T05, e o `/entrar` aberto com cookie, da F01-T06.
- **Layout logado:** componente assíncrono dentro de `<Suspense>` (com `cacheComponents` ligado, ler
  `cookies()` fora dele bloqueia a rota). Chama `GET /v1/sessions/current` pelo service, repassando
  o cookie, a cada renderização. Com 200 monta o shell com a Pessoa; com 401 faz `redirect` para
  `/api/sessao/encerrar`; falha de rede ou 5xx é da F01-T09 e, até lá, estoura o erro padrão. O
  fallback do `Suspense` é vazio até a F01-T09 entregar "Portas / Carregando o app".
- **Cookie:** `src/app/utils/session-cookie.ts` grava e apaga o cookie com `cookies()` do Next,
  lendo nome, domínio e `Secure` do `getEnv()`, e a validade (400 dias) de uma constante
  `SESSION_COOKIE_MAX_AGE_SECONDS`.
- **Service HTTP:** `src/app/services/chat-api.service.ts` é o único lugar com `fetch`. Tem
  `createSession(email, password)` e `getCurrentSession(token)`, com `cache: 'no-store'`, que
  traduzem o `problem+json` em `ChatApiError` (`status` e `code`). O endereço vem de
  `getEnv().CHAT_API_URL`. Uma regra do ESLint barra `fetch` fora dessa pasta.
- **Entrar:** `entrar/page.tsx` (Server Component) com o formulário `entrar-form.tsx` (Client
  Component, `useActionState` e `useFormStatus`) e `actions.ts` (`"use server"`, `signIn`). O
  estado devolvido é `{ error: 'invalid_credentials' | null, email }`; o e-mail volta
  preenchido, a Senha volta vazia e o foco vai para ela. Validação de campos (textos do PRD,
  história 2), falha de rede e tentativas demais são das F01-T04 e T08: nesta tarefa, qualquer
  outro erro da API estoura o erro padrão do Next.
- **Componentes novos, só os que a tela usa** (um arquivo cada, em `components/`): `ui/button`,
  `ui/input`, `ui/field`, `ui/spinner`, `ui/avatar`, `ui/empty-state`, `workspace-nav/rail`,
  `workspace-nav/sidebar`; mais `utils/cn.ts`. Dependências: `lucide-react`,
  `class-variance-authority`, `clsx` e `tailwind-merge`. As classes saem do `get_design_context`
  de cada componente no Figma, só com tokens. Radix e `sonner` não entram (UserMenu é da
  F01-T07).
- **Iniciais do avatar:** primeira letra do primeiro e do último nome, em maiúsculas, e a cor
  do avatar sai de `avatar-1` a `avatar-6` pelo id da Pessoa. Função pura em
  `utils/initials.ts`, coberta pelo CA10.
- **Fixtures do Playwright** (`e2e/fixtures.ts`): `person` cria a Pessoa direto no banco `chat`
  (dependência `pg` no `devDependencies`), com e-mail `e2e-<uuid>@teste.local`, o hash Argon2id de
  uma senha de teste fixa (constante no arquivo, gerada uma vez com `@node-rs/argon2` e
  copiada), e devolve e-mail, senha e nome; `loggedInPage` entra pelo formulário da tela Entrar,
  no único lugar que faz isso. O endereço do banco (`postgres:5432`, usuário local `chat`) fica
  escrito no arquivo, como a `baseURL`, porque o `e2e` só roda no contêiner.
- **Testes existentes:** o `seed.spec.ts` passa a abrir `/entrar` com uma Pessoa pronta, como a
  spec descreve, e o `tokens.spec.ts` troca `goto('/')` por `goto('/entrar')` (o `/` agora
  redireciona).
- **Figma:** o frame 19:1399 é renomeado antes do código da tela, pela `use_figma` (spec, "BFF e
  telas"). A validação visual usa o Claude in Chrome e o `get_screenshot` (LLD, "Estrutura do
  código"), e fica em `validacao-visual.md` e nas imagens da pasta da tarefa.
- **Apagar o cookie quando a API responde 401 ao layout:** o Next só deixa apagar cookie num
  Server Action ou num Route Handler, e não numa renderização, mas a spec e o LLD pedem que o
  layout "apague o cookie e leve a `/entrar`". Por isso um Route Handler,
  `GET /api/sessao/encerrar`, apaga o cookie e responde 307 para `/entrar`, e o layout faz
  `redirect` para ele. É a única rota do navegador que não é Server Action, e o `AGENTS.md` da web
  pede combinar antes. As F01-T05, T06 e T09 reaproveitam a mesma rota. Alternativas: um Server
  Action disparado por um Client Component na tela Entrar (a Pessoa vê o formulário com um cookie
  inválido por um instante e depende de JavaScript), ou deixar o cookie inválido até a Pessoa
  entrar de novo (contraria o LLD).

## Arquivos e interfaces

API do chat (`apps/chat-api/`):
- `package.json`: dependências `@node-rs/argon2` e `cookie`; scripts `accounts`.
- `.gitignore`: `/dist-cli`.
- `src/config/env.schema.ts`: `SESSION_COOKIE_NAME`, `SESSION_TTL_DAYS`. `.env.example`.
- `src/common/errors/error-code.ts`: `invalid_credentials`, `unauthenticated`, `email_already_used`.
- `src/people/person.entity.ts`, `people.service.ts`, `people.module.ts`: `PeopleService.create`,
  `findByEmail`, `normalizeEmail`, `verifyPassword`.
- `src/sessions/session.entity.ts`, `sessions.service.ts` (`login(email, password)`,
  `verify(token)`), `sessions.controller.ts`, `dto/login.dto.ts`, `session.guard.ts`,
  `authenticated-person.decorator.ts`, `sessions.module.ts`, e os erros de domínio.
- `src/accounts/accounts.command.ts` (`run(argv, prompt)`), `password-prompt.ts`,
  `terminal-password-prompt.ts`, `accounts.cli.ts`, `accounts.module.ts`.
- `src/app.module.ts`: importa `PeopleModule`, `SessionsModule`.
- `migrations/<timestamp>-CreatePeopleAndSessions.ts`: gerada e revisada, com o `CHECK` à mão.
- `vitest.config.int.ts`: `globalSetup` e `setupFiles`.
- `test/people.e2e-spec.ts`, `test/sessions.e2e-spec.ts`, `test/support/auth-routes.ts`,
  `src/accounts/accounts.int-spec.ts`.
- `AGENTS.md`: comando de contas (CA15).
- `compose.yaml`: `SESSION_COOKIE_NAME` e `SESSION_TTL_DAYS` no `chat-api`.

Web (`apps/web/`):
- `package.json`: `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`; dev `pg`
  e `@types/pg`.
- `src/proxy.ts`; `src/app/api/sessao/encerrar/route.ts`.
- `src/app/entrar/page.tsx`, `entrar-form.tsx`, `actions.ts`.
- `src/app/(app)/layout.tsx`, `src/app/(app)/page.tsx`.
- `src/app/services/chat-api.service.ts`; `src/app/utils/session-cookie.ts`, `cn.ts`,
  `initials.ts`.
- `src/app/components/ui/{button,input,field,spinner,avatar,empty-state}.tsx`,
  `src/app/components/workspace-nav/{rail,sidebar}.tsx`.
- `eslint.config.mjs`: `fetch` barrado fora de `src/app/services/**`.
- `e2e/fixtures.ts`, `e2e/entrar.spec.ts`, `e2e/sessao.spec.ts`, `e2e/home.spec.ts`,
  `e2e/plano-de-testes.md`; `e2e/seed.spec.ts` e `e2e/tokens.spec.ts` mudam.
- `AGENTS.md`: as pastas novas e a regra do `fetch`.

Pasta da tarefa: `validacao-visual.md` e as capturas.

## Testes existentes que mudam

- `apps/web/e2e/seed.spec.ts`: deixa de abrir `/` (404) e abre `/entrar` com uma Pessoa pronta, como
  a spec descreve para o teste-semente.
- `apps/web/e2e/tokens.spec.ts`: o `goto('/')` vira `goto('/entrar')`, porque `/` agora
  redireciona para Entrar; o teste "não serve mais a página inicial do esqueleto" confere a
  ausência do texto em `/entrar`.

## Mudança de dados

Nenhuma. As Pessoas de teste do Playwright ficam no banco `chat`, com e-mail `e2e-…@teste.local`
(LLD, "Ambiente de desenvolvimento").

## Documentos atualizados

- `docs/lld.md`, seção "Estrutura do código": a linha "Hash de senha" passa a citar a biblioteca
  `@node-rs/argon2`, com o motivo.
- `docs/lld.md`, seção "Valores e configuração", "Variáveis de ambiente": nova linha da API do
  chat, `SESSION_COOKIE_NAME`, "Nome do cookie de sessão, igual ao da web".
- `docs/lld.md`, seção "Interfaces", índice das rotas: nova linha "BFF: `GET /api/sessao/encerrar`"
  (rota do Route Handler decidido em "Decisões").
