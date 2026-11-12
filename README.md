# Clenio Chat (slack-ia-agent)

Chat de equipe web, no estilo Slack, com canais, conversas diretas, menções, tarefas e
notificações em tempo real. Agentes de IA entram como plugins: basta mencioná-los na conversa
para pedir um resumo, delegar uma tarefa a alguém ou consultar os números do negócio em
linguagem natural.

> **Status:** em fase de documentação e início de desenvolvimento. A funcionalidade F01 (login e
> sessão) está com a spec pronta; o restante está planejado no [roadmap](.claude/docs/roadmap.md).

## O que o produto promete

- **IA dentro da conversa:** mencione o agente (`@assistente`) em qualquer canal ou DM; o pedido e
  a resposta ficam públicos ali mesmo.
- **O agente executa ações:** a delegação vira uma tarefa de verdade, com responsável e
  notificação, e o relatório de dados chega como PDF para baixar.
- **Dados de negócio com permissão:** o agente só consulta dados quando quem pediu tem acesso, e
  nunca altera os dados da empresa (somente leitura garantida pelo próprio banco).
- **O agente não inventa:** todo número precisa estar no resultado de uma consulta; quando não
  consegue responder, ele diz que não conseguiu.
- **Agentes são plugins:** um administrador conecta e desconecta cada agente do workspace.

## Arquitetura

Monorepo com três aplicações implantadas separadamente. O chat não depende dos agentes: o BFF
dispara o agente, e o agente devolve o resultado à conversa como um bot, pela mesma API que as
pessoas usam.

| Contêiner | Responsabilidade | Tecnologia |
| --- | --- | --- |
| Frontend/BFF | Interface web e ponto de entrada do navegador; dispara pedidos aos agentes | Next.js (App Router, Server Actions, SWR) |
| API do chat | Pessoas, sessões, canais, mensagens, tarefas, notificações, permissões e WebSocket | NestJS, TypeORM, Socket.IO |
| Serviço de agentes | Registro dos agentes, execução de pedidos, limites de custo e consultas | Python + Google ADK (FastAPI) |
| Worker de agentes | Pedidos demorados da fila, como a geração de PDF | Python + Google ADK |
| Fila e eventos | Fila de pedidos, eventos para reconexão, contadores de limite | Redis |
| Bancos | Banco do chat, dos agentes e de negócio (mesma instância) | PostgreSQL |
| Armazenamento | PDFs gerados | Compatível com S3 |

O modelo de IA é trocável por configuração entre OpenAI, Gemini e Anthropic, sem mudar código.

### Estrutura planejada do código

```
apps/
  web/            Frontend/BFF (Next.js)
  chat-api/       API do chat (NestJS): REST, WebSocket e comando de contas e permissões
    migrations/   migrações do banco do chat
  agents/         Serviço de agentes e Worker (Python + ADK), gerenciado pelo uv
    scripts/      script de carga do banco de negócio
packages/
  chat-events/    tipos dos eventos do WebSocket, usados por chat-api e web
```

`web`, `chat-api` e `chat-events` são projetos pnpm independentes, sem workspace
([ADR 0017](.claude/docs/adr/0017-projetos-pnpm-independentes.md)).

## Ambiente de desenvolvimento

Tudo roda em contêineres pelo `compose.yaml` da raiz (projeto `clenio-slack-ia`).

| Serviço | Porta no host | Papel |
| --- | --- | --- |
| `web` | 3000 | Frontend/BFF (Node 26, pnpm 11) |
| `chat-api` | 3001 | API do chat (Node 26, pnpm 11) |
| `postgres` | 5433 | Bancos `chat`, `agents` e `business` (PostgreSQL 18) |
| `s3` | 8333 | SeaweedFS, substituto do S3, com o bucket `reports` |
| `e2e` (planejado) | — | Testes de ponta a ponta com Playwright |

Os contêineres dos apps instalam as dependências ao subir e ficam de pé; os apps são iniciados
manualmente:

```bash
docker compose up -d
docker compose exec chat-api pnpm start:dev
docker compose exec web pnpm dev
```

Depois acesse <http://localhost:3000>.

O Redis e os serviços `agents` e `worker` entram quando forem implementados. Detalhes de
variáveis de ambiente, banco de testes e diferenças entre local e produção estão no
[LLD, seção 10](.claude/docs/lld.md).

## Roadmap

- **Fase 1 — fechar o MVP:** login e sessão, mensagens em canais, tempo real, canais privados,
  conversas diretas, ações na mensagem, não lidas e menções, notificações, perfil e tema; depois,
  os agentes: conexão, resumo de conversa, delegação de tarefa, consulta a dados e relatório em PDF.
- **Fase 2 — operar como produto:** cadastro e convite de pessoas, papéis e permissões, busca de
  mensagens, threads, reações e anexos.

Status de cada funcionalidade no [roadmap](.claude/docs/roadmap.md).

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [Product Brief](.claude/docs/product-brief.md) | Visão, público-alvo, métricas, escopo do MVP e riscos |
| [HLD](.claude/docs/hld.md) | Arquitetura de alto nível: contêineres, fluxos, qualidade e implantação |
| [LLD](.claude/docs/lld.md) | Design de baixo nível: código, dados, interfaces, regras e ambiente |
| [Design System](.claude/docs/design-system.md) | Tokens, componentes e fluxo com o Figma |
| [ADRs](.claude/docs/adr/) | Registro das decisões de arquitetura |
| [Funcionalidades](.claude/docs/funcionalidades/) | PRD, spec e tarefas de cada funcionalidade |

### Skills do Claude Code

O repositório traz skills em `.claude/skills/` para manter a documentação:

- `product-brief` — conduz a entrevista e grava o product brief.
- `hld` — cria, revisa e atualiza o HLD.
- `lld` — cria, revisa e atualiza o LLD.
