# 06: Continuar logada, e Sessão que vence ou é revogada

**Status:** em andamento

**O que construir:**
- A Pessoa continua logada em todas as abas e depois de fechar o navegador, enquanto usar o chat
  dentro da duração da Sessão.
- Quando a Sessão vence por falta de uso, ou quem opera a instalação a revoga, a próxima ação em
  qualquer aba a leva a "Entrar".
- Quem opera a instalação ganha as operações de redefinir senha, revogar Sessões e apagar as
  Sessões vencidas.

Referências:
- PRD, histórias 3 e 6;
- spec da F01, "Comando de contas";
- LLD, "Estados e regras" ("Sessão e login"), "Processos de segundo plano" e "Valores e
  configuração".

**Decisões consumidas de outras tarefas:**
- As tabelas de Pessoas e Sessões, o formato do token e o guard: 03.
- O cookie, o layout logado e o caminho do 401: 03.
- A estrutura do comando de contas e a leitura da senha pelo terminal: 03.

**Bloqueada por:** 03 (Entrar com uma conta criada por comando e ver a Home)

- [ ] **CA1** · A verificação de uma Sessão válida renova `expires_at` para agora mais a `duração
  da Sessão`, só quando passou o `intervalo de renovação da Sessão` desde o `last_used_at`. Antes
  disso, não grava nada.
- [ ] **CA2** · Uma Sessão vencida responde 401 `unauthenticated` e é apagada nessa hora.
- [ ] **CA3** · O comando de contas ganha três operações:
  - `revoke-sessions` apaga todas as Sessões de uma Pessoa;
  - `reset-password` lê a senha nova do terminal, troca o hash e revoga todas as Sessões da
    Pessoa;
  - `purge-expired-sessions` apaga as Sessões vencidas.
- [ ] **CA4** · A `duração da Sessão` vem da variável `SESSION_TTL_DAYS`, com padrão 30. O
  intervalo de renovação é constante, como diz o LLD.
- [ ] **CA5** · Os testes de ponta a ponta da API provam CA1 e CA2, envelhecendo a Sessão por um
  atalho da base de testes, sem relógio falso. O teste de integração do comando prova o CA3.
- [ ] **CA6** · O Playwright prova:
  - uma segunda aba do mesmo navegador já logada;
  - um contexto novo com os cookies guardados continuando logado;
  - uma Sessão revogada no banco levando a "Entrar" na próxima navegação.
