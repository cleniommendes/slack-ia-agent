# Plano da F01-T01: Base da API do chat

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

## Critérios

### CA1

**Marca:** teste de integração

**Cenário:** Dado o ambiente da API sem `DATABASE_URL`, quando o processo da API sobe, então ele
termina com código de saída diferente de zero, antes de abrir a porta, e a mensagem de erro traz o
nome `DATABASE_URL`.

**Teste previsto:** e2e da API (processo, sem HTTP), `test/startup.e2e-spec.ts`, "a API não sobe
sem DATABASE_URL e diz o nome da variável". O teste sobe `src/main.ts` num processo filho, com o
ambiente do contêiner menos `DATABASE_URL`. A parte "nenhum outro ponto lê o ambiente" é imposta
pelo lint (ver "Decisões").

### CA2

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre `src/database/` e o `package.json`,
então encontra o TypeORM ligado ao Banco do chat pela configuração validada, a
`SnakeNamingStrategy` nas opções usadas pela aplicação e pela CLI, `synchronize` desligado, a
entidade base com o id gerado por `crypto.randomUUIDv7()` antes da inserção, e os scripts
`migration:generate`, `migration:run` e `migration:revert`. No contêiner, `pnpm migration:run`
termina sem erro no banco `chat` e cria a tabela `migrations`. A conexão em si é provada por
todo teste e2e, que sobe a aplicação contra o banco.

### CA3

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre o `AppModule`, então encontra o filter
global em `APP_FILTER` e o `ValidationPipe` em `APP_PIPE`, e nada disso no `main.ts`; e em
`src/common/errors/` encontra o `DomainError`, o tipo `ErrorCode` e o filter com o mapa de `code`
para status.

### CA4

**Marca:** teste HTTP

**Cenário 1:** Dado a API de pé, quando alguém pede `GET /v1/rota-inexistente`, então recebe 404 com
`Content-Type: application/problem+json` e o corpo com `status` 404 e `code` `not_found`.

**Cenário 2:** Dado uma rota que falha com um erro inesperado cuja mensagem tem um detalhe interno,
quando alguém a chama, então recebe 500 com `code` `internal_error`, o corpo não traz a mensagem
interna nem stack trace, e o erro é registrado em log no nível `error`.

**Teste previsto:** e2e da API, `test/errors.e2e-spec.ts`, "responde 404 em problem+json com o
code not_found numa rota inexistente" e "responde 500 sem a mensagem interna nem stack trace e
registra o erro em log". A rota que falha é um controller declarado só no arquivo de teste e
passado ao `createTestApp()`. O log é provado por um espião em `Logger.prototype.error`, que é o
próprio efeito (`.claude/rules/nest-api-testing.md`).

### CA5

**Marca:** teste de integração

**Cenário:** Dado a suíte e2e iniciada, quando a aplicação de teste consulta o banco em que está
conectada, então o banco é o `chat_test` e a tabela `migrations` existe nele.

**Teste previsto:** e2e da API, `test/database.e2e-spec.ts`, "a aplicação de teste usa o banco
chat_test com as migrações rodadas", pelo `DataSource` da aplicação criada com `createTestApp()`.
O caminho "volume que já existe" roda em toda execução do `globalSetup` (cria o banco só se ele
não existe); quem revisa o confere uma vez apagando o `chat_test` e rodando `pnpm test:e2e`.

### CA6

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre `test/support/`, então encontra
`createTestApp()` e `uniqueEmail()`, e o `test/errors.e2e-spec.ts` sobe a aplicação só por
`createTestApp()` e a fecha com `app.close()`.

### CA7

**Marca:** documento

**Cenário:** Dado o `apps/chat-api/AGENTS.md`, quando quem revisa lê a seção "Comandos", então
encontra os três comandos de migração com o argumento do nome; e, na seção "Testes", a observação
de que a suíte e2e roda no `chat_test`, criado pelo script de inicialização e, num volume que já
existe, pelo `globalSetup`, que também roda as migrações, com ponteiro para o LLD, "Ambiente de
desenvolvimento".

### CA8

**Marca:** revisão humana

**Cenário:** Dado o branch da tarefa, quando quem revisa roda no contêiner `chat-api` `pnpm lint`,
`pnpm exec tsc --noEmit`, `pnpm test`, `pnpm test:int` e `pnpm test:e2e`, então todos terminam
sem erro.

## Contrato

### GET / · removida

Rota do esqueleto do Nest ("Hello World!"), sem consumidor. Sai com o `AppController` e o
`AppService`.

Nenhuma rota, evento ou tabela nova. O corpo de erro é convenção do LLD ("Conceitos transversais
de implementação", seção "Erros") e vale para todas as rotas; a tabela `migrations` é do próprio
TypeORM.

## Verificação do contrato

- `GET /` removida: sem teste. A rota não tem consumidor, e a resposta a qualquer rota inexistente
  já é provada pelo CA4.

## Decisões

- **Configuração:** `@nestjs/config` com `ignoreEnvFile: true` e `validate` apontando para o
  schema zod de `src/config/env.schema.ts`. O erro lista cada variável inválida pelo nome. As
  variáveis vêm do compose e, em produção, da PaaS; o `.env.example` documenta a lista. Motivo:
  uma fonte só, igual no contêiner e na PaaS.
- **Variáveis desta tarefa:** `DATABASE_URL` (obrigatória) e `PORT` (padrão 3000), que hoje o
  `main.ts` lê direto. `SESSION_TTL_DAYS` e `WEB_ORIGIN` entram nas tarefas que as usam.
- **Leitura do ambiente:** só `src/config/` toca em `process.env`. A CLI do TypeORM, que roda fora
  do Nest, chama `loadEnv()` de `src/config/`, o mesmo schema. Uma regra
  `no-restricted-properties` do ESLint barra `process.env` em `src/**` fora de `src/config/**`.
  Motivo: o critério vira regra conferida por máquina, e não só revisão.
- **Opções do TypeORM num lugar só:** `src/database/database.options.ts` monta as opções (URL,
  `SnakeNamingStrategy` do `typeorm-naming-strategies`, `synchronize: false`), usadas pelo
  `TypeOrmModule.forRootAsync` e pelo `data-source.ts` da CLI. A aplicação usa
  `autoLoadEntities`; a CLI acha as entidades por glob. A aplicação não roda migrações ao subir,
  como diz o `AGENTS.md` da raiz.
- **Migrações em `apps/chat-api/migrations/`**, como no LLD, "Estrutura do código", fora de `src/`
  e fora do `tsconfig.build.json`, rodadas pela CLI com ts-node. Como rodar migrações em produção
  fica para a tarefa de implantação.
- **Id:** entidade base abstrata em `src/database/`, com `id` UUID (`@PrimaryColumn`), gerado por
  `crypto.randomUUIDv7()` num `@BeforeInsert` quando vazio, e `createdAt`/`updatedAt` em
  `timestamptz`. O Node 26 do contêiner já tem `randomUUIDv7`, então não entra o pacote `uuid`.
  Inserção que não passa pelo `save` (`insert`, QueryBuilder) gera o id com a mesma função.
- **Corpo do erro:** `type` `about:blank`, `title` com a frase do status HTTP, `status`, `detail`
  e `code`, sem `instance` (LLD, "Conceitos transversais de implementação", seção "Erros"). O `DomainError` leva o `code` e a mensagem,
  que vai para o `detail`.
- **Códigos desta tarefa:** `validation_failed` (400), `not_found` (404), `payload_too_large`
  (413), `request_rejected` (outro 4xx de `HttpException` ou do leitor do corpo, mantendo o
  status) e `internal_error` (500). O 400 do `ValidationPipe` e o do JSON malformado viram
  `validation_failed`, porque para o cliente os dois são entrada inválida. Nos erros que não são
  de domínio, o `detail` é um texto fixo por código, em português, e não a mensagem da exceção
  (o Nest põe o caminho e detalhes do framework nela). Um 5xx de `HttpException` é tratado como
  erro inesperado.
- **`validation_failed` sem lista de campos:** a web valida no cliente e no Server Action com os
  textos do PRD (spec, "BFF e telas"), então nenhum cliente usa a lista agora. Ela entra quando
  algum precisar.
- **Log do erro inesperado:** `Logger` do Nest, no nível `error`, com a exceção. A biblioteca de
  log estruturado segue a definir no LLD, "Logs".
- **Prefixo `/v1`:** `configureApp(app)`, em `src/app.setup.ts`, aplica o `setGlobalPrefix('v1')`
  e é chamado pelo `main.ts` e pelo `createTestApp()`, para a aplicação de teste ser a mesma.
  Filter e pipe ficam no `AppModule`, como pede o `AGENTS.md` da API.
- **Banco de testes:** o compose passa ao `chat-api` `TEST_DATABASE_URL` (`chat` no `chat_test`)
  e `TEST_DATABASE_ADMIN_URL` (o superusuário local `postgres`). O `globalSetup` conecta como
  superusuário e cria o `chat_test` só se ele não existe, com dono `chat`, revogando o `CONNECT`
  de `PUBLIC` como no script de inicialização; depois roda `pnpm migration:run` num processo
  filho com `DATABASE_URL` apontando para o `chat_test`. Um `setupFiles` do Jest e2e troca
  `DATABASE_URL` por `TEST_DATABASE_URL` antes de importar o `AppModule`. Motivo: o papel `chat`
  não tem `CREATEDB`, e só o superusuário cria o banco num volume que já existe; a credencial é
  local, a mesma que o compose já tem. A migração em processo filho evita depender do Jest para
  carregar os arquivos `.ts` das migrações.
- **`createTestApp(options?: { controllers?: Type[] })`:** monta o `AppModule` mais os controllers
  extras, sem `overrideProvider`, aplica `configureApp` e chama `init()`. Os controllers extras
  servem a testes da própria base, como a rota que falha do CA4.
- **`uniqueEmail(prefix = 'pessoa')`:** `<prefix>-<uuid>@teste.local`, em minúsculas.
- **Validação de entrada:** `class-validator` e `class-transformer` no `ValidationPipe` do Nest,
  com `whitelist` e `transform` ligados. Motivo: é o caminho padrão do Nest, e o `@nestjs/swagger`
  lê os mesmos decorators para gerar o snapshot OpenAPI que o LLD planeja. Descartada: zod com
  `nestjs-zod`, que põe mais uma biblioteca entre o zod e o Swagger. A escolha está no LLD,
  "Estrutura do código".

## Arquivos e interfaces

- `apps/chat-api/package.json`: dependências `@nestjs/config`, `zod`, `@nestjs/typeorm`,
  `typeorm`, `pg`, `typeorm-naming-strategies`, `class-validator`, `class-transformer`; dev
  `@types/pg`. Scripts `migration:generate` (recebe `migrations/<Nome>`), `migration:run`,
  `migration:revert`; `test` ganha `--passWithNoTests`.
- `apps/chat-api/src/config/env.schema.ts`: `envSchema` (zod), `type Env`, `parseEnv(raw): Env`,
  que lança com os nomes das variáveis inválidas, e `loadEnv(): Env`, que lê `process.env`.
- `apps/chat-api/src/config/config.module.ts`: `AppConfigModule`, global, com
  `ConfigModule.forRoot({ isGlobal, ignoreEnvFile, validate: parseEnv })`.
- `apps/chat-api/src/database/database.options.ts`: `buildDataSourceOptions(databaseUrl)`.
- `apps/chat-api/src/database/database.module.ts`: `DatabaseModule`, com o
  `TypeOrmModule.forRootAsync` lendo `DATABASE_URL` do `ConfigService`.
- `apps/chat-api/src/database/data-source.ts`: `DataSource` da CLI, com `loadEnv()`.
- `apps/chat-api/src/database/base.entity.ts`: entidade base abstrata com `id`, `createdAt`,
  `updatedAt` e o `@BeforeInsert` do id.
- `apps/chat-api/migrations/.gitkeep`: pasta das migrações, vazia nesta tarefa.
- `apps/chat-api/src/common/errors/domain.error.ts`: `abstract class DomainError extends Error`,
  com `abstract readonly code: ErrorCode`.
- `apps/chat-api/src/common/errors/error-code.ts`: `type ErrorCode` e `ERROR_STATUS:
  Record<ErrorCode, number>`.
- `apps/chat-api/src/common/errors/problem-details.filter.ts`: `ProblemDetailsFilter`
  (`@Catch()`), que traduz `DomainError`, `HttpException` e o erro do leitor do corpo, e registra
  o inesperado.
- `apps/chat-api/src/app.module.ts`: importa `AppConfigModule` e `DatabaseModule`; registra
  `APP_FILTER` e `APP_PIPE`; perde o `AppController` e o `AppService`.
- `apps/chat-api/src/app.setup.ts`: `configureApp(app: INestApplication)`.
- `apps/chat-api/src/main.ts`: `configureApp` e a porta pelo `ConfigService`.
- `apps/chat-api/src/app.controller.ts`, `app.service.ts`, `app.controller.spec.ts`: removidos.
- `apps/chat-api/test/app.e2e-spec.ts`: removido.
- `apps/chat-api/test/jest-e2e.json`: `globalSetup` e `setupFiles`.
- `apps/chat-api/test/support/global-setup.ts`: cria o `chat_test` se faltar e roda as migrações.
- `apps/chat-api/test/support/test-env.ts`: `DATABASE_URL` ← `TEST_DATABASE_URL`.
- `apps/chat-api/test/support/create-test-app.ts`: `createTestApp()`.
- `apps/chat-api/test/support/unique-email.ts`: `uniqueEmail()`.
- `apps/chat-api/test/startup.e2e-spec.ts`, `test/errors.e2e-spec.ts`,
  `test/database.e2e-spec.ts`: os testes dos critérios.
- `apps/chat-api/tsconfig.build.json`: exclui `migrations`.
- `apps/chat-api/eslint.config.mjs`: `no-restricted-properties` de `process.env` em `src/**`, fora
  de `src/config/**`.
- `apps/chat-api/.env.example`: `DATABASE_URL` e `PORT` com valores falsos.
- `apps/chat-api/AGENTS.md`: comandos de migração e observação do banco de testes (CA7).
- `docker/postgres/init/01-create-databases.sh`: cria o `chat_test`, dono `chat`, com o mesmo
  `REVOKE`/`GRANT CONNECT` dos outros bancos.
- `compose.yaml`: `TEST_DATABASE_URL` e `TEST_DATABASE_ADMIN_URL` no `chat-api`.

## Testes existentes que mudam

- `src/app.controller.spec.ts` e `test/app.e2e-spec.ts` saem com a rota do esqueleto que testam.
  A suíte de unidade fica sem testes nesta tarefa, por isso o `pnpm test` ganha
  `--passWithNoTests`, como o `test:int` já tem.

## Mudança de dados

Nenhuma.

## Documentos atualizados

- `docs/lld.md`, seção "Estrutura do código": nova linha na tabela, "Validação de entrada na API
  do chat", com `class-validator` e `class-transformer` e o motivo.
- `docs/lld.md`, seção "Conceitos transversais de implementação", "Erros": o primeiro item passa a
  dizer os campos do corpo (`type` `about:blank`, `title`, `status`, `detail`, `code`, sem
  `instance`).
- `docs/lld.md`, seção "Valores e configuração", "Variáveis de ambiente": nova linha, API do chat,
  `PORT`, "Porta HTTP em que a API escuta".
- `docs/lld.md`, seção "Ambiente de desenvolvimento", item "Banco dos testes da API do chat": o
  `globalSetup` conecta como o superusuário local para criar o banco.
- `docs/roadmap.md`: a F01 passa a "em andamento".
