# AGENTS.md · API do chat

A API do chat guarda pessoas, sessões, canais, mensagens, tarefas, notificações e permissões, e
serve o REST e o WebSocket. As regras gerais do projeto estão no [`AGENTS.md` da raiz](../../AGENTS.md);
aqui ficam só as da API.

**Situação:** esqueleto do Nest CLI. A base (configuração, banco, erros, testes) é a tarefa
[F01-T01](../../.claude/docs/funcionalidades/01-login-e-sessao/tarefas/01-base-da-api-do-chat/tarefa.md).
Antes de implementar, leia a tarefa e o `plano.md` dela.

## Stack

| Papel | Escolha | Situação |
| --- | --- | --- |
| Framework | NestJS 12, ESM, sobre Express | instalado |
| Linguagem | TypeScript 6, `strict` | instalado |
| Testes | Vitest (`vitest.config.ts` e `vitest.config.e2e.ts`) e Supertest | instalado |
| Lint e formato | oxlint (`--type-aware`) e Prettier | instalado |
| Configuração | `@nestjs/config` com schema zod | planejada (T01) |
| Banco | TypeORM + `pg`, `typeorm-naming-strategies` | planejada (T01) |
| Validação de entrada | `class-validator` e `class-transformer` no `ValidationPipe` | planejada (T01) |
| Contrato REST | `@nestjs/swagger`, snapshot em `openapi.json` | planejada |
| Tempo real | Socket.IO | planejada (F03) |
| Hash de senha | Argon2id | planejada (F01) |

O plano da T01 foi escrito para Jest e ESLint, e o CLI gerou Vitest e oxlint. A escolha fica
para o início da T01; até lá, não troque as ferramentas.

## NestJS desta versão

- A versão do Nest é mais nova que o seu treino. A documentação está indexada em
  <https://docs.nestjs.com/llms.txt>, com uma página em markdown por capítulo. Leia antes de
  usar uma API que você não tem certeza de que existe.
- **ESM:** imports relativos terminam em `.js`, `__dirname` não existe (use
  `import.meta.dirname`), e os mocks são `vi.fn()`, não `jest.fn()`.
- Antes de instalar uma biblioteca ou escrever a sua, veja se o Nest tem pacote oficial
  (`@nestjs/typeorm`, `@nestjs/config`, `@nestjs/swagger`, `@nestjs/websockets`,
  `@nestjs/throttler` e outros, listados no índice da documentação).
- **Validação é com `class-validator`**, no `ValidationPipe`, e não com zod no
  `StandardSchemaValidationPipe`. O `@nestjs/swagger` lê os mesmos decorators para gerar o
  contrato (LLD, "Estrutura do código"). O zod fica só no schema das variáveis de ambiente.

## Comandos

Rode dentro do contêiner, a partir da raiz do repositório: `docker compose exec chat-api <comando>`.

| Comando | O que faz |
| --- | --- |
| `pnpm start:dev` | Sobe a API com recarga, em <http://localhost:3001> no host |
| `pnpm build` | Compila para `dist/` |
| `pnpm lint` | oxlint com checagem de tipos |
| `pnpm exec tsc --noEmit` | Confere os tipos |
| `pnpm format` | Prettier em `src/` e `test/` |
| `pnpm test` | Testes de unidade (`src/**/*.spec.ts`) |
| `pnpm test:e2e` | Testes de ponta a ponta (`test/**/*.e2e-spec.ts`) |
| `pnpm add <pacote>` | Instala uma dependência; nunca pelo host nem com `npm` |

Entram depois: `migration:generate migrations/<Nome>`, `migration:run` e `migration:revert`
(T01); `test:int` (T01); o comando de contas (F01-T03, abaixo).

## Verificação completa

Rodada uma vez antes de entregar uma tarefa que tocou a API, dentro do contêiner:

```bash
docker compose exec chat-api pnpm lint
docker compose exec chat-api pnpm exec tsc --noEmit
docker compose exec chat-api pnpm test
docker compose exec chat-api pnpm test:e2e
```

Todos terminam sem erro. Uma tarefa que cria uma suíte nova (`test:int`, por exemplo) a
acrescenta aqui.

## Estrutura de pastas

```
apps/chat-api/
  src/
    main.ts             sobe a aplicação; chama configureApp e lê a porta pelo ConfigService
    app.module.ts       módulo raiz: importa os módulos e registra filter e pipe globais
    app.setup.ts        configureApp(app): prefixo /v1; usado pelo main.ts e pelos testes
    config/             único lugar que lê process.env (schema zod)
    database/           opções do TypeORM, DataSource da CLI e entidade base
    common/errors/      DomainError, ErrorCode e o filter de problem+json
    <domínio>/          um módulo Nest por domínio (people, sessions, ...)
  migrations/           migrações do TypeORM, fora de src/
  test/                 testes e2e e a base em test/support/
```

Só `src/main.ts`, `src/app.module.ts` e as pastas de teste existem hoje; o resto chega com a T01
e com cada funcionalidade. Os módulos de domínio ainda estão a definir no LLD.

## Regras da API

**Rotas e contrato**
- Todas as rotas ficam sob `/v1`, aplicado por `configureApp`, e não no `main.ts`.
- Campos do JSON em `snake_case`, na entrada e na saída.
- A autenticação lê a Sessão do cookie de sessão que o BFF repassa, no REST e no WebSocket. A
  API não tem outro caminho de autenticação para pessoas.

**Erros**
- O service e o guard lançam um erro de domínio (subclasse de `DomainError`, com um `code` do
  tipo `ErrorCode`). Eles não lançam `HttpException` nem montam resposta.
- Só o filter global traduz erro em resposta HTTP: `application/problem+json`, com `type`
  (`about:blank`), `title`, `status`, `detail` e `code`, sem `instance`.
- Erro inesperado responde 500 com `internal_error`, sem mensagem interna nem stack trace, e vai
  para o log no nível `error`.
- Filter (`APP_FILTER`) e `ValidationPipe` (`APP_PIPE`) são registrados no `AppModule`, nunca no
  `main.ts`, para a aplicação de teste ser igual à real.
- Os códigos e o status de cada um ficam num mapa só, em `src/common/errors/`.

**Configuração**
- Só `src/config/` lê `process.env`. As outras peças recebem a configuração pelo
  `ConfigService`, já validada.
- Faltou variável obrigatória: a API não sobe, e a mensagem diz o nome dela.
- Variável nova entra no schema, no `.env.example` e no `compose.yaml`, e na tabela do LLD
  ("Valores e configuração").

**Banco**
- `synchronize` sempre desligado. O schema muda só por migração gerada e revisada.
- A aplicação não roda migrações ao subir.
- Toda entidade herda a entidade base: `id` UUID v7 gerado na aplicação, `created_at` e
  `updated_at` em `timestamptz`. Inserção fora do `save` gera o id com a mesma função.
- Nomes de tabela e coluna em `snake_case`, tabelas no plural; o código usa `camelCase` e a
  estratégia de nomes converte.
- O que precisa ser atômico (a mensagem com menções, notificações e contadores) vai numa
  transação só, e o evento do WebSocket sai depois do commit.

**Segurança e logs**
- O token de sessão nunca é gravado (o banco guarda o SHA-256) e nunca vai para o log.
- Senha só como hash Argon2id. Login com e-mail sem conta e com senha errada devolve a mesma
  resposta, com tempo parecido.
- O log não leva conteúdo de mensagens, resultado de consultas nem tokens.

## Testes

- **O seam principal são os testes e2e por HTTP, com banco real.** Eles provam o comportamento
  externo (resposta, linha no banco), e não a forma interna dos services.
- Os testes e2e rodam no banco `chat_test`, separado do `chat` do desenvolvimento. Ele é criado
  pelo script de inicialização do Postgres e, num volume que já existe, pelo `globalSetup`, que
  conecta como o superusuário local e também roda as migrações (LLD, "Ambiente de
  desenvolvimento"). O compose passa `TEST_DATABASE_URL` e `TEST_DATABASE_ADMIN_URL`.
- A aplicação de teste sobe só por `createTestApp()` e fecha com `app.close()`. Use
  `uniqueEmail()` para cada Pessoa criada, para os testes não colidirem.
- Testes de tempo (janela, bloqueio, validade) envelhecem as linhas no banco no Arrange, pelos
  atalhos da base de testes. Sem relógio falso e sem `overrideProvider`.
- Um log que é efeito da regra é provado por um espião em `Logger.prototype.error`.
- Teste de unidade só para função pura com muitos casos.

A base (`createTestApp()`, `uniqueEmail()`, `globalSetup`) chega com a T01.

## Comando de contas

Planejado na F01. Um script da própria API, rodado no contêiner, que sobe o contexto do Nest sem
HTTP e chama os mesmos services de Pessoas e Sessões. Operações: `create`, `reset-password`,
`revoke-sessions` e `purge-expired-sessions`. A senha é lida do terminal sem eco, nunca de
argumento nem de variável. O comando exato entra na tabela "Comandos" na tarefa que o implementa.

## Onde ler mais

- Regras de Sessão, login e limite de tentativas: LLD, "Estados e regras", "Sessão e login".
- Tabelas e rotas da F01: [spec da F01](../../.claude/docs/funcionalidades/01-login-e-sessao/spec.md),
  "Decisões de implementação".
- Erros, configuração, transações e logs: LLD, "Conceitos transversais de implementação".
- Por que TypeORM, Socket.IO e UUID v7: ADRs
  [0018](../../.claude/docs/adr/0018-typeorm-api-do-chat.md),
  [0019](../../.claude/docs/adr/0019-socket-io-tempo-real.md) e
  [0022](../../.claude/docs/adr/0022-uuid-v7.md).
