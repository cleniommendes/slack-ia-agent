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

## Documentos

A documentação fica em `.claude/docs/`. Quando um documento cita `docs/...`, leia
`.claude/docs/...`.

| Preciso saber | Onde |
| --- | --- |
| Visão, público, escopo do MVP, métricas | [`product-brief.md`](.claude/docs/product-brief.md) |
| Arquitetura, contêineres, integrações e o porquê | [`hld.md`](.claude/docs/hld.md) |
| Código, dados, regras, valores, variáveis e ambiente | [`lld.md`](.claude/docs/lld.md) |
| Decisões com o porquê | [`adr/`](.claude/docs/adr/), com o índice no HLD e no LLD |
| Lista, ordem e status das funcionalidades | [`roadmap.md`](.claude/docs/roadmap.md) |
| O que construir em cada funcionalidade | [`funcionalidades/`](.claude/docs/funcionalidades/) |
| Tokens, componentes e fluxo com o Figma | [`design-system.md`](.claude/docs/design-system.md) |
| Vocabulário do domínio | `GLOSSARY.md` na raiz (planejado) |
| Padrões de código por tipo de arquivo | [`.claude/rules/`](.claude/rules/), carregadas pelo caminho do arquivo |

**Onde cada informação mora**

- **O que o sistema faz** fica nos documentos: escopo, arquitetura, schema, contrato, regras de
  negócio e configuração.
- **Como trabalhar no código** fica nos arquivos de memória: os `AGENTS.md` e as rules
  (comandos, práticas, padrões de código).
- **Nunca nos dois.** Uma informação tem um dono só, e o outro arquivo aponta para ele pelo nome
  do documento e da seção, sem repetir o conteúdo. O LLD, no topo, tem a tabela "Onde mora cada
  fato".
- **HLD e LLD mudam pela skill deles.** Quando uma tarefa muda algo que o `hld.md` ou o `lld.md`
  registra, carregue a skill `hld` ou `lld` e use o modo atualizar antes de editar o arquivo.
- Uma decisão nova com porquê vira ADR em `.claude/docs/adr/`, com o índice atualizado.

## Execução no Docker

Tudo roda dentro dos contêineres do [`compose.yaml`](compose.yaml) (projeto `clenio-slack-ia`):
instalação de dependências, servidor de desenvolvimento, testes, lint, compilação do TypeScript e
qualquer outro comando do projeto. **Nunca rode `pnpm`, `node`, `npx`, `uv` ou `python` direto na
máquina.** Os detalhes do ambiente estão no LLD, "Ambiente de desenvolvimento".

| Serviço | O que é | Endereço na máquina | Endereço entre contêineres |
| --- | --- | --- | --- |
| `web` | Frontend/BFF em Next.js (Node 26, pnpm 11) | `http://localhost:3000` | `http://web:3000` |
| `chat-api` | API do chat em NestJS (Node 26, pnpm 11) | `http://localhost:3001` | `http://chat-api:3000` |
| `postgres` | PostgreSQL 18, com os bancos `chat`, `chat_test`, `agents` e `business` | `localhost:5433` | `postgres:5432` |
| `s3` | Emulador do S3 (SeaweedFS), com o bucket `reports` | `http://localhost:8333` | `http://s3:8333` |

Entram depois: `agents`, `redis` e o `e2e` (Playwright, pelo `profile`).

Os contêineres `web` e `chat-api` instalam as dependências ao subir e depois ficam parados, sem
iniciar a aplicação. Os comandos rodam neles com `docker compose exec <serviço> <comando>`, e os
de cada projeto estão no `AGENTS.md` dele.

### Subir e derrubar

```bash
docker compose up -d --build --wait
docker compose exec chat-api pnpm start:dev
docker compose exec web pnpm dev
```

- O `--wait` segura o primeiro comando até os serviços ficarem de pé; o `postgres` só conta
  quando o healthcheck passa.
- A instalação das dependências continua dentro de `web` e `chat-api` depois disso e, na primeira
  subida, leva alguns minutos. Acompanhe com `docker compose logs -f <serviço>` antes de iniciar
  as aplicações.
- `start:dev` e `dev` ficam presos ao terminal: rode cada um num terminal próprio ou em segundo
  plano.
- As migrações não rodam na subida.

**Derrubar**

```bash
docker compose down
```

**Procedimentos raros**

**Recomeçar do zero.** Para apagar os dados e recriar os bancos:

```bash
docker compose down -v
```

O `-v` apaga os volumes do banco e do armazenamento. Na próxima subida, o script
`docker/postgres/init/01-create-databases.sh` recria os bancos e os papéis, sem tabelas. Ele só
roda com o volume vazio: mudou o script, recomece do zero. Depois, suba o ambiente como em "Subir
e derrubar".

**A instalação falhou.** O contêiner `web` ou `chat-api` fica de pé mesmo quando o `pnpm install`
falha, então o erro só aparece no log:

```bash
docker compose logs chat-api
```

Depois do conserto, rode a instalação de novo no contêiner:
`docker compose exec chat-api pnpm install`.

### Rede entre serviços

Na conexão entre serviços, seja em variável de ambiente, arquivo de configuração ou código, **o
host é sempre o nome do serviço do Compose**, como na coluna "Endereço entre contêineres", e nunca
`localhost` nem `127.0.0.1`: dentro de um contêiner, `localhost` é o próprio contêiner.

**Exceção:** quando o processo fala com algo que roda no mesmo contêiner, o endereço é
`127.0.0.1`. É o caso do healthcheck de um serviço e de um teste que abre um servidor temporário
no contêiner onde roda.

O navegador é o outro lado: ele usa os endereços da máquina (`localhost:3001` para o WebSocket da
API, por exemplo). Quando um valor é usado pelo navegador e pelo servidor, são duas variáveis
(LLD, "Ambiente de desenvolvimento").

## Regras do projeto

- **pnpm sem workspace:** `web`, `chat-api` e `chat-events` são projetos independentes, cada um
  com o seu lockfile ([ADR 0017](.claude/docs/adr/0017-projetos-pnpm-independentes.md)). Instale
  dentro do contêiner do projeto. `chat-events` entra como dependência `file:`; mudou o pacote,
  reinstale em `web` e em `chat-api`.
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

## Design e Figma

O Figma é a ferramenta de design do projeto, acessada pelo servidor MCP do plugin `figma`.

**Arquivo do Figma:** <https://www.figma.com/design/plW17JDOoRHydUJIIi2u87/slack>

**Sempre que a tarefa envolver design ou interface, leia antes o
[`design-system.md`](.claude/docs/design-system.md)**, seja para desenhar no Figma, seja para
implementar uma tela ou um componente. Ele define os tokens, os componentes e o fluxo de trabalho
com o Figma (passos do Figma para o código, assets e validação visual), e as regras dele são
obrigatórias.

## Planejamento

O planejamento e a documentação das funcionalidades ficam em arquivos markdown locais, que são o
issue tracker do projeto. A hierarquia é funcionalidade → tarefa.

- **Funcionalidade:** uma entrega demonstrável no produto, descrita só pelo que a pessoa consegue
  fazer, sem detalhes técnicos. Não é a Fase do product brief (MVP, operar como produto). O número
  é global, sequencial e não muda depois de atribuído (`F01`, `F02`). Nos documentos de
  planejamento, "funcionalidade" é sempre este termo; para o sentido comum da palavra, use outra
  (recurso, comportamento).
- **PRD:** os requisitos de produto de uma funcionalidade (problema, fluxos, histórias, critérios
  de aceite, fora de escopo). Aponta para o product brief em vez de repetir métricas e requisitos
  não funcionais.
- **Spec:** como a funcionalidade será construída (decisões de implementação e de teste). Segue o
  HLD, o LLD e as ADRs, apontando para eles.
- **Tarefa:** uma parte entregável de uma funcionalidade, a partir da spec. É nela que entra o
  trabalho técnico. Fora da pasta da funcionalidade, a tarefa é identificada como `F<NN>-T<NN>`,
  como `F01-T02`.
- **Plano:** antes do código, cada tarefa ganha um `plano.md` (cenário e teste de cada critério,
  contrato, decisões e arquivos). Ele é aprovado pelo usuário e commitado sozinho, no **commit de
  plano**. Depois disso o plano fica congelado, como registro do que foi aprovado: só o usuário o
  descongela, e uma decisão dele que se mostrar errada é corrigida na spec, no LLD ou numa tarefa
  nova.

**Estrutura de pastas**

```
.claude/docs/funcionalidades/<NN>-<titulo>/
  prd.md
  spec.md
  tarefas/
    <NN>-<titulo>/      ← uma pasta por tarefa
      tarefa.md         ← a tarefa: o que construir, critérios (CA1, CA2, ...) e bloqueios
      plano.md          ← o plano da tarefa
      …                 ← registros da tarefa, se necessário
```

- Os números têm dois dígitos, e os títulos ficam em kebab-case sem acento
  (`01-login-e-sessao`).
- As tarefas são numeradas a partir de `01` dentro de cada funcionalidade, na ordem de
  dependência. Respeite "Bloqueada por": não comece uma tarefa antes das que a bloqueiam.
- A pasta da tarefa só recebe, além da tarefa e do plano, registros da própria tarefa: o roteiro
  de um teste manual, o resultado de uma medição, as capturas de uma validação visual. Eles ficam
  em Markdown ou imagem, com nome em kebab-case (`roteiro-manual.md`). Código, fixtures de teste e
  configuração nunca vão para essa pasta: ficam no projeto a que pertencem.

**Status**

- O status de cada funcionalidade (`planejada` → `PRD pronto` → `spec pronta` → `em andamento` →
  `concluída`) mora no roadmap, que também é dono da lista de funcionalidades.
- O status da tarefa (`a fazer` → `em andamento` → `concluída`) fica no campo Status no topo do
  `tarefa.md`. Ela passa a `em andamento` no commit de plano, e a `concluída` na entrega, com
  todos os critérios marcados.
- Uma funcionalidade passa a `em andamento` no primeiro commit de plano de uma tarefa dela, e a
  `concluída` na entrega da última tarefa.
- Marque um critério (`[x]`) só quando ele estiver provado: teste passando, revisão ou
  documento, conforme a marca do critério no plano.

**Verificação completa**

É a sequência de comandos que fecha uma tarefa, rodada uma vez antes da entrega, para cada
projeto que a tarefa tocou. Os comandos de cada projeto estão na seção "Verificação completa" do
`AGENTS.md` dele. Uma tarefa que cria um comando que a verificação deve rodar (uma suíte de
testes nova, por exemplo) o acrescenta a essa seção.

## Uso de skills

- Sempre carregue as skills necessárias para a tarefa: as do projeto (`hld`, `lld`,
  `product-brief`, `domain-modeling`, `grill-me` e outras em `.claude/skills/`) e as de processo
  e boas práticas, como as do superpowers.
- Quando uma skill diverge do `AGENTS.md` ou das rules, o `AGENTS.md` e as rules prevalecem.

## Git

- Mensagens de commit em português, no formato Conventional Commits, com o escopo do app quando
  houver: `feat(chat-api): ...`, `fix(web): ...`, `docs: ...`, `chore: ...`.
- Faça commit e push só quando pedirem.
