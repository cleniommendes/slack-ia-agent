# Plano da F01-T07: Sair

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

## Critérios

### CA1

**Marca:** teste HTTP

**Cenário 1 (sai):** Dado uma Pessoa com a Sessão do token A, quando alguém chama
`DELETE /v1/sessions/current` com o cookie de A, então responde 204 sem corpo, a linha de A não
existe mais, e `GET /v1/sessions/current` com o mesmo cookie passa a responder 401
`unauthenticated`.

**Cenário 2 (só a apresentada):** Dado a mesma Pessoa com uma segunda Sessão B (outro navegador),
quando A sai, então B continua respondendo 200 em `GET /v1/sessions/current`.

**Cenário 3 (sem Sessão):** Dado a API de pé, quando alguém chama a mesma rota sem cookie e com um
token desconhecido, então recebe 401 `unauthenticated` nos dois casos, com o mesmo corpo.

**Teste previsto:** e2e da API, `test/sessions.e2e-spec.ts`, "responde 204 e apaga só a Sessão
apresentada" (cenários 1 e 2) e "responde 401 unauthenticated ao sair sem Sessão" (cenário 3, um
caso por entrada).

### CA2

**Marca:** teste no Playwright

**Cenário 1 (teclado):** Dado uma Pessoa logada na Home, quando o teste aperta Tab duas vezes (o
link "Início" e o avatar), então o foco chega ao botão do avatar, na ordem do Rail; Enter abre o
menu, e o foco vai para o item "Sair do Clenio".

**Cenário 2 (mouse):** Dado a Home, quando o teste clica no avatar, então o menu abre; Esc o fecha
e devolve o foco ao avatar.

**Cenário 3 (conteúdo):** Dado o menu aberto, então ele tem o cabeçalho, com as iniciais e o nome
da Pessoa, sem linha de presença, e um único item, "Sair do Clenio". Não há outro item de menu.

**Teste previsto:** Playwright, `e2e/sair.spec.ts`, "abre o menu do avatar pelo teclado e foca o
item Sair do Clenio", "abre o menu do avatar com o mouse e fecha com Esc" e "mostra o cabeçalho com
o nome e um único item". O menu aberto também passa pelo axe em `e2e/a11y.spec.ts`, "o menu do
avatar aberto não tem violações do axe".

### CA3

**Marca:** teste no Playwright

**Cenário 1 (sai):** Dado uma Pessoa logada, quando ela escolhe "Sair do Clenio", então termina em
`/entrar`, o cookie de sessão foi apagado, e a Sessão dela não existe mais no banco.

**Cenário 2 (outro navegador):** Dado a mesma Pessoa logada também num segundo contexto (outro
navegador), quando ela sai no primeiro, então o segundo continua na Home ao navegar para `/`.

**Cenário 3 (API fora do ar):** Dado uma Pessoa logada e a API do chat parada, quando ela escolhe
"Sair do Clenio", então o cookie é apagado do mesmo jeito e a Pessoa termina em `/entrar`. O
Playwright não alcança essa falha, porque a chamada à API é do servidor da web: o agente a verifica
com a API parada (`docker compose stop chat-api`), no Claude in Chrome, ou, sem a extensão, num
spec temporário do Playwright, como na T04, e registra em `verificacao-falha-ao-sair.md`.

**Teste previsto:** Playwright, `e2e/sair.spec.ts`, "sai pelo menu: leva a Entrar, apaga o cookie e
a Sessão" e "sair não derruba a Sessão de outro navegador". O cenário 3 é verificação do agente,
sem teste no repositório.

### CA4

**Marca:** teste no Playwright

**Cenário 1 (`no-store`):** Dado uma Pessoa logada, quando o teste abre `/`, então a resposta leva
`Cache-Control` com `no-store`.

**Cenário 2 (`pageshow`):** Dado a Home aberta e o cookie de sessão apagado, quando a página recebe
um `pageshow` com `persisted: true`, então ela recarrega e termina em `/entrar`; com `persisted:
false`, ela não recarrega (um marcador posto em `window` continua lá).

**Limite do cenário 1:** o `next dev` já responde `no-store` em toda página dinâmica, então o teste
não distingue o cabeçalho do proxy do padrão do Next. Quem revisa confere no diff que o proxy o
define para as telas logadas, e o teste guarda contra a perda dele.

**Teste previsto:** Playwright, `e2e/sair.spec.ts`, "responde as telas logadas com Cache-Control:
no-store" e "recarrega a Home no pageshow com persisted". O evento é disparado por
`page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true
})))`.

### CA5

**Marca:** revisão humana

**Cenário:** Dado o diff da tarefa, quando quem revisa abre `test/sessions.e2e-spec.ts`, então
encontra os casos do CA1 (uma requisição por Act, as Sessões criadas pelos atalhos de
`test/support/auth-routes.ts`), e o `pnpm test:e2e` passa no contêiner `chat-api`.

### CA6

**Marca:** teste no Playwright

**Cenário 1 (só teclado):** Dado uma Pessoa logada, quando o teste usa só `keyboard` (Tab, Enter),
abre o menu do avatar e escolhe "Sair do Clenio", então termina em `/entrar`.

**Cenário 2 (outra aba):** Dado a Pessoa logada em duas abas do mesmo contexto, quando ela sai na
primeira e a segunda navega para `/`, então a segunda termina em `/entrar`, sem mostrar a Home.

**Cenário 3 (histórico):** Dado que a Pessoa saiu, quando o teste volta pelo histórico
(`page.goBack()`), então termina em `/entrar` e o conteúdo da Home ("Clenio" e o Rail) não aparece.

**Teste previsto:** Playwright, `e2e/sair.spec.ts`, "sai só pelo teclado", "leva a outra aba a
Entrar na próxima navegação" e "voltar pelo histórico depois de sair não mostra a Home".

### CA7

**Marca:** revisão humana

**Cenário:** Dado a pasta desta tarefa, quando quem revisa abre `validacao-visual.md`, então
encontra o menu do avatar aberto, em 1440 × 900, nos temas claro e escuro, ao lado do
`get_screenshot` do frame "Casca / Menu do usuário / Disponível" (25:25749), e a conclusão. O
frame mostra o menu completo; a F01 tem só o cabeçalho e o "Sair do Clenio", então a comparação é
do trecho que existe, e as diferenças (sem presença, sem os outros itens) ficam listadas como
decisão da spec.

## Contrato

### API do chat: `DELETE /v1/sessions/current` · nova

Protegida pelo `SessionGuard`. Apaga a Sessão apresentada (a do cookie) e responde 204 sem corpo.
As outras Sessões da Pessoa não mudam. Sem cookie, com token desconhecido ou Sessão vencida,
responde 401 `unauthenticated` (a regra do guard). O snapshot do contrato (`openapi.json`) ainda é `planejada`;
a rota entra nele quando ele existir.

### BFF: Server Action de sair · nova

Chamada pelo item "Sair do Clenio" do UserMenu. Lê o token do cookie, chama `DELETE
/v1/sessions/current` pelo service da web, apaga o cookie e leva a `/entrar`. Se a chamada falhar
(rede, tempo esgotado, 5xx ou 401), o cookie é apagado do mesmo jeito e a Pessoa vai para
`/entrar`. Sem cookie, só leva a `/entrar`. Não é rota REST.

## Decisões

**API do chat**

- **Como o controller sabe qual Sessão apagar:** `SessionsService.verify` passa a devolver `{
  person, sessionId }`, o `SessionGuard` põe os dois em `request.auth`, e um decorator novo,
  `@AuthenticatedSessionId()`, lê o id (o `@AuthenticatedPerson()` continua igual). Motivo: o
  guard já leu a linha, e reler o cookie no controller repetiria a análise do cabeçalho.
  Alternativa descartada: apagar pelo hash do token, relendo o cookie.
- **Apagar:** `SessionsService.revoke(sessionId)`, um `DELETE` pelo id, sem erro se a linha já
  sumiu (duas saídas ao mesmo tempo da mesma Sessão não falham na segunda, que já foi barrada
  pelo guard com 401).
- **Resposta:** `@HttpCode(204)` e corpo vazio, no `SessionsController`, ao lado do `current`.

**Web**

- **Biblioteca:** `radix-ui` entra agora (`pnpm add radix-ui` no contêiner), como a stack de
  interface prevê para o primeiro componente que precisa (design system, "Stack de interface"). Só
  o `DropdownMenu` é usado.
- **Componentes:** `ui/dropdown-menu.tsx` (Client Component que embrulha o Radix, com o item de
  `h-8` e o destaque `sidebar-active`, como o design system descreve) e `workspace-nav/user-menu.tsx`
  (Client Component: o avatar como gatilho, o cabeçalho e o item "Sair do Clenio"). O `Rail` segue
  Server Component e recebe o `UserMenu` no lugar do `Avatar` solto. As classes saem do
  `get_design_context` do `UserMenu` (25:25750) e do item, só com tokens.
- **Gatilho:** o avatar vira um `<button>` (o Radix `Trigger` com `asChild`), com o nome
  acessível "Menu da conta de <nome>". O `Avatar` continua um `div` com `role="img"`, dentro do
  botão. Sem Tooltip na F01.
- **Server Action:** `src/app/(app)/actions.ts`, `signOut`. O item chama `signOut` dentro de
  `startTransition`, no `onSelect`. Motivo: o item do Radix mora num portal fora de qualquer
  `<form>`, então o `action` do formulário não serve.
- **Service HTTP:** `deleteCurrentSession(token)` em `chat-api.service.ts`. O `request` passa a
  aceitar resposta sem corpo (204), devolvendo `undefined`.
- **Falha ao sair:** o `signOut` captura qualquer erro da chamada e segue: o cookie é apagado de
  qualquer jeito. Não há log do erro com conteúdo (regra do projeto: sem tokens em log); a falha
  fica sem registro até a web ter um logger estruturado, e entra como pendência na tabela de
  questões em aberto do LLD, se ela ainda não existir. **Decisão a aprovar.**
- **`no-store`:** o `proxy.ts` define `Cache-Control: no-store` na resposta das telas logadas
  (todas as que ele atende com cookie), junto do cabeçalho `x-clenio-path` que a T05 já põe na
  requisição. Motivo: o proxy já roda em toda tela logada, e `/entrar` e a rota de encerrar ficam
  de fora pelo `matcher`, como hoje. Alternativa descartada: o `headers()` do `next.config.ts`
  (outro lugar para manter o mesmo padrão de rotas).
- **`pageshow`:** um Client Component pequeno, `workspace-nav/reload-on-restore.tsx`, montado no
  layout logado, escuta `pageshow` e chama `window.location.reload()` quando `event.persisted` é
  verdadeiro. Sem estado, só o efeito. O recarregamento passa pelo proxy: sem cookie, termina em
  `/entrar`.
- **Fixtures:** `e2e/fixtures.ts` ganha `countSessions(person)` (conta as linhas de Sessão da
  Pessoa) e uma fixture ou função para entrar num segundo contexto pelo formulário (`signInInNewContext`),
  que reaproveita o `signInThroughForm` que já é o único lugar que entra pela tela.
- **Testes:** `e2e/sair.spec.ts` é novo; o `e2e/a11y.spec.ts` ganha o caso do menu aberto.

## Arquivos e interfaces

API do chat (`apps/chat-api/`):
- `src/sessions/sessions.service.ts`: `verify` devolve `{ person, sessionId }`; `revoke`.
- `src/sessions/session.guard.ts`: `request.auth = { person, sessionId }`.
- `src/sessions/authenticated-session-id.decorator.ts` (novo).
- `src/sessions/sessions.controller.ts`: `DELETE current`.
- `test/sessions.e2e-spec.ts`: os casos do CA1.

Web (`apps/web/`):
- `package.json` e o lockfile: `radix-ui`.
- `src/app/components/ui/dropdown-menu.tsx` (novo).
- `src/app/components/workspace-nav/user-menu.tsx` (novo) e `reload-on-restore.tsx` (novo);
  `rail.tsx` usa o `UserMenu`.
- `src/app/(app)/actions.ts` (novo): `signOut`; `src/app/(app)/layout.tsx` monta o
  `ReloadOnRestore`.
- `src/app/services/chat-api.service.ts`: `deleteCurrentSession`, `request` com 204.
- `src/proxy.ts`: `Cache-Control: no-store`.
- `e2e/sair.spec.ts` (novo), `e2e/a11y.spec.ts`, `e2e/fixtures.ts`, `e2e/plano-de-testes.md`.
- `AGENTS.md`: a stack (`radix-ui` instalado), "Estrutura de pastas" (`(app)/actions.ts`,
  `dropdown-menu.tsx`, `user-menu.tsx`, `reload-on-restore.tsx`) e a lista dos Client Components.

Pasta da tarefa: `validacao-visual.md`, `verificacao-falha-ao-sair.md` e `capturas/`.

## Testes existentes que mudam

- `e2e/home.spec.ts`, "mostra o shell da Home com as iniciais da Pessoa": o avatar passa de
  `role="img"` solto para dentro de um botão. A conferência das iniciais continua valendo; se ela
  usar o papel `img` do avatar, passa a procurá-lo dentro do botão do menu.
- `test/sessions.e2e-spec.ts` e `src/accounts/accounts.int-spec.ts`: chamam `verify` só pelo
  resultado de erro ou por HTTP; se algum ler o retorno como `Person`, passa a ler `.person`.

## Mudança de dados

Nenhuma.

## Documentos atualizados

- `lld.md`, seção "Interfaces", índice das rotas: `DELETE /v1/sessions/current` passa a `existe`.
- `lld.md`, seção "Cliente", "Telas": a linha de `/` perde "(Sair: planejada)".
- `lld.md`, seção "Questões em aberto": a falha ao sair sem log, se aprovada como pendência. Pela
  skill `lld`, no modo atualizar, na entrega.
- `apps/web/AGENTS.md` e `design-system.md` ("Stack de interface": `radix-ui` instalado).
- Sem ADR: nenhuma decisão aqui muda arquitetura.
