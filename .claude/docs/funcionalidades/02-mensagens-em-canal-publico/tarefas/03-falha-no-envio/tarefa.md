# 03: Falha no envio

**Status:** a fazer

**O que construir:** quando o envio de uma mensagem falha por erro do servidor ou da rede, a
mensagem fica no Canal marcada como "Não enviada", sem perder o texto. A Pessoa escolhe "Tentar de
novo", que envia a mensagem uma vez só, ou "Descartar", que a tira do Canal. Referências:
- spec da F02, "BFF e telas" (Envio e Mensagens locais);
- PRD, história 5.

**Decisões consumidas de outras tarefas:**
- Mensagens locais da tela e `client_id` gerado no navegador: 02.
- Envio repetido idempotente na API: 02.

**Bloqueada por:** 02 (Enviar uma mensagem)

- [ ] **CA1** · Uma falha no Server Action de envio, por erro do servidor ou da rede, deixa a
  mensagem como MessageItem `failed`, com "Não enviada", "Tentar de novo" e "Descartar".
- [ ] **CA2** · "Tentar de novo" reenvia com o mesmo `client_id`. A mensagem volta a "enviando" e,
  com sucesso, fica enviada, uma vez só para todos.
- [ ] **CA3** · "Descartar" tira a mensagem da tela.
- [ ] **CA4** · Trocar de Canal ou recarregar a página descarta as mensagens não enviadas.
- [ ] **CA5** · As ações "Tentar de novo" e "Descartar" funcionam pelo teclado, e o estado "Não
  enviada" é anunciado ao leitor de tela.
- [ ] **CA6** · O Playwright prova a falha, provocada pela interceptação da requisição do Server
  Action: a mensagem fica "Não enviada"; com a requisição liberada, "Tentar de novo" a envia e o
  Canal, recarregado, mostra uma mensagem só; "Descartar" a tira da tela; recarregar descarta uma
  mensagem não enviada.
- [ ] **CA7** · A validação visual do estado "Não enviada", comparada com o frame de falha no envio
  da seção "Conversa" do Figma, em 1440 × 900 nos dois temas, está registrada na pasta desta
  tarefa.
