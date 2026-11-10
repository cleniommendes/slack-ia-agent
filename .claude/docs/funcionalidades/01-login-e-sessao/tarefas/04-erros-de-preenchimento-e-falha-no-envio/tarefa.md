# 04: Erros de preenchimento e falha no envio ao entrar

**Status:** a fazer

**O que construir:** a Pessoa que preenche errado o login descobre o que corrigir antes de
qualquer envio. Quando a rede ou o servidor falha no envio, ela vê um erro diferente da mensagem
de dados incorretos, com o e-mail ainda preenchido. O fluxo inteiro funciona só pelo teclado, e a
tela atinge a nota 100 de acessibilidade. Referências:
- PRD, histórias 1 e 2;
- spec da F01, "BFF e telas".

**Decisões consumidas de outras tarefas:**
- A tela Entrar, o Server Action de entrar e as fixtures do Playwright: 03.

**Bloqueada por:** 03 (Entrar com uma conta criada por comando e ver a Home)

- [ ] **CA1** · Com e-mail vazio ou fora do formato, a mensagem abaixo do campo é "Informe um
  e-mail válido, como nome@empresa.com.". Com a senha vazia, é "Informe sua senha.". Nenhum dos
  casos envia o login, e a mesma validação roda no cliente e no Server Action.
- [ ] **CA2** · No erro de validação, o foco vai para o primeiro campo inválido. Os campos com
  erro levam `aria-invalid` e `aria-describedby` apontando para a mensagem.
- [ ] **CA3** · Uma falha de rede, um 5xx ou o tempo esgotado no envio mostram "Não foi possível
  entrar agora. Confira sua conexão e tente de novo.".
  - A mensagem é do formulário, entre a Senha e o botão, com `role="alert"`.
  - O e-mail e a senha continuam preenchidos, e o foco não muda.
  - Esse padrão de mensagem do formulário é o que a tarefa 08 reaproveita.
- [ ] **CA4** · No Figma existe o frame "Login / Falha no envio", feito com os componentes e as
  variables locais antes do código, e a tela bate com ele.
- [ ] **CA5** · Pelo teclado, Tab percorre E-mail, Senha e o botão, e Enter envia.
- [ ] **CA6** · O Playwright prova o CA1, o foco do CA2, o fluxo só pelo teclado do CA5 e a
  checagem do axe sem violações nas telas Entrar e Home. A falha no envio do CA3 é provada pelo
  `playwright-cli`, com a API do chat parada, e registrada na pasta desta tarefa.
- [ ] **CA7** · O roteiro manual com a nota 100 de Acessibilidade do Lighthouse na tela Entrar,
  feita por uma pessoa, e a validação visual dos estados "Erro de validação" e "Falha no envio",
  nos dois temas, estão registrados na pasta desta tarefa.
