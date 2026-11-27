# Plano da F01-T06: Continuar logada, e Sessão que vence ou é revogada

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

**Ordem de trabalho:** a [F01-T05](../05-voltar-para-onde-ia/tarefa.md) (PR #6) também acrescenta
casos ao `e2e/sessao.spec.ts` e linhas ao `e2e/plano-de-testes.md`. A implementação da T06 começa
depois que o #6 for mesclado; o plano só mexe em documentos.

## Critérios

### CA1

**Marca:** teste HTTP

**Cenário 1 (renova):** Dado uma Sessão criada ao entrar e envelhecida pelo atalho da base de
testes, com `last_used_at` de mais de 1 dia atrás (o `intervalo de renovação da Sessão`) e
`expires_at` já perto de vencer, quando alguém chama `GET /v1/sessions/current` com o cookie dela,
então responde 200, e a linha passa a ter `last_used_at` de agora e `expires_at` de agora mais a
`duração da Sessão` (o valor de `SESSION_TTL_DAYS` da aplicação de teste).

**Cenário 2 (não renova antes):** Dado uma Sessão recém-criada, quando alguém chama a mesma rota,
então responde 200, e a linha continua igual (`last_used_at`, `expires_at` e `updated_at` não
mudam): o banco não recebeu escrita.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "renova a validade quando passou o
intervalo de renovação" e "não grava nada antes do intervalo de renovação". A leitura da linha e o
envelhecimento vêm de `test/support/session-aging.ts`, sem relógio falso.

### CA2

**Marca:** teste HTTP

**Cenário:** Dado uma Sessão envelhecida pelo atalho para `expires_at` no passado, quando alguém
chama `GET /v1/sessions/current` com o cookie dela, então responde 401 `unauthenticated`, com o
mesmo corpo do token desconhecido, e a linha da Sessão não existe mais.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "responde 401 unauthenticated e apaga a
Sessão vencida".

### CA3

**Marca:** teste de integração

**Cenário 1 (`revoke-sessions`):** Dado uma Pessoa com duas Sessões e outra Pessoa com uma, quando
o teste roda `revoke-sessions <e-mail da primeira>`, então o resultado diz que 2 Sessões foram
revogadas, a primeira Pessoa fica sem Sessões, a outra continua com a dela, e `verify` do token
revogado lança `unauthenticated`. Com um e-mail sem conta, o resultado é de falha, com a mensagem
"Não existe conta com este e-mail.".

**Cenário 2 (`reset-password`):** Dado uma Pessoa com duas Sessões e um `PasswordPrompt` que
devolve a senha nova, quando o teste roda `reset-password <e-mail>`, então o `password_hash`
verifica contra a senha nova e não contra a antiga, a Pessoa fica sem Sessões, e as Sessões de
outra Pessoa continuam. Com senha vazia, o resultado é de falha e nada muda. Com um e-mail sem
conta, o resultado é de falha, com a mesma mensagem.

**Cenário 3 (`purge-expired-sessions`):** Dado uma Sessão vencida e uma válida (a vencida
envelhecida pelo atalho), quando o teste roda `purge-expired-sessions`, então só a vencida some, e
o resultado diz quantas foram apagadas.

**Teste previsto:** integração, `src/accounts/accounts.int-spec.ts`, "revoga todas as Sessões de
uma Pessoa e só as dela", "recusa revogar para um e-mail sem conta", "troca a senha e revoga as
Sessões da Pessoa", "recusa redefinir com senha vazia ou e-mail sem conta" e "apaga só as Sessões
vencidas". O `PasswordPrompt` entra como argumento de `run`, como na T03.

### CA4

**Marca:** teste HTTP

**Cenário:** Dado a aplicação de teste, quando a Sessão é renovada (CA1), então a nova validade
usa `SESSION_TTL_DAYS` lido do `ConfigService`, e não um número escrito no teste. Quem revisa
confere no diff que o schema das variáveis mantém o padrão 30 (`env.schema.ts`, já da T03) e que o
`intervalo de renovação da Sessão` é a constante `SESSION_RENEWAL_INTERVAL_MS` (1 dia) em
`sessions.service.ts`, como a tabela de valores do LLD.

**Teste previsto:** o do CA1, cenário 1 (a conta de `expires_at` usa o valor da configuração).

### CA5

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre `test/sessions.e2e-spec.ts`,
`test/support/session-aging.ts` e `src/accounts/accounts.int-spec.ts`, então encontra os casos dos
CA1 a CA3 (envelhecer a Sessão por atalho do banco, sem relógio falso e sem `overrideProvider`, uma
requisição por Act), e o `pnpm test:int` e o `pnpm test:e2e` passam no contêiner `chat-api`.

### CA6

**Marca:** teste no Playwright

**Cenário 1 (segunda aba):** Dado uma Pessoa logada (`loggedInPage`), quando o teste abre uma
segunda página no mesmo contexto em `/`, então ela abre a Home, sem passar por Entrar.

**Cenário 2 (navegador reaberto):** Dado uma Pessoa logada, quando o teste guarda o estado do
contexto (`storageState`), abre um contexto novo com ele e acessa `/`, então abre a Home. O cookie
de sessão tem validade (`expires` no futuro), então o navegador o guarda ao fechar.

**Cenário 3 (Sessão revogada):** Dado uma Pessoa logada, quando o teste apaga as Sessões dela no
banco `chat` (como o comando `revoke-sessions`) e navega para `/`, então termina em `/entrar` e o
cookie é apagado.

**Teste previsto:** Playwright, `e2e/sessao.spec.ts`, "continua logada numa segunda aba", "continua
logada num contexto novo com os cookies guardados" e "leva a Entrar na próxima navegação depois de
a Sessão ser revogada". A revogação usa `revokeSessions(person)`, novo em `e2e/fixtures.ts`, que
é onde o acesso ao banco já mora.

## Contrato

### Comando de contas · muda

O `AccountsCommand.run(argv, prompt)` ganha três operações, além de `create`. Todas devolvem
`{ ok, message }`, e o `accounts.cli.ts` imprime e define o código de saída, como hoje.

| Operação | Uso | Sucesso | Falha |
| --- | --- | --- | --- |
| `revoke-sessions` | `revoke-sessions <e-mail>` | "N Sessões revogadas para <e-mail>." (singular com 1; "Nenhuma Sessão ativa para <e-mail>." com 0) | e-mail sem conta: "Não existe conta com este e-mail."; sem argumento: a linha de uso |
| `reset-password` | `reset-password <e-mail>`; senha nova pelo terminal | "Senha redefinida para <e-mail>. N Sessões revogadas." | e-mail sem conta: a mesma mensagem; senha vazia: "A senha não pode ser vazia."; sem argumento: a linha de uso |
| `purge-expired-sessions` | `purge-expired-sessions` | "N Sessões vencidas apagadas." | argumento a mais: a linha de uso |

A mensagem de uso lista as quatro operações. O terminal pede a senha nova com o rótulo
"Senha nova".

### `GET /v1/sessions/current` · muda o efeito, não o contrato

Mesma resposta de hoje (200 com a Pessoa, 401 `unauthenticated`). Passa a escrever na Sessão
quando renova (CA1) e a apagar a vencida (CA2). Sem campo novo no snapshot do contrato.

## Decisões

- **Onde moram as regras:** `SessionsService.verify` faz tudo: lê a Sessão pelo hash; vencida
  (`expires_at <= agora`) é apagada e lança `UnauthenticatedError`; válida é renovada quando
  `agora - last_used_at >= SESSION_RENEWAL_INTERVAL_MS` (constante de 1 dia, ao lado do
  `DAY_MS` que o arquivo já tem). O `SessionGuard` não muda.
- **Renovação sem escrita repetida:** a renovação é um `UPDATE ... WHERE id = $1 AND last_used_at
  <= agora - intervalo`, e não um `save` da entidade lida. Motivo: duas requisições simultâneas
  com a mesma Sessão velha gravam uma vez só, e o banco recebe no máximo uma escrita por Sessão a
  cada intervalo (LLD, "Sessão e login", "Verificar"). `expires_at` e `last_used_at` recebem o
  mesmo `agora`.
- **Apagar a vencida:** `DELETE ... WHERE id = $1`, na hora de apresentar. Não há rotina de
  limpeza (LLD, "Processos de segundo plano"); `purge-expired-sessions` cobre as que ninguém
  apresenta mais.
- **Novos métodos nos services:** `SessionsService.revokeAll(personId, manager?)` (devolve a
  quantidade) e `SessionsService.purgeExpired()` (devolve a quantidade); `PeopleService.setPassword(personId,
  password, manager?)`. O `manager` opcional é do TypeORM e existe só para o `reset-password`
  trocar o hash e revogar as Sessões na **mesma transação**: se uma das duas falhar, nenhuma
  vale, e a Pessoa não fica com a senha nova e as Sessões antigas vivas.
- **Onde a transação começa (decisão local, a aprovar):** o `AccountsCommand` abre a transação
  com `DataSource.transaction` e passa o `manager` aos dois services. O LLD, "Transações", deixa
  "onde a transação começa" a definir para as regras de mensagem; para o comando de contas, a
  escolha vale só aqui e entra numa linha em "Estrutura do código", sem ADR (reversível, sem
  alternativa que mude o desenho).
- **Módulos:** o `AccountsModule` passa a importar o `SessionsModule`, que já exporta o
  `SessionsService`. Sem ciclo: `SessionsModule` depende de `PeopleModule`, e `AccountsModule` de
  ambos.
- **E-mail sem conta no comando:** `revoke-sessions` e `reset-password` buscam a Pessoa por
  `PeopleService.findByEmail` (que já normaliza) e recusam com a mensagem do contrato. Quem opera
  a instalação não sofre a regra de não revelar se o e-mail tem conta: essa regra é da tela
  Entrar.
- **Atalhos de teste:** `test/support/session-aging.ts`, com `findSession(app, token)` (lê a linha
  pelo hash do token) e `ageSession(app, token, { lastUsedAt?, expiresAt? })` (muda as datas por
  `UPDATE`). Motivo: os testes de tempo envelhecem a linha no Arrange, como a spec manda, sem
  relógio falso. Entram no mesmo lugar dos atalhos `auth-routes.ts` da T03.
- **Web:** não há código novo. O layout logado já leva a `/entrar` com 401 (T03, T05), e o cookie já
  tem 400 dias (T03); a T06 só prova isso no Playwright. A única mudança fora de teste na web é o
  `revokeSessions` das fixtures.

## Arquivos e interfaces

API do chat (`apps/chat-api/`):
- `src/sessions/sessions.service.ts`: `SESSION_RENEWAL_INTERVAL_MS`, `verify` com apagar e
  renovar, `revokeAll`, `purgeExpired`.
- `src/people/people.service.ts`: `setPassword`.
- `src/accounts/accounts.command.ts`: `revoke-sessions`, `reset-password`,
  `purge-expired-sessions`, a transação e a mensagem de uso nova.
- `src/accounts/accounts.module.ts`: importa `SessionsModule`.
- `test/support/session-aging.ts` (novo).
- `test/sessions.e2e-spec.ts`: os casos do CA1 e do CA2.
- `src/accounts/accounts.int-spec.ts`: os casos do CA3.
- `AGENTS.md`: as três operações em "Comandos" e no parágrafo do comando de contas.

Web (`apps/web/`):
- `e2e/fixtures.ts`: `revokeSessions(person)`.
- `e2e/sessao.spec.ts`: os casos do CA6.
- `e2e/plano-de-testes.md`: a linha "Continuar logada" passa a `feito (T06)`.

## Testes existentes que mudam

- `test/sessions.e2e-spec.ts`: os casos que criam Sessão e chamam `/current` continuam valendo; o
  caso do token vencido, se existir como "401 com Sessão vencida", passa a conferir também que a
  linha sumiu. O comentário de `verify` que diz "renovar e apagar a vencida são da F01-T06" sai.
- `src/accounts/accounts.int-spec.ts`: o teste da mensagem de uso, se conferir o texto antigo,
  passa a conferir a nova (as quatro operações).

## Mudança de dados

Nenhuma migração: as colunas `expires_at` e `last_used_at` já existem (T03). As Sessões de teste
ficam no `chat_test` e no `chat`, como hoje.

## Documentos atualizados

- `lld.md`, seção "Interfaces": a linha de `GET /v1/sessions/current` perde "(renovar a Sessão:
  planejada)" e passa a `existe`.
- `lld.md`, seção "Estrutura do código": uma linha sobre a transação do `reset-password` (decisão
  local acima). Pela skill `lld`, no modo atualizar, na entrega.
- `apps/chat-api/AGENTS.md`: "Comandos" ganha `pnpm accounts revoke-sessions <e-mail>`, `reset-password
  <e-mail>` e `purge-expired-sessions`, com a nota de que a senha nova é lida do terminal, sem eco.
- Sem ADR: nenhuma decisão aqui muda arquitetura.
