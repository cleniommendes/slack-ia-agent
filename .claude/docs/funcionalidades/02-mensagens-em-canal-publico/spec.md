# Spec · F02 · Mensagens em canal público

2026-11-23 · Clenio · Status: pronta · PRD: [prd.md](prd.md)

Como a F02 será construída. O que a Pessoa consegue fazer, os critérios de aceite e o que não é
objetivo estão no PRD. As regras de participação e de mensagem, os valores e as convenções
transversais estão no [LLD](../../lld.md), e esta spec aponta para eles em vez de repeti-los. O
vocabulário é o do `GLOSSARY.md`.

## Problema

Depois de entrar, a Pessoa cai numa Home vazia e não tem com quem conversar. Sem mensagem não há
Conversa, e sem Conversa não há onde mencionar um Agente (PRD, seção 1, "Resumo executivo").

## Solução

A Pessoa vê os Canais públicos na barra lateral, cai no último Canal que visitou (ou no `#geral`),
envia mensagens de texto e rola o histórico até a primeira mensagem do Canal. As mensagens dos
outros aparecem quando ela abre ou reabre o Canal; a chegada sem recarregar é da F03. Quem opera a
instalação cria Canais públicos pelo comando de contas. O fluxo completo está no PRD, seção 2,
"Fluxo".

## Histórias de usuário

As histórias 1 a 6 do PRD (seção 2, "Histórias de usuário") valem como estão, com os critérios de
aceite de lá. Esta spec acrescenta as de quem opera a instalação e as de quem desenvolve:

7. Como operação, quero criar um Canal público com um nome, para que as Pessoas tenham onde
   conversar além do `#geral`.
8. Como operação, quero que toda instalação já tenha o `#geral`, para que o primeiro acesso nunca
   caia numa tela vazia.
9. Como quem desenvolve as próximas funcionalidades, quero que mensagens e Conversas já tenham a
   forma que serve a Canal privado e Conversa direta, para que a F04 e a F05 não precisem migrar
   dados.

## Decisões de implementação

### Base

A F02 parte da base que a F01 monta (spec da F01, "Base que a F01 monta"): configuração validada,
TypeORM com migrações, UUID v7, erros em `application/problem+json`, guard de autenticação, tokens
do design system, o shell logado e as bases de teste da API e da web. As tarefas da F02 são
bloqueadas pelas da F01.

### Conversas (API do chat)

Tabela `conversations`, `planejada`. Uma tabela só para as três formas de Conversa, porque toda
mensagem pertence a exatamente uma Conversa e a Última leitura, os contadores e a Citação apontam
para ela sem saber a forma:

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | uuid | UUID v7, gerado na aplicação |
| `kind` | texto | `public_channel` na F02. `private_channel` (F04) e `direct` (F05) entram depois, com o mesmo campo |
| `name` | texto, nulo | Nome do Canal, sem o `#`. Único entre os Canais. Nulo na Conversa direta |
| `created_at`, `updated_at` | timestamptz | Convenção do LLD, seção "Dados" |

- O nome do Canal tem de 1 a 80 caracteres, só letras minúsculas sem acento, dígitos e hífen, e
  começa por letra ou dígito. A regra é da F02 para o comando; a F04 a reaproveita na criação pelo
  produto.
- A participação segue o LLD, "Estados e regras", subseção "Participação e mensagem": no Canal
  público, toda Pessoa participa, sem registro de entrada. Por isso a F02 não cria a tabela de
  Membros, que entra com o Canal privado (F04).
- Uma migração de dados cria o `#geral`. Ele é identificado pelo nome `geral`, e o comando de
  contas não deixa criar outro com o mesmo nome.
- Descrição de Canal fica fora (PRD, história 6): o início do Canal mostra só o nome.

### Mensagens (API do chat)

Tabela `messages`, `planejada`:

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | uuid | UUID v7, gerado pela API ao gravar. É a ordem de chegada ao chat e o cursor do histórico |
| `conversation_id` | uuid | Referência a `conversations` |
| `author_person_id` | uuid | Referência a `people`. A autoria por Agente entra com a F10 |
| `client_id` | uuid | Gerado no navegador antes do envio. Único com `author_person_id` |
| `body` | texto | De 1 a 4000 caracteres, já sem os espaços e as quebras das pontas |
| `created_at`, `updated_at` | timestamptz | Convenção do LLD |

- Índice em (`conversation_id`, `id`) para o histórico.
- A unicidade em (`author_person_id`, `client_id`) e o comportamento do envio repetido estão no
  LLD, "Conceitos transversais de implementação", seção "Concorrência e idempotência". A F02 não
  tem menções, notificações nem contadores; o envio repetido só devolve a mensagem já gravada.
- O limite de 4000 caracteres é o do MessageComposer no design system. Ele é conferido depois de
  tirar as pontas, no BFF e na API.
- Edição, exclusão, Citação, Menção e a marca "dados de negócio" entram com as funcionalidades
  que as usam (F06, F13), em colunas novas.

### Último Canal visitado (API do chat)

Coluna `last_conversation_id` em `people`, `planejada`: uuid, nulo, referência a `conversations`,
que vira nulo se a Conversa deixar de existir. Fica no servidor para valer em qualquer navegador
(PRD, história 2).

### Rotas da API do chat

Todas `planejadas`, com Sessão, e com o corpo de erro da rule de erros da API. `unauthenticated`
(401) vale para todas e não se repete na tabela.

| Rota | Entrada | Sucesso | Erros |
| --- | --- | --- | --- |
| `GET /v1/channels` | — | 200 com `items` (`id`, `name`), os Canais públicos em ordem alfabética do nome | — |
| `GET /v1/conversations/{id}` | — | 200 com `id`, `kind`, `name` | `conversation_not_found` (404) |
| `GET /v1/conversations/{id}/messages` | `before` (id de mensagem, opcional) | 200 com `items` e `has_more` | `validation_failed` (400), `conversation_not_found` (404) |
| `POST /v1/conversations/{id}/messages` | `client_id`, `body` | 201 com a mensagem, também no envio repetido | `validation_failed` (400), `conversation_not_found` (404) |
| `PUT /v1/people/me/last-conversation` | `conversation_id` | 204 | `validation_failed` (400), `conversation_not_found` (404) |

- **Mensagem na resposta:** `id`, `conversation_id`, `client_id`, `body`, `created_at` e `author`
  (`id`, `name`). O nome do autor vem junto para o histórico não precisar de outra chamada.
- **Histórico:** paginação por cursor, a mais recente primeiro. Sem `before`, a página traz as
  mensagens mais recentes; com `before`, as anteriores a ela. O tamanho é o `tamanho da página do
  histórico`, 50 (LLD, "Valores e configuração"). `has_more` é falso quando a página chega à
  primeira mensagem. Um `before` que não é mensagem daquela Conversa recebe `validation_failed`.
- **`conversation_not_found`** cobre o id que não existe e, a partir da F04, a Conversa de que a
  Pessoa não participa, sem distinguir os casos.
- **Sessão:** `GET /v1/sessions/current` passa a devolver `last_conversation_id` na `person`.
- O snapshot OpenAPI recebe as rotas novas, e o catálogo ganha `conversation_not_found`.

### Comando de contas (API do chat)

Nova operação no comando da F01 (spec da F01, "Comando de contas"):

| Operação | Recebe | Efeito |
| --- | --- | --- |
| `create-channel` | Nome | Cria o Canal público. Nome inválido ou já existente é recusado com mensagem |

Ela chama o mesmo service das rotas e entra no `AGENTS.md` da API, seção "Comandos", na tarefa que
a implementa.

### BFF e telas (web)

- **Endereços:** `/conversas/<id>` é a tela de uma Conversa, e o mesmo formato serve à Conversa
  direta (F05). O id não muda, o que mantém o link válido.
- **Home (`/`):** redireciona, no servidor, para o `last_conversation_id` da Sessão e, sem ele,
  para o `#geral`. Se nenhum dos dois existe, mostra o estado "Home / Vazio" da F01. O `?para=` da
  F01 continua valendo antes disso (PRD, história 2).
- **Visita:** ao abrir uma Conversa, a tela chama um Server Action que grava a visita por
  `PUT /v1/people/me/last-conversation`. Uma falha nessa gravação não aparece para a Pessoa e não
  impede a leitura.
- **Sidebar:** ganha a seção "Canais" (SidebarSection), com um SidebarRow por Canal público, em
  ordem alfabética, com ChannelIcon e o Canal aberto em `sidebar-active`. A lista é lida no layout
  logado, no servidor. Os links trocam de Conversa pela navegação do Next, sem recarregar a página.
- **Leitura do histórico no navegador:** rota do BFF `GET /api/conversas/<id>/mensagens?antes=`,
  que repassa a Sessão à API do chat como as outras chamadas (LLD, seção "Interfaces"). O cliente
  usa SWR com paginação: a primeira página chega renderizada no servidor e vira o dado inicial, e
  as anteriores são pedidas ao rolar até o topo. A revalidação ao focar a janela e ao reconectar
  fica desligada; as mensagens novas dos outros aparecem ao abrir de novo a Conversa ou ao
  recarregar (PRD, história 4). A chegada em tempo real é da F03.
- **Envio:** Server Action que recebe o id da Conversa, o `client_id` e o texto e chama
  `POST /v1/conversations/{id}/messages`. O navegador gera o `client_id` (UUID) ao enviar e o
  reaproveita em "Tentar de novo", o que garante a mensagem única do PRD, história 5.
- **Mensagens locais:** a mensagem enviada entra na lista na hora, como MessageItem `sending`, e
  troca pela resposta da API. Na falha, fica `failed` com "Não enviada", "Tentar de novo" e
  "Descartar". Essas mensagens vivem só no estado da tela: trocar de Conversa ou recarregar as
  descarta (PRD, história 5).
- **MessageComposer:** Enter envia e Shift+Enter quebra a linha (design system). O contador aparece
  quando o texto passa de 4000 caracteres, e o envio fica desabilitado. O texto vazio depois de
  tirar as pontas não envia. Depois do envio, o campo fica vazio e com o foco.
- **Texto da mensagem:** renderizado como texto, nunca como HTML, com as quebras de linha. Endereços
  que começam com `http://`, `https://` ou `www.` viram link com `target="_blank"` e
  `rel="noopener noreferrer"`.
- **Lista de mensagens:**
  - a mais nova embaixo, com a rolagem no fim ao abrir;
  - DayDivider por dia no fuso do navegador, com "Hoje", "Ontem" ou a data;
  - MessageItem `full` na primeira mensagem de um grupo e `compact` nas seguintes do mesmo autor,
    com até 5 minutos de diferença da anterior e no mesmo dia;
  - ao carregar as anteriores, a posição de leitura é mantida;
  - na primeira mensagem do Canal (`has_more` falso), a ConversationIntro com o nome do Canal; no
    Canal vazio, só ela, com o convite para a primeira mensagem;
  - MessageSkeleton enquanto carrega; na falha, um erro com "Tentar de novo", sem tirar o que já
    está na tela.
- **Canal não encontrado:** `/conversas/<id>` com um id que não existe ou que a API recusa mostra
  "Canal não encontrado" com um botão para o `#geral`, dentro do shell.
- **Acessibilidade:** cada mensagem é um `article` com nome acessível formado pelo autor e pelo
  horário; a lista é navegável por Tab, e o leitor de tela anuncia autor, horário e texto (PRD,
  história 6).
- **Figma:** as telas seguem a seção "Conversa" da página Telas, nos estados carregando, vazio,
  com histórico, enviando, falha no envio e erro de carregamento, e a seção "Rotas especiais" para
  "Canal não encontrado". Os ids dos frames são levantados na tarefa de cada tela. Estado que
  faltar no Figma é criado lá antes do código, como na F01 (`docs/design-system.md`, "Do código
  para o Figma").

### Tempo real

A F02 não sobe o WebSocket. A mensagem gravada não emite evento; a F03 acrescenta a emissão
depois do commit e a chegada das mensagens na tela, reaproveitando a lista e as mensagens locais
desta spec.

## Decisões de teste

**O que faz um bom teste aqui:** o teste prova o comportamento externo (a resposta HTTP, a linha no
banco, o que aparece na tela) e não a forma interna dos services nem dos componentes. A forma de
cada teste da API está em `.claude/rules/nest-api-testing.md`. A F02 usa os dois seams que a F01
cria e nenhum novo.

**API do chat, testes de ponta a ponta por HTTP com banco real.** São o seam principal: as regras
de Conversa e de mensagem moram na API.

- Canais: a lista vem em ordem alfabética e só com Canais públicos; o `#geral` existe depois das
  migrações; sem Sessão, 401.
- Conversa: o id que existe responde 200; o que não existe, 404 com `conversation_not_found`.
- Envio: responde 201 com o autor da Sessão e o texto sem as pontas; texto vazio ou só com espaços
  e quebras responde 400; 4000 caracteres passam, e 4001 recebem 400; Conversa inexistente, 404.
- Envio repetido: o mesmo `client_id` da mesma Pessoa devolve a mesma mensagem, com 201, e o banco
  continua com uma linha só; o mesmo `client_id` de outra Pessoa cria outra mensagem.
- Histórico: sem `before`, as 50 mais recentes, da mais nova para a mais antiga, com `has_more`
  verdadeiro quando há mais; com `before`, as anteriores; a última página traz `has_more` falso;
  um `before` de outra Conversa recebe 400.
- Último Canal visitado: o `PUT` grava, e `GET /v1/sessions/current` o devolve; um id que não
  existe recebe 404.

**Comando de contas:** teste de integração de `create-channel` contra o banco de testes, com nome
válido, nome inválido e nome repetido.

**Base de testes da API, acrescentada na F02:**
- o atalho de criar Canal direto pelo service, com nome único;
- o atalho de criar mensagens em lote numa Conversa, com autor e `created_at` dados, para o
  histórico e os separadores de dia.

**Web, testes de ponta a ponta com o Playwright,** no mesmo formato da F01: só Chromium, headless,
contra o ambiente de desenvolvimento de pé, escritos pelo fluxo da skill `playwright-cli`, com o
plano de testes junto dos testes. Cobrem:
- a seção "Canais" em ordem alfabética, com o Canal aberto destacado, e a troca de Canal só pelo
  teclado;
- o primeiro acesso cai no `#geral`; depois de visitar outro Canal, um contexto novo do navegador
  cai nele; o `?para=` ganha do último Canal;
- o link de um Canal abre ele, o voltar do navegador leva ao anterior, e um id que não existe
  mostra "Canal não encontrado", cujo botão leva ao `#geral`;
- o envio com Enter, a quebra com Shift+Enter, o texto vazio que não envia, o contador e o envio
  desabilitado acima de 4000 caracteres, o link com `target="_blank"` e o campo vazio e com foco
  depois do envio;
- a falha no envio, provocada pela interceptação da requisição do Server Action: a mensagem fica
  "Não enviada"; "Tentar de novo", com a requisição liberada, a envia uma vez só; "Descartar" a
  tira da tela;
- a mensagem de outra Pessoa, gravada no Arrange, aparece depois de recarregar;
- o histórico: abre no fim; rolar até o topo carrega as anteriores até a ConversationIntro; o
  Canal vazio mostra só ela; os separadores "Hoje", "Ontem" e data, com mensagens envelhecidas no
  Arrange; o agrupamento de mensagens com até 5 minutos e a quebra com mais;
- o erro no carregamento do histórico, provocado pela interceptação da rota do BFF, com "Tentar de
  novo";
- a checagem de acessibilidade com `@axe-core/playwright` na tela da Conversa, com histórico e
  vazia, sem violações.

**Base dos testes da web, acrescentada na F02:**
- a fixture `channel` cria um Canal público direto no banco, com nome único, e devolve o id e o
  nome;
- a fixture `messages` grava mensagens direto no banco, com autor, texto e `created_at` dados.

**Verificações do agente com o Claude in Chrome**, registradas na pasta da tarefa da tela: a
validação visual em 1440 × 900, nos temas claro e escuro, comparada com o `get_screenshot` dos
frames da seção "Conversa" (`docs/design-system.md`, "Validação visual").

**Roteiro manual, feito por uma pessoa e registrado na mesma pasta:** a nota 100 de
Acessibilidade do Lighthouse na tela da Conversa, pelo Chrome DevTools.

Continua sem Vitest: o agrupamento, os separadores de dia e os links são provados pela tela.

**Exemplos anteriores:** os testes da F01, de ponta a ponta na API e no Playwright, com as bases
`createTestApp()`, `person` e `loggedInPage`.

## Fora de escopo

- Tudo o que o PRD lista em "O que não é objetivo".
- O WebSocket, o evento de mensagem nova e a chegada sem recarregar (F03).
- A tabela de Membros, o Canal privado e a criação de Canal pelo produto (F04).
- Última leitura, Não lidas e contadores (F07), embora a tabela de mensagens já sirva a eles.
- Autoria de mensagem por Agente (F10).
- Testes em outros navegadores além do Chromium.

## Observações

- A F02 fecha questões em aberto do LLD: Canais e Conversas diretas numa tabela só, com
  `kind`; paginação do histórico por cursor; `tamanho da página do histórico` = 50; a rota da tela
  da Conversa. O registro no LLD é feito pela skill `lld`, junto com esta spec.
- O tamanho de 50 mensagens por página e as regras do nome do Canal foram propostos nesta spec,
  sem base em outro documento, e podem mudar na F04 sem migração.
- O acesso ao Figma pelo MCP foi recusado no levantamento desta spec. Por isso os frames são
  citados pelo nome, e os ids ficam para a tarefa de cada tela.
