# Plano da F01-T04: Erros de preenchimento e falha no envio ao entrar

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

## Critérios

### CA1

**Marca:** teste no Playwright

**Cenário 1:** Dado a tela Entrar aberta, quando a Pessoa envia com o e-mail vazio, e depois com um
e-mail fora do formato (`ana@`), então a mensagem "Informe um e-mail válido, como
nome@empresa.com." aparece abaixo do E-mail, e nenhum POST de login sai.

**Cenário 2:** Dado a tela Entrar com um e-mail válido, quando a Pessoa envia com a Senha vazia,
então "Informe sua senha." aparece abaixo da Senha, e nenhum POST sai.

**Cenário 3:** Dado o E-mail e a Senha vazios, quando a Pessoa envia, então as duas mensagens
aparecem juntas.

**Cenário 4 (mesma validação no servidor):** Dado o JavaScript do navegador desligado
(`javaScriptEnabled: false`), quando a Pessoa envia o formulário vazio, então a página volta com as
mesmas mensagens, sem entrar. É o que prova que o Server Action também valida, com o mesmo schema.

**Teste previsto:** Playwright, `e2e/entrar.spec.ts`, "mostra a mensagem do e-mail vazio e do e-mail
fora do formato sem enviar", "mostra a mensagem da senha vazia sem enviar", "mostra as duas
mensagens juntas" e "valida também no servidor, sem JavaScript". O "nenhum POST" é contado por
`page.route('**/entrar')` com o método `POST`, como no teste do envio duplo.

### CA2

**Marca:** teste no Playwright

**Cenário 1:** Dado o formulário vazio, quando a Pessoa envia, então o foco vai para o E-mail (o
primeiro campo inválido).

**Cenário 2:** Dado um e-mail válido e a Senha vazia, quando a Pessoa envia, então o foco vai para
a Senha.

**Cenário 3:** Dado um campo com erro, então ele tem `aria-invalid="true"` e `aria-describedby`
igual ao `id` da mensagem abaixo dele; o campo sem erro não tem nenhum dos dois.

**Teste previsto:** Playwright, `e2e/entrar.spec.ts`, "foca o primeiro campo inválido" e "liga o
campo com erro à mensagem por aria-invalid e aria-describedby". O vínculo é lido pelo
`toHaveAttribute`, e o texto da mensagem é conferido pelo `getByRole('textbox', { name: 'E-mail' })`
com `toHaveAccessibleDescription`.

### CA3

**Marca:** verificação do agente (Claude in Chrome)

**Cenário:** Dado uma Pessoa de teste, a web e o banco de pé e a API do chat parada
(`docker compose stop chat-api`), quando o agente preenche e-mail e senha e envia, então a tela
mostra "Não foi possível entrar agora. Confira sua conexão e tente de novo." entre a Senha e o
botão, num elemento com `role="alert"`, o e-mail e a senha continuam preenchidos, e o foco não
muda de onde estava (o botão, que recebeu o clique). A mensagem de credenciais incorretas não
aparece. Com a API de volta (`docker compose start chat-api`), o mesmo envio entra.

**Como o 5xx e o tempo esgotado são cobertos:** a API parada prova o ramo da falha de rede. Os
outros dois caem no mesmo `catch` do Server Action (o 5xx como `ChatApiError` com `status >= 500`
e o tempo esgotado como `TimeoutError` do `AbortSignal.timeout`), e quem revisa os confere em
`actions.ts` e em `chat-api.service.ts`. O Playwright não prova nada disso porque o `fetch` roda no
servidor da web, onde `page.route` não alcança.

**Registro:** `verificacao-falha-no-envio.md` e a captura `capturas/entrar-falha-no-envio-*.png`
na pasta da tarefa.

### CA4

**Marca:** revisão humana

**Cenário:** Dado o arquivo do Figma (`plW17JDOoRHydUJIIi2u87`), quando quem revisa abre a seção
Login da página Telas, então encontra o frame "Login / Falha no envio", montado só com instâncias
dos componentes locais e variables, com a mensagem entre a Senha e o botão e os campos
preenchidos. A tela do código, comparada com o `get_screenshot` desse frame, bate (CA7 registra a
comparação). O frame existe **antes** do código da tela, e o commit que muda a tela vem depois da
criação do frame.

### CA5

**Marca:** teste no Playwright

**Cenário:** Dado a tela Entrar recém-aberta (foco no E-mail), quando o teste digita o e-mail,
aperta Tab, digita a senha, aperta Tab, então o foco passa pelo E-mail, pela Senha e pelo botão
"Entrar", nessa ordem, sem outro elemento no meio; e com o foco na Senha, Enter envia e a Pessoa
chega à Home.

**Teste previsto:** Playwright, `e2e/a11y.spec.ts`, "percorre E-mail, Senha e o botão com Tab e envia
com Enter". Só `keyboard.press` e `keyboard.type`, sem `click` nem `fill`.

### CA6

**Marca:** teste no Playwright

**Cenário 1:** Dado o CA1, o CA2 e o CA5 acima, então passam no Playwright.

**Cenário 2:** Dado a tela Entrar, quando o teste roda o `@axe-core/playwright` nela, e nela com as
mensagens de validação visíveis, então não há violações.

**Cenário 3:** Dado uma Pessoa logada (`loggedInPage`), quando o teste roda o axe na Home, então não
há violações.

A falha no envio do CA3 é verificada pelo agente, e não pelo Playwright (CA3).

**Teste previsto:** Playwright, `e2e/a11y.spec.ts`, "a tela Entrar não tem violações do axe", "a
tela Entrar com erros de validação não tem violações do axe" e "a Home não tem violações do axe".
O axe roda com as tags `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`.

### CA7

**Marca:** revisão humana

**Cenário 1 (Lighthouse):** Dado a tela Entrar, quando uma pessoa roda o Lighthouse (Chrome
DevTools, categoria Acessibilidade, modo desktop) com o ambiente local de pé, então a nota é 100, e
o roteiro e o resultado ficam em `roteiro-manual.md` na pasta da tarefa. O agente prepara o roteiro
e a pessoa registra a nota.

**Cenário 2 (validação visual):** Dado a pasta da tarefa, quando quem revisa abre
`validacao-visual.md`, então encontra, para "Erro de validação" (19:1336) e "Falha no envio" (o
frame criado no CA4), as capturas em 1440 × 900, no tema claro e no escuro, ao lado do
`get_screenshot` do frame, e a conclusão de cada par.

## Contrato

### BFF: Server Action de entrar · muda

Hoje devolve `{ error: 'invalid_credentials' | null, email }` e deixa estourar qualquer outro erro.
Passa a devolver sempre um estado, e a única saída que não devolve estado é o `redirect('/')` do
sucesso.

| Campo do estado | Tipo | Significado |
| --- | --- | --- |
| `error` | `'invalid_credentials' \| 'unavailable' \| null` | Erro do formulário (abaixo da Senha, ou entre a Senha e o botão). `null` sem erro. |
| `fieldErrors` | `{ email?: string; password?: string }` | Mensagem de cada campo inválido, só com as três chaves de texto fixo do PRD. Vazio sem erro de validação. |
| `email` | texto | O e-mail digitado, para a tela voltar com ele preenchido. |

| Entrada | Saída |
| --- | --- |
| E-mail vazio ou fora do formato, ou Senha vazia | `fieldErrors` preenchido, `error: null`; nenhuma chamada à API |
| 401 `invalid_credentials` | `error: 'invalid_credentials'` |
| Falha de rede, tempo esgotado, 5xx, ou 4xx que a validação deveria ter barrado | `error: 'unavailable'` |
| 429 `too_many_attempts` | fora desta tarefa (T08); até lá, cai no `unavailable` |
| 201 | grava o cookie e `redirect('/')` |

Mensagens (texto fixo, do PRD e da tarefa):
- `fieldErrors.email`: "Informe um e-mail válido, como nome@empresa.com."
- `fieldErrors.password`: "Informe sua senha."
- `error: 'unavailable'`: "Não foi possível entrar agora. Confira sua conexão e tente de novo."

Sem rota nova, sem mudança na API do chat.

## Decisões

- **Um schema para o cliente e o servidor:** `entrar/sign-in-schema.ts`, com zod (já na web, em
  `config/env.ts`), exporta `signInSchema` e `validateSignIn(email, password)`, que devolve
  `fieldErrors`. O formulário (Client Component) e o Server Action importam o mesmo arquivo, sem
  `'use server'` nem `'use client'` nele. O e-mail é aparado antes de validar (`trim`) e validado
  com `z.email()`; a Senha vazia é só `''`, sem aparar (espaço em senha conta). Vazio e fora do
  formato têm a mesma mensagem, como o PRD. Limites de tamanho (254 e 256, da API) não ganham
  mensagem própria: o campo ganha `maxLength`, e o que passar disso pelo servidor cai no
  `unavailable`.
- **`noValidate` no formulário:** o `type="email"` faz o navegador mostrar o balão nativo e barrar o
  envio antes do nosso código. O `<form>` leva `noValidate`, e a validação é só a nossa, com o
  texto e o foco do design.
- **Quando o cliente valida:** no `onSubmit`, com `event.preventDefault()` se houver erro, antes de
  o `useActionState` receber o envio. Com JavaScript desligado, o `action` do formulário envia, e o
  Server Action valida (cenário 4 do CA1). Os dois caminhos mostram as mesmas mensagens.
- **Campos preenchidos depois de uma falha:** o React 19 reseta o formulário quando o Server Action
  termina, e hoje o e-mail volta por `defaultValue={state.email}`. A Senha também precisa
  continuar preenchida na falha no envio (CA3), e limpa nas credenciais incorretas (T03, CA9).
  Decisão: E-mail e Senha viram controlados (`useState`), o reset do navegador não os apaga, a Senha
  é zerada pelo próprio componente quando o estado volta `invalid_credentials`, e o `state.email` do
  estado fica só para o caminho sem JavaScript. **Risco:** se o reset do formulário apagar um
  controlado no React 19, a alternativa é trocar `action={formAction}` por um `onSubmit` que chama
  o Server Action dentro de `startTransition` (o `useActionState` não reseta nesse caminho). O teste
  do CA3, rodado pelo agente, é o que decide.
- **Foco:** um `useEffect` por `state` e `clientErrors` foca o primeiro campo inválido (E-mail antes
  de Senha). Credenciais incorretas continuam focando a Senha (T03). Na falha no envio o foco não
  é movido: o `role="alert"` é anunciado sem tirar o foco do botão.
- **Mensagem do formulário:** um componente novo, `ui/form-message.tsx` (Server Component, sem
  estado), com o `role="alert"` e o estilo `danger` da mensagem do Field, para a T08 reaproveitar
  com outro texto. O nome e as classes saem do frame "Login / Falha no envio" criado no CA4; se o
  Figma o desenhar como outro componente existente, usa-se esse e o `form-message.tsx` não nasce.
- **Onde a mensagem fica:** entre o Field da Senha e o botão, dentro do `<form>`, com `id` fixo
  (`form-error`). Os campos não ganham `aria-invalid` na falha no envio, porque nenhum campo
  está errado; só a mensagem é anunciada.
- **`aria-describedby` e `aria-invalid` dos campos:** o `Field` já deriva o `id` da mensagem de
  `htmlFor` (`email-error`, `password-error`). O formulário passa `invalid` e o
  `aria-describedby` só quando o campo tem erro, para o E-mail também (hoje só a Senha tem).
- **Falha de rede, 5xx e tempo esgotado:** o `request` do service passa
  `signal: AbortSignal.timeout(CHAT_API_TIMEOUT_MS)`, com a constante em
  `chat-api.service.ts` e **10 000 ms** como valor proposto. O service passa a lançar um
  `ChatApiUnavailableError` para falha de rede e tempo esgotado (o `TypeError` do `fetch` e o
  `TimeoutError`), e o 5xx continua como `ChatApiError` com `status`. O Server Action trata os
  três como `unavailable`. O layout logado, que chama o mesmo service, continua com o erro padrão
  do Next até a T09; o novo erro só dá nome ao que já estourava.
- **Teste do axe nas duas telas:** `e2e/a11y.spec.ts` nasce aqui, com Entrar e Home (a linha
  "Teclado e acessibilidade" do plano de testes). As telas das próximas tarefas acrescentam os
  casos delas ao mesmo arquivo.
- **Figma:** o frame "Login / Falha no envio" é criado pela `use_figma`, com instâncias dos
  componentes e das variables locais, **antes** do código da tela (spec, "BFF e telas"). O
  "Login / Erro de validação" (19:1336) já existe e só é lido com o `get_design_context`. O frame
  "Tentativas demais" é da T08. O arquivo é `plW17JDOoRHydUJIIi2u87`; a T03 leu uma cópia
  (`slack-ai-study`) porque o 19:1399 ainda não estava renomeado, então o primeiro passo é conferir
  no arquivo original se a renomeação existe.
- **Roteiro e verificação do agente:** a API é parada e religada com `docker compose stop chat-api`
  e `docker compose start chat-api`, e a aba do Claude in Chrome é nova, contra
  `http://localhost:3000`, com uma Pessoa de teste (`apps/web/AGENTS.md`).

## Arquivos e interfaces

Web (`apps/web/`):
- `src/app/entrar/sign-in-schema.ts` (novo): `signInSchema`, `validateSignIn`, as três mensagens.
- `src/app/entrar/actions.ts`: valida, trata o `unavailable`, devolve `fieldErrors`;
  `SignInState` ganha `fieldErrors` e `'unavailable'`.
- `src/app/entrar/entrar-form.tsx`: `noValidate`, campos controlados, validação no `onSubmit`,
  foco no primeiro campo inválido, `aria-invalid` e `aria-describedby` nos dois campos, a mensagem
  do formulário.
- `src/app/components/ui/form-message.tsx` (novo, salvo o que o Figma indicar no CA4).
- `src/app/services/chat-api.service.ts`: `AbortSignal.timeout`, `ChatApiUnavailableError`.
- `e2e/entrar.spec.ts`: os casos do CA1 e do CA2.
- `e2e/a11y.spec.ts` (novo): CA5 e CA6.
- `e2e/plano-de-testes.md`: as linhas "Erros de preenchimento e falha no envio" e "Teclado e
  acessibilidade" passam a `feito (T04)` (a segunda, para Entrar e Home).
- `AGENTS.md` (web): "Estrutura de pastas" (`sign-in-schema.ts`, `form-message.tsx`).

Pasta da tarefa: `verificacao-falha-no-envio.md`, `roteiro-manual.md`, `validacao-visual.md` e
`capturas/`.

## Testes existentes que mudam

- `e2e/entrar.spec.ts`, "mostra a mensagem, limpa a senha, foca a senha e mantém o e-mail com
  credenciais incorretas": continua valendo. Se os campos controlados mudarem o jeito de limpar a
  Senha, o teste não muda; é o código que se ajusta.
- `e2e/entrar.spec.ts`, "bloqueia o segundo envio e mostra o botão carregando": preenche um e-mail
  válido, então a validação do cliente não o barra. Não muda.
- Os `fill` de e-mail das fixtures usam o formato `e2e-<uuid>@teste.local`, que o `z.email()`
  aceita. Se o zod recusar o domínio `.local`, o schema troca para uma expressão própria, e o
  teste do CA1 inclui esse e-mail como caso válido.

## Mudança de dados

Nenhuma.

## Documentos atualizados

- `lld.md`, seção "Valores e configuração": o tempo máximo da chamada da web à API do chat (10 s),
  se o usuário aprovar o valor. Pela skill `lld`, no modo atualizar, na entrega.
- `lld.md`, seção "Cliente": a validação do formulário de entrar (mesmo schema no cliente e no
  servidor) só entra se a seção hoje descrever o formulário; confere-se na entrega.
- `apps/web/AGENTS.md`: a estrutura de pastas (acima).
- Sem ADR: nenhuma decisão aqui muda arquitetura.
