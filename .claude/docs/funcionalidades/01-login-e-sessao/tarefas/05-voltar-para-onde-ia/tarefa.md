# 05: Voltar para onde ia

**Status:** concluída

**O que construir:** a Pessoa que abre um endereço do chat sem Sessão, por um link por exemplo,
é levada a "Entrar" e, depois de entrar, cai nesse endereço. Sem endereço pedido, ou com um que
não é do próprio chat, ela cai na Home. Quem já está logado e abre "Entrar" vai direto para a
Home. Referências:
- PRD, histórias 3 e 4;
- LLD, "Cliente", "Sessão no cliente".

**Decisões consumidas de outras tarefas:**
- O proxy, o layout logado e o caminho do 401: 03.
- O Server Action de entrar e as fixtures do Playwright: 03.

**Bloqueada por:** 03 (Entrar com uma conta criada por comando e ver a Home)

- [x] **CA1** · O proxy, sem cookie, e o layout logado, com 401, levam a `/entrar?para=<caminho
  pedido>`, com a busca do endereço incluída.
- [x] **CA2** · Depois de entrar, a Pessoa vai para o `para` só quando ele é um caminho relativo
  que começa com `/` e não com `//`. Sem ele, ou com outro valor, ela vai para a Home.
- [x] **CA3** · `/entrar` aberta com um cookie verifica a Sessão na API. Com 200, vai para a Home;
  com 401, apaga o cookie e mostra o formulário.
- [x] **CA4** · O Playwright prova:
  - entrar por um link profundo e cair nele;
  - `?para=//outro-site` e `?para=https://outro-site` caindo na Home;
  - quem está logado abrindo `/entrar` indo para a Home.
