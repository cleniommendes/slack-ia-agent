# Plano da F01-T05: Voltar para onde ia

Tarefa: [tarefa.md](tarefa.md) · Spec: [spec.md](../../spec.md) · PRD: [prd.md](../../prd.md)

**Ordem de trabalho:** esta tarefa muda `entrar-form.tsx` e `actions.ts`, que a
[F01-T04](../04-erros-de-preenchimento-e-falha-no-envio/tarefa.md) também mudou (PR #4). A
implementação começa depois que a T04 for mesclada na `main`; o plano só mexe em documentos.

## Critérios

### CA1

**Marca:** teste no Playwright

**Cenário 1 (proxy, sem cookie):** Dado um contexto sem cookie, quando o teste abre
`/conversas/abc?x=1`, então termina em `/entrar?para=%2Fconversas%2Fabc%3Fx%3D1`, e a busca do
endereço (`?x=1`) está dentro do `para`.

**Cenário 2 (layout, com 401):** Dado um cookie com um token que a API não conhece, quando o teste
abre `/?foo=bar` (uma tela logada que existe), então termina em `/entrar?para=%2F%3Ffoo%3Dbar`, e o
cookie foi apagado.

**Cenário 3 (Home não leva `para`):** Dado um contexto sem cookie, quando o teste abre `/`, então
termina em `/entrar`, sem `para`: a Home é o destino padrão.

**Teste previsto:** Playwright, `e2e/para.spec.ts`, "leva a Entrar com o caminho pedido e a busca,
sem cookie", "leva a Entrar com o caminho pedido quando a API responde 401" e "não leva o para
quando o endereço pedido é a Home".

### CA2

**Marca:** teste no Playwright

**Cenário 1:** Dado `/entrar?para=%2F%3Ffoo%3Dbar` e uma Pessoa de teste, quando ela entra pelo
formulário, então termina em `/?foo=bar`.

**Cenário 2:** Dado `/entrar` sem `para`, quando ela entra, então termina em `/`.

**Cenário 3:** Dado `/entrar?para=//outro-site`, `?para=https://outro-site` e
`?para=/%5Coutro-site` (a barra invertida, que o navegador lê como `//`), quando ela entra, então
termina em `/`, sempre no `web:3000`.

**Cenário 4 (o servidor não confia no campo):** Dado `/entrar` aberta e o campo escondido `para`
trocado no navegador por `//outro-site` antes do envio, quando ela entra, então termina em `/`. É
o que prova que o Server Action valida de novo o valor, e não só a página.

**Teste previsto:** Playwright, `e2e/para.spec.ts`, "cai no endereço pedido depois de entrar", "cai
na Home sem para", "cai na Home com um para que não é do chat" (um caso por valor) e "valida o para
também no Server Action".

### CA3

**Marca:** teste no Playwright

**Cenário 1:** Dado uma Pessoa logada (`loggedInPage`), quando o teste abre `/entrar`, então
termina em `/`.

**Cenário 2:** Dado um cookie com um token que a API não conhece, quando o teste abre `/entrar`,
então o formulário aparece em `/entrar`, e o cookie foi apagado.

**Cenário 3:** Dado o mesmo cookie e `/entrar?para=%2F%3Ffoo%3Dbar`, então o formulário aparece e
o `para` continua na barra de endereço, para o login seguinte cair onde a Pessoa queria.

**Teste previsto:** Playwright, `e2e/sessao.spec.ts`, "leva quem já está logada de Entrar para a
Home", "mostra o formulário e apaga o cookie quando a API não reconhece a Sessão" e "mantém o para
ao apagar o cookie de uma Sessão desconhecida".

### CA4

**Marca:** teste no Playwright

**Cenário:** Dado o `pnpm dev` de pé, quando se roda o Playwright no contêiner `e2e`, então passam
os testes dos CA1 a CA3: entrar por um link profundo e cair nele, `?para=//outro-site` e
`?para=https://outro-site` caindo na Home, e quem está logado abrindo `/entrar` indo para a Home. A
suíte inteira da web continua passando.

**Teste previsto:** Playwright, `e2e/para.spec.ts` e `e2e/sessao.spec.ts`. Só a Home existe como
tela logada, então o link profundo "de verdade" é `/?foo=bar`; o caminho `/conversas/abc?x=1`, que
ainda não existe, prova o proxy pela URL de Entrar (o teste não confere a página 404 em que a
Pessoa cairia).

## Contrato

### BFF: `GET /api/sessao/encerrar` · muda

Hoje apaga o cookie e responde 307 para `/entrar`. Passa a aceitar `?para=<caminho>` e a responder
307 para `/entrar?para=<caminho>`, quando o caminho é válido (regra em "Decisões"); sem `para` ou
com um inválido, responde 307 para `/entrar`, como hoje. Continua sem ler nem validar a Sessão.

### BFF: Server Action de entrar · muda

Recebe, além de `email` e `password`, o campo `para` (escondido no formulário, só com um caminho já
validado pela página). Com 201, grava o cookie e leva ao `para`, depois de validá-lo de novo; sem
ele, ou com um inválido, leva a `/`.

### Tela Entrar · muda

`/entrar?para=<caminho>`: com cookie, a página verifica a Sessão. 200 leva a `/` (o `para` não
vale para quem já está logada); 401 leva a `/api/sessao/encerrar?para=<caminho>`, que apaga o
cookie e volta a `/entrar` com o mesmo `para`; falha de rede ou 5xx mostra o formulário.

## Decisões

- **Regra do caminho de volta:** `utils/return-path.ts`, uma função pura, `safeReturnPath(value)`,
  que devolve o caminho ou `null`. Vale o texto que começa com `/`, não começa com `//` e (além do
  LLD) não contém `\` nem caracteres de controle (`\r`, `\n`, `\t`). Motivo: o navegador lê `/\x`
  como `//x`, e quebras de linha podem abrir brecha em cabeçalho. O LLD, "Cliente", ganha essa
  linha. **Decisão a aprovar:** a regra do LLD fala só de `/` e `//`.
- **Montar o endereço de Entrar:** a mesma peça, `signInPath(path)`, devolve `/entrar` ou
  `/entrar?para=<encodeURIComponent(path)>`. O proxy, a rota de encerrar e a página de Entrar usam
  só ela. A Home (`/`) e um caminho inválido não levam `para`.
- **O layout descobre o caminho pelo proxy:** um Server Component não tem a URL. O proxy, que roda
  em toda tela logada, copia `pathname + search` para um cabeçalho da requisição
  (`x-clenio-path`, constante em `utils/return-path.ts`) com `NextResponse.next({ request: { headers } })`,
  sobrescrevendo o que o navegador mandar. O layout o lê com `headers()` dentro do `Suspense` (como
  já lê o cookie) e o valida com `safeReturnPath` antes de usar. Alternativas descartadas: ler a
  URL pelo cliente (o layout é de servidor e redireciona antes de qualquer script) e um segmento de
  rota dinâmico (cada tela futura teria de repeti-lo).
- **Rota de encerrar:** continua a única rota do navegador fora de Server Action (decisão da
  T03). Só ganha o parâmetro.
- **Entrar com cookie:** a verificação mora num componente assíncrono dentro de `<Suspense>` na
  página (`cacheComponents` obriga, como no layout logado), que lê `searchParams` e o cookie. Com
  200, `redirect('/')`; com 401, `redirect` para a rota de encerrar com o `para`; com falha de
  rede, 5xx ou tempo esgotado, mostra o formulário, porque a Pessoa não fica presa numa tela de
  erro para entrar. O LLD não diz o que fazer nesse caso: a linha entra em "Cliente", "Sessão no
  cliente". **Decisão a aprovar.**
- **Campo escondido `para`:** a página valida o `searchParams` com `safeReturnPath` e passa o
  resultado ao `EntrarForm`, que o põe num `<input type="hidden" name="para">`. O Server Action
  valida o valor de novo, porque o campo vem do navegador.
- **Destino após entrar:** `redirect(safeReturnPath(para) ?? '/')` no Server Action. O `redirect`
  recebe sempre um caminho relativo já validado, então não sai do domínio.
- **Testes:** `e2e/para.spec.ts` (novo, nome já previsto no plano de testes da F01); os casos do
  CA3 vão para o `e2e/sessao.spec.ts`, onde mora a verificação da Sessão. As fixtures `person` e
  `loggedInPage` bastam. O teste da barra invertida abre `/entrar?para=/%5Coutro-site` (a barra
  invertida codificada, para o Playwright não a normalizar).

## Arquivos e interfaces

Web (`apps/web/`):
- `src/app/utils/return-path.ts` (novo): `safeReturnPath(value)`, `signInPath(path)`,
  `REQUEST_PATH_HEADER`.
- `src/proxy.ts`: redireciona para `signInPath(pathname + search)` sem cookie e, com cookie,
  copia o caminho para `x-clenio-path`.
- `src/app/(app)/layout.tsx`: com 401, redireciona para a rota de encerrar com o `para` lido do
  cabeçalho.
- `src/app/api/sessao/encerrar/route.ts`: lê `para` e redireciona para `signInPath(para)`.
- `src/app/entrar/page.tsx`: lê `searchParams`, verifica a Sessão quando há cookie, passa o
  `para` ao formulário (dentro de um `Suspense`).
- `src/app/entrar/entrar-form.tsx`: o campo escondido `para`.
- `src/app/entrar/actions.ts`: valida o `para` e redireciona a ele.
- `e2e/para.spec.ts` (novo) e `e2e/sessao.spec.ts`.
- `e2e/plano-de-testes.md`: a linha "`?para=`" passa a `feito (T05)`, e a de "Continuar logada"
  ganha o caso de `/entrar` logada, que a T06 não precisa repetir.
- `AGENTS.md` (web): "Estrutura de pastas" (`return-path.ts`) e o parágrafo do `?para=` com a regra
  completa.

## Testes existentes que mudam

- `e2e/sessao.spec.ts`, "leva a Entrar sem cookie" e "leva a Entrar e apaga o cookie quando a API
  não reconhece a Sessão": abrem `/`, que não leva `para`, então a conferência `/\/entrar$/`
  continua valendo. Não mudam.
- `e2e/entrar.spec.ts`: o fluxo de entrar sem `para` continua caindo em `/`. Não muda.

## Mudança de dados

Nenhuma.

## Documentos atualizados

- `lld.md`, seção "Interfaces", índice das rotas: a linha "BFF: `GET /api/sessao/encerrar`" passa a
  dizer que aceita `?para=`.
- `lld.md`, seção "Cliente", "Sessão no cliente": a regra do caminho de volta ganha a busca do
  endereço, a Home sem `para`, a barra invertida e os caracteres de controle, e "Entrar, aberta com
  cookie" ganha o caso da falha de rede. Pela skill `lld`, no modo atualizar, na entrega.
- `apps/web/AGENTS.md`: a estrutura de pastas e a regra do `?para=`.
- Sem ADR: nenhuma decisão aqui muda arquitetura.
