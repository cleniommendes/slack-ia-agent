# 01: Abrir um Canal pela barra lateral e ler as mensagens recentes

**Status:** a fazer

**O que construir:** a fatia tracer bullet da F02, em três passos:
1. A Pessoa logada vê a seção "Canais" na barra lateral, com os Canais públicos do Workspace,
   inclusive o `#geral`.
2. Ela escolhe um Canal e ele abre sem recarregar a página, no endereço dele.
3. Ela lê as mensagens mais recentes do Canal, com a mais nova embaixo.

Um Canal sem mensagens mostra o início do Canal, e um endereço de Canal que não existe mostra
"Canal não encontrado". Esta tarefa decide as formas que as outras da F02 consomem: a tabela de
Conversas, a de mensagens, a mensagem na resposta da API e a lista de mensagens no cliente.
Referências:
- spec da F02, "Conversas", "Mensagens", "Rotas da API do chat" e "BFF e telas";
- LLD, "Estados e regras", subseção "Participação e mensagem";
- PRD, histórias 1, 3 e 6.

**Decisões consumidas de outras tarefas:**
- Sessão, guard, erro de domínio, shell logado, bases de teste da API e da web, fixtures `person`
  e `loggedInPage`: F01-T03.

**Bloqueada por:** F01-T03 (Entrar com uma conta criada por comando e ver a Home)

- [ ] **CA1** · As tabelas `conversations` e `messages` existem por migração, com as colunas, a
  unicidade do nome do Canal, a unicidade de (`author_person_id`, `client_id`) e o índice da spec.
- [ ] **CA2** · Uma migração de dados cria o `#geral`.
- [ ] **CA3** · `GET /v1/channels` responde 200 com os Canais públicos em ordem alfabética do
  nome. Sem Sessão, 401 `unauthenticated`.
- [ ] **CA4** · `GET /v1/conversations/{id}` responde 200 com `id`, `kind` e `name`. Um id que
  não existe responde 404 `conversation_not_found`, que entra no catálogo.
- [ ] **CA5** · `GET /v1/conversations/{id}/messages`, sem `before`, responde 200 com as mensagens
  mais recentes até o `tamanho da página do histórico`, da mais nova para a mais antiga, cada uma
  com `id`, `conversation_id`, `client_id`, `body`, `created_at` e `author` (`id`, `name`), e com
  `has_more`. Esta é a forma da mensagem que as tarefas 02 e 04 consomem.
- [ ] **CA6** · O snapshot OpenAPI traz as três rotas.
- [ ] **CA7** · A Sidebar ganha a seção "Canais", lida no layout logado no servidor, com um
  SidebarRow por Canal, ChannelIcon e o Canal aberto em `sidebar-active`. A troca de Canal usa a
  navegação do Next, funciona só pelo teclado e o voltar do navegador leva ao Canal anterior.
- [ ] **CA8** · A tela `/conversas/<id>` lê o histórico pela rota do BFF
  `GET /api/conversas/<id>/mensagens`, com SWR paginado. A primeira página chega renderizada no
  servidor e vira o dado inicial. A revalidação ao focar e ao reconectar fica desligada. Esta é a
  lista que as tarefas 02, 04 e 05 estendem.
- [ ] **CA9** · As mensagens aparecem com a mais nova embaixo e a rolagem no fim, como MessageItem
  `full`. Cada mensagem é um `article` com nome acessível formado pelo autor e pelo horário. O
  texto é renderizado como texto, com as quebras de linha.
- [ ] **CA10** · Um Canal sem mensagens mostra só a ConversationIntro, com o nome do Canal e o
  convite para a primeira mensagem.
- [ ] **CA11** · Um id que não existe mostra "Canal não encontrado" dentro do shell, com um botão
  que leva ao `#geral`.
- [ ] **CA12** · Os testes de ponta a ponta da API provam CA2 a CA5, com o atalho de criar Canal
  com nome único e o de criar mensagens em lote.
- [ ] **CA13** · O Playwright prova a seção "Canais" em ordem alfabética com o Canal aberto
  destacado, a troca de Canal pelo teclado, o voltar do navegador, o Canal vazio e "Canal não
  encontrado", com as fixtures `channel` e `messages`. O axe não acha violações na tela da
  Conversa, com histórico e vazia.
- [ ] **CA14** · A validação visual da tela da Conversa (com histórico, vazia e "Canal não
  encontrado"), em 1440 × 900 nos dois temas, está registrada na pasta desta tarefa, com os ids
  dos frames do Figma usados. Estado que faltava no Figma foi criado lá antes do código.
