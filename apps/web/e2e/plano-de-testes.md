# Plano de testes da F01 (Login e sessão)

Spec: [spec.md](../../../.claude/docs/funcionalidades/01-login-e-sessao/spec.md), seção "Decisões de
teste". A spec é dona do que é coberto; este plano é dono dos passos de cada cenário. Escrito pelo
fluxo da skill `playwright-cli` (explorar a tela a partir do teste-semente, planejar, gerar e
corrigir), no contêiner `e2e`, com a web em `pnpm dev`.

**Base:** `e2e/fixtures.ts` (`person` cria a Pessoa no banco `chat` com e-mail `e2e-<uuid>@teste.local`;
`loggedInPage` entra pelo formulário). Cada teste cria a própria Pessoa. O teste-semente é
`e2e/seed.spec.ts`, que abre `/entrar`.

**O que a exploração de `/entrar` mostrou** (`playwright-cli snapshot`): `main` > título "Entrar no
Full Cycle" (h1), campo `textbox "E-mail"` (com foco ao abrir), `textbox "Senha"` e `button "Entrar"`.
Os seletores dos testes usam rótulo e papel, nunca classes.

## Cenários

Situação: `feito` (existe em `e2e/`) ou a tarefa da F01 que o entrega.

| Cenário                                 | Passos                                                                                                                    | Arquivo          | Situação                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------ |
| Entrar com sucesso                      | Abrir `/entrar`; preencher e-mail e senha da `person`; "Entrar"; esperar `/`                                              | `entrar.spec.ts` | feito (T03)                    |
| Cookie de sessão                        | Entrar; ler os cookies do contexto: `HttpOnly`, `SameSite=Lax`, `Path=/`, sem `Secure`, validade de ~400 dias             | `entrar.spec.ts` | feito (T03)                    |
| Foco inicial                            | Abrir `/entrar`; o E-mail tem o foco                                                                                      | `entrar.spec.ts` | feito (T03)                    |
| Envio duplo                             | Atrasar o POST; "Entrar"; Enter na Senha; o botão fica desabilitado e carregando; só um POST sai                          | `entrar.spec.ts` | feito (T03)                    |
| Credenciais incorretas                  | Senha errada; mensagem abaixo da Senha; Senha vazia e com o foco; e-mail mantido                                          | `entrar.spec.ts` | feito (T03)                    |
| Sem cookie                              | Abrir `/` sem cookie; termina em `/entrar`                                                                                | `sessao.spec.ts` | feito (T03)                    |
| Sessão desconhecida                     | Cookie com token que a API não conhece; abrir `/`; termina em `/entrar` e o cookie some                                   | `sessao.spec.ts` | feito (T03)                    |
| Shell da Home                           | Logada: Rail com "FC", "Início" ativo e iniciais; Sidebar "Clenio"; estado vazio                                          | `home.spec.ts`   | feito (T03)                    |
| Tokens e fonte                          | Tema claro por padrão, escuro só com `data-theme="dark"`, Lato                                                            | `tokens.spec.ts` | feito (T02)                    |
| Erros de preenchimento e falha no envio | E-mail vazio ou inválido, senha vazia; falha de rede no envio                                                             | `entrar.spec.ts` | F01-T04                        |
| `?para=`                                | Abrir endereço logado sem sessão; entrar; cair nele; `//outro-site` cai na Home                                           | `para.spec.ts`   | F01-T05                        |
| Continuar logada                        | Segunda aba; reabrir o navegador num contexto com os cookies; logada abre `/entrar` e vai à Home                          | `sessao.spec.ts` | F01-T06                        |
| Sair                                    | Menu do avatar; "Sair do Clenio"; leva a `/entrar`; outra aba vai a `/entrar` na próxima ação; voltar não mostra conteúdo | `sair.spec.ts`   | F01-T07                        |
| Tentativas demais                       | 5 falhas; a seguinte mostra o aviso; a senha certa também é recusada                                                      | `entrar.spec.ts` | F01-T08                        |
| Erro de sessão                          | API fora do ar: "Não foi possível verificar sua sessão" e "Tentar de novo"                                                | `sessao.spec.ts` | F01-T09                        |
| Teclado e acessibilidade                | Fluxo só por teclado; `@axe-core/playwright` em Entrar e Home sem violações                                               | `a11y.spec.ts`   | F01-T03 a T09, conforme a tela |

Os testes de revogação e de tempo mexem nas linhas do banco no Arrange, como na API.
