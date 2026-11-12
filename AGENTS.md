# AGENTS.md

Instruções para agentes de código neste repositório. Valem para todo o projeto; cada app tem o
seu `AGENTS.md` com as práticas e os comandos dele.

## O projeto

Clenio Chat: chat de equipe web, no estilo Slack, com agentes de IA como plugins. Monorepo com três
aplicações implantadas separadamente:

| Pasta | O que é | Tecnologia | Situação |
| --- | --- | --- | --- |
| `apps/web/` | Frontend/BFF | Next.js (App Router, Server Actions, SWR) | esqueleto do CLI |
| `apps/chat-api/` | API do chat: REST, WebSocket, contas e permissões | NestJS, TypeORM, Socket.IO | esqueleto do CLI |
| `apps/agents/` | Serviço de agentes e Worker | Python + Google ADK (FastAPI), uv | planejada |
| `packages/chat-events/` | Tipos dos eventos do WebSocket, usados por `web` e `chat-api` | TypeScript | planejada |

Antes de mexer em um app, leia o `AGENTS.md` dele: [`apps/web/AGENTS.md`](apps/web/AGENTS.md) e
[`apps/chat-api/AGENTS.md`](apps/chat-api/AGENTS.md). As versões de Next.js e NestJS são mais
novas do que o seu treino, e esses arquivos dizem onde ler a documentação certa.

## Onde está cada coisa

A documentação fica em `.claude/docs/`. Quando um documento cita `docs/...`, leia
`.claude/docs/...`.

| Preciso saber | Onde |
| --- | --- |
| Visão, público, escopo do MVP | [`product-brief.md`](.claude/docs/product-brief.md) |
| Arquitetura, contêineres, integrações e o porquê | [`hld.md`](.claude/docs/hld.md) |
| Código, dados, regras, valores, variáveis e ambiente | [`lld.md`](.claude/docs/lld.md) |
| Decisões com o porquê | [`adr/`](.claude/docs/adr/), com o índice no HLD e no LLD |
| Ordem e status das funcionalidades | [`roadmap.md`](.claude/docs/roadmap.md) |
| O que construir em cada funcionalidade | [`funcionalidades/`](.claude/docs/funcionalidades/) |
| Tokens, componentes e fluxo com o Figma | [`design-system.md`](.claude/docs/design-system.md) |
| Vocabulário do domínio | `GLOSSARY.md` na raiz (planejado) |

O LLD, no topo, tem a tabela "Onde mora cada fato". Siga-a: um fato tem um dono, e os outros
documentos apontam para ele em vez de repeti-lo.

## Ambiente de desenvolvimento

Tudo roda em contêineres pelo [`compose.yaml`](compose.yaml) (projeto `clenio-slack-ia`). Os
detalhes estão no LLD, seção 10.

| Serviço | Porta no host | Papel |
| --- | --- | --- |
| `web` | 3000 | Frontend/BFF (Node 26, pnpm 11) |
| `chat-api` | 3001 (3000 no contêiner) | API do chat (Node 26, pnpm 11) |
| `postgres` | 5433 (5432 no contêiner) | Bancos `chat`, `chat_test`, `agents` e `business` (PostgreSQL 18) |
| `s3` | 8333 | SeaweedFS, substituto do S3, com o bucket `reports` |

### Subir e derrubar

```bash
docker compose up -d                        # sobe tudo; web e chat-api instalam as dependências e ficam de pé
docker compose exec chat-api pnpm start:dev # inicia a API em http://localhost:3001
docker compose exec web pnpm dev            # inicia a web em http://localhost:3000
docker compose logs -f chat-api             # erros do pnpm install aparecem aqui
docker compose down                         # derruba, mantendo os dados
docker compose down -v                      # derruba e apaga os volumes (bancos e S3)
```

- Os apps não sobem sozinhos: o contêiner só instala as dependências e fica de pé.
- Rode comandos dos apps (`pnpm test`, `pnpm lint`, migrações) dentro do contêiner, com
  `docker compose exec <serviço> ...`.
- O script `docker/postgres/init/01-create-databases.sh` só roda com o volume vazio. Mudou o
  script: `docker compose down -v` e suba de novo.
- O `node_modules` fica no disco do host. Para rodar ferramentas pelo host, use Node 26, o mesmo
  major do contêiner.

**Problema conhecido:** nesta máquina, `next dev` com Turbopack sobe dentro do contêiner, mas fecha
a conexão em toda requisição. Com `next dev --webpack` funciona. A causa ainda está em
investigação; não troque o script `dev` sem combinar.

## Regras do projeto

- **pnpm sem workspace:** `web`, `chat-api` e `chat-events` são projetos independentes, cada um
  com o seu lockfile ([ADR 0017](.claude/docs/adr/0017-projetos-pnpm-independentes.md)). Instale
  dentro da pasta do projeto. `chat-events` entra como dependência `file:`; mudou o pacote,
  reinstale em `web` e em `chat-api`.
- **Migrações não rodam ao subir a aplicação.** Elas são comandos do `chat-api`, rodados à mão.
- **Configuração:** cada projeto lê e valida as variáveis de ambiente uma vez, na subida, num
  módulo só. Nenhum outro arquivo lê `process.env` ou `os.environ`. Faltou variável obrigatória: o
  processo falha na subida com o nome dela. Cada projeto tem um `.env.example` com valores falsos.
- **Erros:** as três APIs respondem `application/problem+json` (RFC 9457) com a extensão `code`,
  em `snake_case`. O `detail` não traz detalhes internos (LLD, "Erros").
- **Logs:** estruturados, sem conteúdo de mensagens, sem resultado de consultas e sem tokens de
  sessão.
- **Ids:** UUID v7, gerado na aplicação ([ADR 0022](.claude/docs/adr/0022-uuid-v7.md)).
- **Banco de negócio:** o agente só lê, garantido pelo usuário `business_readonly`
  ([ADR 0013](.claude/docs/adr/0013-somente-leitura-banco-e-codigo.md)).
- **Segredos:** nada de credencial real no repositório. As senhas do compose são só locais.

## Planejamento

O trabalho é organizado em funcionalidades, cada uma com um ID (`F01`, `F02`, ...) e uma linha no
[roadmap](.claude/docs/roadmap.md).

```
.claude/docs/funcionalidades/
  01-login-e-sessao/
    prd.md          o que a pessoa consegue fazer e os critérios de aceite
    spec.md         como será construída
    tarefas/
      01-base-da-api-do-chat/
        tarefa.md   o que construir, critérios (CA1, CA2, ...) e bloqueios
        plano.md    cenário e teste de cada critério, contrato, decisões e arquivos
```

**Status da funcionalidade** (coluna do roadmap): `planejada` → `PRD pronto` → `spec pronta` →
`em andamento` → `concluída`.

- `PRD pronto` quando o `prd.md` está com `Status: aprovado`.
- `spec pronta` quando o `spec.md` está com `Status: pronta`.
- `em andamento` quando a primeira tarefa começa.
- `concluída` quando todas as tarefas estão concluídas.

**Status da tarefa:** `a fazer` → `concluída`.

- Antes de implementar, escreva o `plano.md` da tarefa.
- Marque cada critério (`[x]`) só quando ele estiver provado: teste passando, revisão ou
  documento, conforme a marca do critério no plano.
- Uma tarefa só fica `concluída` com todos os critérios marcados.
- Respeite "Bloqueada por": não comece uma tarefa antes das que a bloqueiam.

## Documentação viva

- Uma mudança que altera o que o HLD ou o LLD registram atualiza o documento no mesmo trabalho.
  Use as skills `hld` e `lld`.
- Uma decisão nova com porquê vira ADR em `.claude/docs/adr/`, com o índice atualizado.
- O plano de cada tarefa lista os documentos que ela atualiza, na seção "Documentos atualizados".

## Git

- Mensagens de commit em português, no formato Conventional Commits, com o escopo do app quando
  houver: `feat(chat-api): ...`, `fix(web): ...`, `docs: ...`, `chore: ...`.
- Faça commit e push só quando pedirem.
