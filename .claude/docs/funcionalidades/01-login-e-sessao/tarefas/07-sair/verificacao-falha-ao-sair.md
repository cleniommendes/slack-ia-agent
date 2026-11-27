# Verificação da falha ao sair (F01-T07, CA3)

**Como foi feita:** a extensão Claude in Chrome não estava disponível nesta sessão (como nas T03 e
T04). O agente usou o Playwright (Chromium, headless) no contêiner `e2e`, com um spec temporário
que não entra no repositório. A Pessoa é a da fixture `person`, com e-mail `e2e-…@teste.local`.

**Roteiro:** o spec entra pelo formulário e abre o menu do avatar com a API no ar, avisa por um
arquivo que está pronto, e o agente para a API (`docker compose stop chat-api`). Só então o spec
escolhe "Sair do Clenio". Assim a chamada `DELETE /v1/sessions/current` do Server Action falha de
verdade (a API fora do ar), e o resto da tela já estava carregado.

**Resultado**

| Conferência | Resultado |
| --- | --- |
| A Pessoa termina em | `http://web:3000/entrar` |
| Cookies do contexto depois de sair | nenhum (o `clenio_session` foi apagado) |
| A tela mostra erro de saída | não: a falha da API é engolida de propósito |

**Limites:** a verificação cobre a falha de rede (API parada). O 5xx e o tempo esgotado caem no
mesmo `catch` do `signOut` (`src/app/(app)/actions.ts`), que não distingue o erro, e não foram
provocados. A Sessão fica no banco até vencer, ou até o `revoke-sessions` ou o
`purge-expired-sessions` do comando de contas.
