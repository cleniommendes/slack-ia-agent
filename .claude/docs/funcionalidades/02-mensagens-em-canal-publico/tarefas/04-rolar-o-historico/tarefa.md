# 04: Rolar o histórico até o início do Canal

**Status:** a fazer

**O que construir:** a Pessoa rola um Canal para cima e as mensagens anteriores vão aparecendo,
sem perder a posição de leitura, até a primeira mensagem, acima da qual aparece o início do Canal.
Enquanto carrega, ela vê o estado de carregamento; se o carregamento falha, vê um erro com "Tentar
de novo", e o que já estava na tela continua ali. Referências:
- spec da F02, "Rotas da API do chat" (Histórico) e "BFF e telas" (Leitura do histórico no
  navegador e Lista de mensagens);
- PRD, história 6.

**Decisões consumidas de outras tarefas:**
- Forma da mensagem na resposta, rota do BFF e lista com SWR paginado: 01.

**Bloqueada por:** 01 (Abrir um Canal pela barra lateral e ler as mensagens recentes)

- [ ] **CA1** · `GET /v1/conversations/{id}/messages` com `before` responde as mensagens
  anteriores a ela, até o `tamanho da página do histórico`. A página que chega à primeira mensagem
  traz `has_more` falso.
- [ ] **CA2** · Um `before` que não é mensagem daquela Conversa responde 400 `validation_failed`.
- [ ] **CA3** · Rolar até o topo pede a página anterior pela rota do BFF, com `antes=`, e mantém a
  posição de leitura quando ela chega.
- [ ] **CA4** · Com `has_more` falso, a ConversationIntro aparece acima da primeira mensagem, e
  nenhuma página nova é pedida.
- [ ] **CA5** · O MessageSkeleton aparece enquanto a primeira página ou uma página anterior
  carrega.
- [ ] **CA6** · Uma falha ao carregar mostra um erro com "Tentar de novo", sem tirar as mensagens
  que já estão na tela. "Tentar de novo" refaz o pedido.
- [ ] **CA7** · Os testes de ponta a ponta da API provam CA1 e CA2, com o atalho de criar mensagens
  em lote.
- [ ] **CA8** · O Playwright prova o Canal que abre no fim, a rolagem até a ConversationIntro num
  Canal com mais de duas páginas, e o erro de carregamento, provocado pela interceptação da rota
  do BFF, com "Tentar de novo".
- [ ] **CA9** · A validação visual dos estados carregando e erro de carregamento, em 1440 × 900 nos
  dois temas, está registrada na pasta desta tarefa.
