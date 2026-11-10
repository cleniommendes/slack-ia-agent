# 08: Limite de tentativas de login

**Status:** a fazer

**O que construir:** depois de errar a senha várias vezes seguidas, as tentativas seguintes com
aquele e-mail são recusadas por um tempo, mesmo com a senha certa. A tela avisa que houve
tentativas demais, sem revelar se o e-mail tem conta. Referências:
- PRD, história 2, e "Riscos de produto";
- LLD, "Estados e regras" ("Sessão e login", "Limite de tentativas") e "Valores e configuração";
- ADR 0023.

**Decisões consumidas de outras tarefas:**
- O padrão de mensagem do formulário (entre a Senha e o botão, com `role="alert"`): 04.
- `POST /v1/sessions`, a normalização do e-mail e a base dos testes: 03.

**Bloqueada por:** 04 (Erros de preenchimento e falha no envio ao entrar)

- [ ] **CA1** · A tabela de tentativas existe por migração, com uma linha por e-mail normalizado
  e as colunas da spec.
- [ ] **CA2** · Só conta a tentativa com entrada válida e credencial errada, inclusive de e-mail
  sem conta. A falha de número `tentativas de login` dentro da `janela de tentativas de login`
  bloqueia o e-mail por `bloqueio do login`. Uma falha depois de vencida a janela recomeça a
  contagem.
- [ ] **CA3** · Durante o bloqueio, toda tentativa responde 429 `too_many_login_attempts`, mesmo
  com a senha certa.
  - O `Retry-After` traz os segundos que faltam.
  - Essas tentativas não contam nem estendem o bloqueio.
  - Cada uma gera um log `warn`, sem o e-mail completo nem a senha.
- [ ] **CA4** · Um login certo fora do bloqueio apaga a contagem. O incremento é atômico: duas
  falhas simultâneas contam as duas.
- [ ] **CA5** · A tela mostra "Muitas tentativas de entrar. Aguarde alguns minutos e tente de
  novo.", no padrão de mensagem do formulário, com o e-mail e a senha ainda preenchidos.
- [ ] **CA6** · No Figma existe o frame "Login / Tentativas demais", feito com os componentes e
  as variables locais antes do código, e a tela bate com ele.
- [ ] **CA7** · Os testes de ponta a ponta da API provam CA2 a CA4, envelhecendo as tentativas
  por um atalho da base de testes, sem relógio falso.
- [ ] **CA8** · O Playwright prova o aviso de tentativas demais depois da quinta senha errada. A
  validação visual do estado, nos dois temas, está registrada na pasta desta tarefa.
