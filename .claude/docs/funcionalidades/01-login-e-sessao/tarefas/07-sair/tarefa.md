# 07: Sair

**Status:** a fazer

**O que construir:** a Pessoa abre o menu do avatar em qualquer tela logada e sai. A Sessão
daquele navegador acaba, e ela vai para "Entrar". As outras abas do mesmo navegador vão para
"Entrar" na próxima ação, e voltar pelo histórico não mostra conteúdo do chat. As Sessões dela
em outros navegadores continuam valendo. Referências:
- PRD, história 5;
- spec da F01, "BFF e telas" ("Menu do avatar");
- LLD, "Estados e regras" ("Sessão e login") e "Cliente".

**Decisões consumidas de outras tarefas:**
- O shell da Home com o avatar no Rail: 03.
- O cookie, o guard, o layout logado e as fixtures do Playwright: 03.

**Bloqueada por:** 03 (Entrar com uma conta criada por comando e ver a Home)

- [ ] **CA1** · `DELETE /v1/sessions/current` apaga a Sessão apresentada e responde 204. Outra
  Sessão da mesma Pessoa continua valendo, e sem Sessão a resposta é 401 `unauthenticated`.
- [ ] **CA2** · O avatar do Rail abre o UserMenu, por mouse e teclado, com o DropdownMenu do
  Radix. O menu tem o cabeçalho, com o avatar de iniciais e o nome sem a linha de presença, e um
  único item, "Sair do Clenio", como no frame do Figma da Casca.
- [ ] **CA3** · "Sair do Clenio" chama o Server Action de sair, que apaga a Sessão na API,
  apaga o cookie e leva a `/entrar`. Se a API falhar, o cookie é apagado do mesmo jeito e a
  Pessoa vai para `/entrar`.
- [ ] **CA4** · As telas logadas saem com `Cache-Control: no-store`, e o layout logado recarrega a
  página no `pageshow` com `persisted`.
- [ ] **CA5** · Os testes de ponta a ponta da API provam o CA1.
- [ ] **CA6** · O Playwright prova:
  - sair pelo menu usando só o teclado;
  - a outra aba indo para "Entrar" na próxima navegação;
  - voltar pelo histórico depois de sair sem mostrar a Home.
- [ ] **CA7** · A validação visual do menu aberto, nos dois temas, está registrada na pasta desta
  tarefa.
