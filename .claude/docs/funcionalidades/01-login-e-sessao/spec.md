# Spec · F01 · Login e sessão

2026-11-09 · Clenio · Status: pronta · PRD: [prd.md](prd.md)

Como a F01 será construída. O que a Pessoa consegue fazer, os critérios de aceite e o que não é
objetivo estão no PRD. As regras de Sessão e de login, os valores e as convenções transversais
estão no [LLD](../../lld.md), e esta spec aponta para eles em vez de repeti-los.

## Problema

Sem identificar quem usa o chat, nada mais do produto funciona: não há autor de mensagem, nem
participação em canal privado, nem permissão de dados. Hoje não há como entrar (PRD, seção 1,
"Resumo executivo").

## Solução

A Pessoa entra com o e-mail e a senha da conta que a empresa criou para ela, continua logada em
todas as abas do navegador enquanto usar o chat ao menos uma vez a cada 30 dias e sai pelo menu do
avatar. Quem opera a instalação cria contas, redefine senhas e revoga Sessões por um comando da
API do chat. O fluxo completo está no PRD, seção 2, "Fluxo".

## Histórias de usuário

As histórias 1 a 7 do PRD (seção 2, "Histórias de usuário") valem como estão, com os critérios de
aceite de lá. Esta spec acrescenta as de quem opera a instalação, que o PRD deixa fora do produto:

8. Como operação, quero criar a conta de uma Pessoa com e-mail, nome e senha, para que ela consiga
   entrar no chat.
9. Como operação, quero redefinir a senha de uma Pessoa, para que ela volte a entrar quando
   esquecer a senha.
10. Como operação, quero revogar todas as Sessões de uma Pessoa, para tirar o acesso de um
    navegador perdido ou compartilhado.
11. Como operação, quero apagar as Sessões vencidas, para o banco não acumular linhas mortas.
12. Como operação, quero digitar a senha sem que ela fique no histórico do terminal, para não
    deixar a credencial exposta na máquina.

## Decisões de implementação

### Base que a F01 monta

A F01 é a primeira funcionalidade, e o código ainda é o esqueleto dos dois frameworks. Ela monta
o que as próximas reaproveitam:

- **API do chat:** módulo de configuração com validação na subida (LLD, "Conceitos transversais
  de implementação", seção "Configuração"); TypeORM com migrações
  ([ADR 0018](../../adr/0018-typeorm-api-do-chat.md)) e ids UUID v7
  ([ADR 0022](../../adr/0022-uuid-v7.md)); o erro de domínio base, o filter global de erros e o
  guard de autenticação descritos na rule de erros da API (`.claude/rules/nest-api-errors.md`).
- **Web:** módulo de configuração com a mesma validação; o conjunto completo de tokens do
  design system, nos temas claro e escuro, com a fonte Lato. O tema claro é o padrão; o escuro
  vale só com `data-theme="dark"` na raiz, que a F09 liga à troca de tema. Os primitivos e as
  bibliotecas do design system entram à medida que as telas desta spec os usam
  (`docs/design-system.md`, "Stack de interface").
- **Testes da API:** um banco de testes separado, com a base de testes descrita em "Decisões de
  teste".
- **Testes da web:** o Playwright, num serviço próprio do compose (LLD, "Ambiente de
  desenvolvimento"), com a base descrita em "Decisões de teste". O serviço e o comando entram no
  `AGENTS.md` da raiz e no do web na tarefa que os monta.

### Pessoas (API do chat)

Tabela `people`, `planejada`:

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | uuid | UUID v7, gerado na aplicação |
| `email` | texto, único | Gravado já normalizado: sem os espaços das pontas e em minúsculas |
| `name` | texto | Nome exibido no menu do avatar e nas iniciais |
| `password_hash` | texto | Argon2id (LLD, seção "Segurança") |
| `created_at`, `updated_at` | timestamptz | Convenção do LLD, seção "Dados" |

`@usuário`, cargo, telefone, presença, papel de administrador e permissão de dados ficam para as
funcionalidades que os usam (F05, F09, F10 e F13).

### Sessões (API do chat)

Tabela `sessions`, `planejada`:

| Coluna | Tipo | Regra |
| --- | --- | --- |
| `id` | uuid | UUID v7 |
| `person_id` | uuid | Referência a `people`; apagar a Pessoa apaga as Sessões dela |
| `token_hash` | texto, único | SHA-256 do token; o token em si nunca é gravado nem vai para o log |
| `expires_at` | timestamptz | Validade, renovada pelo uso |
| `last_used_at` | timestamptz | Último uso que renovou a validade |
| `created_at`, `updated_at` | timestamptz | Convenção do LLD |

As regras de criação, verificação, renovação, vencimento, revogação e saída estão no LLD, seção
"Estados e regras", subseção "Sessão e login".

**Rotas**, todas `planejadas` e com o corpo de erro da rule de erros da API:

| Rota | Entrada | Sucesso | Erros |
| --- | --- | --- | --- |
| `POST /v1/sessions` | `email`, `password` | 201 com `token` e `person` (`id`, `name`, `email`) | `validation_failed` (400), `invalid_credentials` (401), `too_many_login_attempts` (429, com `Retry-After` em segundos) |
| `GET /v1/sessions/current` | Cookie de sessão | 200 com `person` | `unauthenticated` (401) |
| `DELETE /v1/sessions/current` | Cookie de sessão | 204 | `unauthenticated` (401) |

- A validação de entrada de `POST /v1/sessions` aceita um e-mail em formato válido, com no máximo
  254 caracteres, e uma senha não vazia, com no máximo 256, para um texto enorme não pesar no
  Argon2id.
- `unauthenticated` cobre cookie ausente, token desconhecido, Sessão vencida e Sessão revogada,
  sem distinguir os casos.
- O guard de autenticação lê a Sessão do cookie, a mesma credencial que o BFF repassa (LLD, seção
  "Interfaces"). A F03 reaproveita a mesma verificação no handshake do WebSocket.

### Limite de tentativas de login (API do chat)

Tabela `login_attempts`, `planejada`: uma linha por e-mail normalizado, com `id`, `email` (único),
`failed_count`, `first_failed_at`, `blocked_until`, `created_at` e `updated_at`. As regras estão
no LLD, seção "Estados e regras", subseção "Sessão e login"; a escolha de contar só pelo e-mail
está na [ADR 0023](../../adr/0023-limite-de-login-por-email.md).

### Comando de contas (API do chat)

Um script da própria API do chat, rodado no contêiner, que sobe o contexto do Nest sem HTTP e
chama os mesmos services de Pessoas e de Sessões. Não há biblioteca de linha de comando.

| Operação | Recebe | Efeito |
| --- | --- | --- |
| `create` | E-mail, nome; senha pelo terminal | Cria a Pessoa. E-mail já existente é recusado com mensagem |
| `reset-password` | E-mail; senha nova pelo terminal | Troca o hash e revoga todas as Sessões da Pessoa |
| `revoke-sessions` | E-mail | Apaga todas as Sessões da Pessoa |
| `purge-expired-sessions` | — | Apaga as Sessões vencidas |

A senha é lida do terminal sem eco, e nunca de argumento nem de variável. O comando entra no
`AGENTS.md` da API, seção "Comandos", na tarefa que o implementa.

### BFF e telas (web)

- **Endereços:** `/entrar` é a tela de entrar, e `/` é a Home. As telas logadas ficam sob um
  layout comum. O parâmetro de volta é `?para=`, e as regras dele estão no LLD, seção "Cliente",
  "Sessão no cliente".
- **Chamadas do navegador:** entrar e sair são Server Actions (LLD, "Estrutura do código"). Cada
  uma chama um service HTTP do
  web, que fala com a API do chat; nenhum componente nem Server Action chama o `fetch` direto
  (`apps/web/AGENTS.md`, "API Externas").
- **Cookie:** o BFF grava o cookie com o token devolvido por `POST /v1/sessions` e o apaga ao sair
  ou ao receber 401. Os atributos e a validade estão no LLD, seção "Segurança".
- **Verificação da Sessão:** o proxy do Next confere só a existência do cookie, e o layout das
  telas logadas e a tela `/entrar` verificam de verdade. O comportamento em cada resposta está no
  LLD, seção "Cliente", "Sessão no cliente".
- **Tela Entrar:** reproduz a seção Login do Figma (19:1276). Os estados são estes:
  - Padrão: frame 19:1306, com o foco inicial no E-mail.
  - Erro de validação: frame 19:1336. A validação roda no cliente e no Server Action, com os
    textos do PRD (história 2), e o foco vai para o primeiro campo inválido.
  - Enviando: frame 19:1369. O botão fica em `loading`, e o envio duplo é bloqueado.
  - Credenciais incorretas: o frame 19:1399, hoje chamado "Erro do servidor", que será renomeado.
    A mensagem fica abaixo da Senha, a senha é limpa, o foco vai para a Senha e o e-mail continua
    preenchido.
  - Tentativas demais: frame novo. A mensagem é "Muitas tentativas de entrar. Aguarde alguns
    minutos e tente de novo."
  - Falha no envio: frame novo, para falha da rede ou do servidor. A mensagem é "Não foi possível
    entrar agora. Confira sua conexão e tente de novo."

  Nos dois estados novos, a mensagem fica no formulário, entre a Senha e o botão, com
  `role="alert"`. O e-mail e a senha continuam preenchidos, e o foco não muda. Os campos com erro
  levam `aria-invalid` e `aria-describedby` apontando para a mensagem.
- **Mudança no Figma, antes do código da tela Entrar:** renomear o frame 19:1399 para
  "Login / Credenciais incorretas" e criar "Login / Tentativas demais" e "Login / Falha no envio"
  no mesmo padrão, com os componentes e variables locais (`docs/design-system.md`, "Do código para
  o Figma").
- **Home na F01:** o shell real, só com o que já funciona, e não uma tela provisória.
  - Rail: o "FC", "Início" ativo e o avatar de iniciais. Ficam de fora Atividade (F08), o
    controle de tema (F09) e o ponto de presença (F09).
  - Sidebar: só o cabeçalho "Clenio", sem o ícone de nova mensagem e sem as seções de canais,
    mensagens diretas e agentes (F02, F04, F05, F10).
  - Main: o estado "Home / Vazio" (19:1645).

  O shell cresce a cada funcionalidade.
- **Menu do avatar (UserMenu):** abre pelo avatar do Rail, com o DropdownMenu do Radix, por mouse
  e teclado. Na F01 ele tem o cabeçalho, com o avatar de iniciais e o nome sem a linha de
  presença, e um único item, "Sair do Clenio" (Casca, 25:25749). Sair chama o Server Action de
  saída, que apaga a Sessão na API (`DELETE /v1/sessions/current`), apaga o cookie e leva a
  `/entrar`. Se a API falhar, o cookie é apagado do mesmo jeito e a Pessoa vai para `/entrar`.
- **Esperando e erro da verificação:** enquanto o layout logado verifica a Sessão, aparece
  "Portas / Carregando o app" (19:1770). Se a verificação falha por rede ou servidor, aparece
  "Portas / Erro de sessão" (19:1793), em tela cheia, sem o shell; "Tentar de novo" refaz a
  renderização da rota. A "Portas / Casca de espera" (19:1799) não entra na F01.
- **Voltar pelo histórico depois de sair:** as telas logadas não são guardadas no cache do
  navegador. O mecanismo está no LLD, seção "Cliente", "Sessão no cliente".

### Tempo real

A F01 não sobe o WebSocket. A parte das histórias 5 e 6 do PRD que fala em "conexão de tempo real
recusada" fica como critério de aceite da F03: o handshake usa a mesma verificação de Sessão
desta spec e recusa a conexão com uma Sessão vencida ou revogada (LLD, seção "Cliente", "Sessão no
cliente"). Na F01, a "próxima ação" é a navegação ou a chamada ao BFF que recebe 401.

## Decisões de teste

**O que faz um bom teste aqui:** o teste prova o comportamento externo, que é a resposta HTTP, a
linha no banco ou o redirecionamento, e não a forma interna dos services. A forma de cada teste
está em `.claude/rules/nest-api-testing.md`.

**API do chat, testes de ponta a ponta por HTTP com banco real.** São o seam principal: todas as
regras da F01 moram na API e são provadas por ela.

- Entrar com e-mail e senha certos: responde 201, devolve o token e grava a Sessão com o hash, e
  não com o token.
- O e-mail é aceito com maiúsculas e com espaços nas pontas.
- Validação de entrada, inclusive os tamanhos máximos: responde 400 com `validation_failed`, e a
  tentativa não conta para o limite.
- E-mail inexistente e senha errada: os dois respondem 401 com o mesmo `invalid_credentials` e o
  mesmo corpo.
- Limite: a 5ª falha dentro da janela bloqueia; durante o bloqueio, até a senha certa recebe 429
  com `Retry-After`; as tentativas durante o bloqueio não o estendem; passado o bloqueio, a senha
  certa entra; um login certo antes do limite zera a contagem; o limite vale também para e-mail
  sem conta; duas falhas simultâneas contam as duas.
- Verificação: responde 200 com a Pessoa; renova a validade quando passou o `intervalo de
  renovação da Sessão` e não renova antes disso.
- Sessão vencida, revogada e token desconhecido: os três respondem 401 com `unauthenticated`, e a
  vencida é apagada.
- Saída: responde 204, e a mesma Sessão passa a responder 401; outra Sessão da mesma Pessoa
  continua valendo.

Os testes de tempo (janela, bloqueio, validade e renovação) envelhecem as linhas no banco no
Arrange, por atalhos da base de testes, sem relógio falso e sem `overrideProvider`.

**Comando de contas:** teste de integração das quatro operações contra o banco de testes. A
leitura da senha pelo terminal fica atrás de uma interface pequena, que o teste substitui pela
entrada dada.

**Base de testes da API, criada na F01:**
- `createTestApp()`;
- `uniqueEmail()`;
- os atalhos de `authRoutes` (criar Pessoa direto pelo service e entrar);
- os atalhos de envelhecer Sessão e tentativas;
- o banco `chat_test`, criado pelo script de inicialização do Postgres e, num volume que já
  existe, pelo `globalSetup`, que também roda as migrações.

**Web, testes de ponta a ponta com o Playwright.** É o único seam da web. Os testes rodam só no
Chromium, em modo headless, também nas sessões do `playwright-cli`, contra o ambiente de desenvolvimento que já está de pé (web, API do chat e banco
`chat`), e provam o comportamento pela tela. Cobrem:
- entrar com sucesso;
- os erros de validação, de credenciais incorretas e de tentativas demais, com os textos e o foco
  descritos em "BFF e telas";
- o `?para=`, inclusive um valor como `//outro-site`, que cai na Home;
- quem está logado e abre `/entrar` vai para a Home;
- uma segunda aba do mesmo navegador já logada;
- reabrir o navegador, num contexto novo com os cookies guardados, continua logado;
- sair leva a "Entrar", e a outra aba vai para "Entrar" na próxima ação;
- uma Sessão revogada leva a "Entrar" na próxima ação;
- voltar pelo histórico depois de sair não mostra conteúdo do chat;
- o fluxo inteiro só pelo teclado;
- a checagem de acessibilidade com `@axe-core/playwright` nas telas Entrar e Home, sem
  violações.

**Como os testes da web são escritos:** pelo fluxo da skill `playwright-cli` (planejar, gerar e
corrigir). O agente explora a tela a partir do teste-semente, escreve o plano de testes, gera um
arquivo de teste por cenário com as ações gravadas e corrige um teste quebrado pelo mesmo
caminho. O plano de testes da F01 fica junto dos testes, no projeto `web`, aponta para esta spec
e é dono dos passos de cada cenário; esta spec continua dona do que é coberto. Os comandos da
skill rodam no contêiner `e2e`, nunca com `npx` na máquina.

**Base dos testes da web, criada na F01:**
- a fixture `person` cria a Pessoa direto no banco, com e-mail único e o hash Argon2id fixo de
  uma senha conhecida de teste, e devolve o e-mail e a senha; onde ficam esses dados e como saem
  está no LLD, "Ambiente de desenvolvimento";
- a fixture `loggedInPage` entra pelo formulário da tela Entrar, no único lugar que faz isso;
- o teste-semente abre `/entrar` com uma Pessoa pronta. Os cenários de login usam só `person`, e
  os que partem de alguém logado usam `loggedInPage`;
- os testes de revogação e de tempo mexem nas linhas do banco no Arrange, como na API.

**Verificações do agente com o `playwright-cli`**, registradas na pasta da tarefa da tela:
- **"Erro de sessão":** o agente para o processo da API do chat, abre uma tela logada, confere a
  mensagem e o botão, sobe a API de novo e confere que "Tentar de novo" mostra a tela pedida. O
  snapshot e a captura ficam no registro.
- **Validação visual:** capturas em 1440 × 900, no tema claro e no escuro (trocando o
  `data-theme`), comparadas com o `get_screenshot` dos frames do Figma
  (`docs/design-system.md`, "Validação visual").

**Roteiro manual, feito por uma pessoa e registrado na mesma pasta:** a nota 100 de
Acessibilidade do Lighthouse na tela Entrar, pelo Chrome DevTools.

Não há Vitest na F01. Ele entra quando aparecer uma função pura com muitos casos, que seria lenta
de provar pelo navegador.

**Exemplos anteriores:** não há testes de comportamento no código. Os testes da F01 viram o
exemplo para as próximas funcionalidades.

## Fora de escopo

- Tudo o que o PRD lista em "O que não é objetivo".
- O WebSocket e a recusa da conexão por Sessão inválida, que ficam para a F03 (seção "Tempo
  real").
- Presença, perfil, notificações e troca de tema no menu do avatar e no Rail (F05, F08 e F09).
- Os itens da Sidebar e a Atividade.
- Rotina periódica de limpeza de Sessões, limite de tentativas por IP e Redis.
- Testes do Playwright em outros navegadores além do Chromium, e uma instância da web e da API
  só para os testes.

## Observações

- A F01 fechou várias questões em aberto do LLD: formato e guarda do identificador de Sessão,
  atributos do cookie, `SameSite` e CSRF, como o BFF leva a Sessão à API do chat, chave do limite
  de tentativas, biblioteca de validação da configuração, formato do corpo de erro e Sessões
  vencidas. O registro está no LLD, nas seções citadas acima.
- O risco de uma pessoa travar a conta de outra por 15 minutos foi aceito na
  [ADR 0023](../../adr/0023-limite-de-login-por-email.md).
- Os nós do Figma citados vieram do levantamento feito para esta spec (arquivo `slack`, página
  Telas) e podem mudar de id se os frames forem recriados. Nesse caso, valem os nomes.
