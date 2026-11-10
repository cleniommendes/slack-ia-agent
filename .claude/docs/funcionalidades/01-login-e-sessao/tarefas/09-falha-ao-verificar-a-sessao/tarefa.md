# 09: Falha ao verificar a Sessão

**Status:** a fazer

**O que construir:** enquanto o chat confere a Sessão, a Pessoa vê a tela de carregamento. Se a
conferência falha por rede ou servidor, ela vê "Não foi possível verificar sua sessão", com
"Tentar de novo", e não é mandada para "Entrar". Quando a API volta, "Tentar de novo" mostra a
tela pedida. Referências:
- PRD, história 7;
- spec da F01, "BFF e telas" ("Esperando e erro da verificação");
- LLD, "Cliente", "Sessão no cliente".

**Decisões consumidas de outras tarefas:**
- O layout logado, a verificação da Sessão e o caminho do 401: 03.

**Bloqueada por:** 03 (Entrar com uma conta criada por comando e ver a Home)

- [ ] **CA1** · Enquanto o layout logado verifica a Sessão, aparece "Portas / Carregando o app",
  com o spinner centralizado.
- [ ] **CA2** · Com falha de rede, 5xx ou tempo esgotado na verificação, aparece "Portas / Erro
  de sessão" em tela cheia, sem o shell, com o texto do Figma. O cookie não é apagado, e a Pessoa
  não vai para "Entrar".
- [ ] **CA3** · "Tentar de novo" refaz a renderização da rota. Com a API de volta, mostra a tela
  pedida; com 401, segue o caminho normal para "Entrar".
- [ ] **CA4** · O agente verifica CA2 e CA3 com o `playwright-cli`: para o processo da API do
  chat, abre uma tela logada, confere a mensagem e o botão, sobe a API de novo e clica em "Tentar
  de novo". O snapshot e a captura ficam registrados na pasta desta tarefa.
- [ ] **CA5** · A validação visual de "Erro de sessão" e de "Carregando o app", nos dois temas,
  está registrada na pasta desta tarefa.
