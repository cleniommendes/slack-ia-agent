# 03: Entrar com uma conta criada por comando e ver a Home

**Status:** a fazer

**O que construir:** a fatia tracer bullet da F01, em quatro passos:
1. Quem opera a instalação cria a conta de uma Pessoa por comando.
2. A Pessoa abre o chat sem Sessão e é levada a "Entrar".
3. Ela entra com e-mail e senha.
4. Ela cai na Home, dentro do shell do produto.

Com e-mail ou senha errados, vê a mensagem de dados incorretos. Abrir uma tela logada com uma
Sessão que a API não reconhece leva de volta a "Entrar". Referências:
- spec da F01, "Pessoas", "Sessões", "Comando de contas" e "BFF e telas";
- LLD, "Segurança", "Interfaces", "Estados e regras" ("Sessão e login") e "Cliente";
- PRD, histórias 1 e 2.

**Decisões consumidas de outras tarefas:**
- Erro de domínio, filter, formato `problem+json` e base dos testes da API: 01.
- Contêiner e configuração do Playwright, tokens e fonte: 02.

**Bloqueada por:** 01 (Base da API do chat), 02 (Base da web e dos testes de ponta a ponta)

- [ ] **CA1** · As tabelas de Pessoas e de Sessões existem por migração, com as colunas da spec.
  O e-mail é único e gravado já normalizado.
- [ ] **CA2** · O comando de contas tem a operação `create`, que recebe o e-mail e o nome e lê a
  senha do terminal sem eco.
  - Grava a senha como hash Argon2id.
  - Recusa um e-mail que já existe, com mensagem.
  - A leitura da senha fica atrás de uma interface pequena, que o teste de integração substitui.
- [ ] **CA3** · `POST /v1/sessions` com a credencial certa responde 201 com o `token` e a
  `person`, e grava só o SHA-256 do token. O e-mail é aceito com maiúsculas e com espaços nas
  pontas.
- [ ] **CA4** · E-mail inexistente e senha errada respondem 401 `invalid_credentials` com o mesmo
  corpo. O e-mail inexistente também passa pela verificação contra o hash fictício.
- [ ] **CA5** · Entrada inválida (formato do e-mail, senha vazia, tamanhos máximos) responde 400
  `validation_failed`.
- [ ] **CA6** · `GET /v1/sessions/current` responde 200 com a Pessoa para uma Sessão válida.
  Cookie ausente ou token desconhecido respondem 401 `unauthenticated`. A verificação mora num
  guard que lê o cookie e pode ser reaproveitado por outras rotas e, na F03, pelo WebSocket.
- [ ] **CA7** · O Server Action de entrar chama a API por um service HTTP do web e grava o cookie
  com os atributos do LLD ("Segurança"). Os componentes e o Server Action não chamam a API direto.
- [ ] **CA8** · Sem cookie, o proxy leva qualquer tela logada a `/entrar`. O layout logado
  verifica a Sessão na API a cada renderização e, com 401, apaga o cookie e leva a `/entrar`.
- [ ] **CA9** · A tela Entrar reproduz os frames do Figma "Padrão", "Enviando" e "Credenciais
  incorretas".
  - O foco inicial fica no E-mail.
  - Durante o envio, o botão fica em `loading` e não aceita um segundo envio.
  - Com credenciais incorretas, a mensagem aparece abaixo da Senha, a senha é limpa, o foco vai
    para a Senha e o e-mail continua preenchido.
- [ ] **CA10** · A Home mostra o shell: o Rail com o "FC", "Início" ativo e o avatar de iniciais
  da Pessoa; a Sidebar só com o cabeçalho "Clenio"; e o Main com o estado "Home / Vazio".
  Ficam de fora os itens das funcionalidades futuras, como lista a spec.
- [ ] **CA11** · No Figma, o frame 19:1399 passa a se chamar "Login / Credenciais incorretas".
- [ ] **CA12** · Os testes de ponta a ponta da API provam CA3 a CA6, com os atalhos de
  `authRoutes`. O teste de integração do comando prova o CA2.
- [ ] **CA13** · O Playwright prova entrar com sucesso até a Home e o caso das credenciais
  incorretas.
  - As fixtures `person` e `loggedInPage` e o teste-semente em `/entrar` estão como a spec
    descreve.
  - O plano de testes da F01 é criado pelo fluxo da skill `playwright-cli`.
- [ ] **CA14** · A validação visual de Entrar (os três estados) e da Home, em 1440 × 900 nos dois
  temas, está registrada na pasta desta tarefa.
- [ ] **CA15** · O `AGENTS.md` da API lista o comando de contas.
