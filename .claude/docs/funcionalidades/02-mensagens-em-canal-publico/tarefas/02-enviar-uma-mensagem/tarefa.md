# 02: Enviar uma mensagem

**Status:** a fazer

**O que construir:** a Pessoa escreve no campo de mensagem de um Canal e envia com Enter. A
mensagem aparece na hora no fim do Canal, primeiro como "enviando" e depois enviada, com o nome e
o avatar dela e o horário. Quem abre o Canal depois, ou recarrega a página, vê a mensagem. Esta
tarefa decide as mensagens locais da tela, que a tarefa 03 estende com a falha. Referências:
- spec da F02, "Mensagens", "Rotas da API do chat" e "BFF e telas" (Envio, Mensagens locais,
  MessageComposer, Texto da mensagem);
- LLD, "Conceitos transversais de implementação", seção "Concorrência e idempotência";
- PRD, história 4.

**Decisões consumidas de outras tarefas:**
- Tabela `messages`, forma da mensagem na resposta, `conversation_not_found` e lista de mensagens
  no cliente: 01.

**Bloqueada por:** 01 (Abrir um Canal pela barra lateral e ler as mensagens recentes)

- [ ] **CA1** · `POST /v1/conversations/{id}/messages` com `client_id` e `body` responde 201 com a
  mensagem, com o autor da Sessão e o texto sem os espaços e as quebras das pontas.
- [ ] **CA2** · Texto vazio, ou só com espaços e quebras, responde 400 `validation_failed`. 4000
  caracteres passam, e 4001 recebem 400. Uma Conversa que não existe responde 404
  `conversation_not_found`.
- [ ] **CA3** · O envio repetido com o mesmo `client_id` da mesma Pessoa responde 201 com a mesma
  mensagem, e o banco continua com uma linha só. O mesmo `client_id` de outra Pessoa cria outra
  mensagem.
- [ ] **CA4** · O snapshot OpenAPI traz a rota.
- [ ] **CA5** · O envio é um Server Action que chama a API por um service HTTP do web. O
  navegador gera o `client_id` ao enviar.
- [ ] **CA6** · O MessageComposer envia com Enter e quebra a linha com Shift+Enter. O texto vazio
  depois de tirar as pontas não envia. Acima de 4000 caracteres, o contador mostra quanto passou e
  o envio fica desabilitado. Depois do envio, o campo fica vazio e com o foco.
- [ ] **CA7** · A mensagem enviada entra na hora no fim da lista como MessageItem `sending` e troca
  pela resposta da API, sem aparecer duplicada.
- [ ] **CA8** · Endereços que começam com `http://`, `https://` ou `www.` viram link com
  `target="_blank"` e `rel="noopener noreferrer"`. Nenhum texto é renderizado como HTML.
- [ ] **CA9** · Os testes de ponta a ponta da API provam CA1 a CA3.
- [ ] **CA10** · O Playwright prova o envio com Enter, a quebra com Shift+Enter, o texto vazio que
  não envia, o contador e o envio desabilitado acima de 4000 caracteres, o link com
  `target="_blank"`, o campo vazio e com foco depois do envio, e a mensagem de outra Pessoa,
  gravada no Arrange, aparecendo depois de recarregar.
- [ ] **CA11** · A validação visual do campo de mensagem e do estado "enviando", em 1440 × 900 nos
  dois temas, está registrada na pasta desta tarefa.
