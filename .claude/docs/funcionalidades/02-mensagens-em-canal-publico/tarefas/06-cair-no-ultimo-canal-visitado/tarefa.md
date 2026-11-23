# 06: Cair no último Canal visitado

**Status:** a fazer

**O que construir:** ao entrar ou abrir a Home, a Pessoa cai no último Canal que visitou, mesmo
vindo de outro navegador. No primeiro acesso, cai no `#geral`. Quem chega por um endereço pedido
continua caindo nele. Referências:
- spec da F02, "Último Canal visitado", "Rotas da API do chat" e "BFF e telas" (Home e Visita);
- spec da F01, "BFF e telas" (Endereços e o parâmetro `?para=`);
- PRD, história 2.

**Decisões consumidas de outras tarefas:**
- Tabela `conversations`, `#geral`, `conversation_not_found` e a tela `/conversas/<id>`: 01.
- O parâmetro `?para=` e a volta para o endereço pedido: F01-T05.

**Bloqueada por:** 01 (Abrir um Canal pela barra lateral e ler as mensagens recentes),
F01-T05 (Voltar para onde ia)

- [ ] **CA1** · A coluna `last_conversation_id` existe em `people` por migração, nula e com
  referência a `conversations`, que vira nula se a Conversa deixar de existir.
- [ ] **CA2** · `PUT /v1/people/me/last-conversation` com `conversation_id` responde 204 e grava a
  visita. Um id que não existe responde 404 `conversation_not_found`. O snapshot OpenAPI traz a
  rota.
- [ ] **CA3** · `GET /v1/sessions/current` devolve `last_conversation_id` na `person`.
- [ ] **CA4** · Ao abrir uma Conversa, a tela grava a visita por um Server Action. Uma falha nessa
  gravação não aparece para a Pessoa e não impede a leitura.
- [ ] **CA5** · A Home redireciona, no servidor, para o último Canal visitado e, sem ele, para o
  `#geral`. Sem nenhum dos dois, mostra o estado "Home / Vazio".
- [ ] **CA6** · O `?para=` continua valendo antes do último Canal.
- [ ] **CA7** · Os testes de ponta a ponta da API provam CA2 e CA3.
- [ ] **CA8** · O Playwright prova o primeiro acesso no `#geral`, o último Canal num contexto novo
  do navegador depois de visitar outro, e o `?para=` ganhando do último Canal.
