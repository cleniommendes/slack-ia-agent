# Verificação da falha no envio (F01-T04, CA3)

**Como foi feita:** a extensão Claude in Chrome não estava disponível nesta sessão (como na T03).
O agente usou o Playwright (Chromium, headless, 1440 × 900) no contêiner `e2e`, com um spec
temporário que não entra no repositório, contra a web em desenvolvimento e **com a API do chat
parada** (`docker compose stop chat-api`). A Pessoa é a da fixture `person`, com e-mail
`e2e-…@teste.local`.

**O que foi conferido**

| Passo | Resultado |
| --- | --- |
| Preencher e-mail e senha e enviar com Enter na Senha | A tela mostra "Não foi possível entrar agora. Confira sua conexão e tente de novo." |
| A mensagem | Fica entre a Senha e o botão, em `#form-error`, com `role="alert"` |
| Campos | O e-mail continua preenchido, e a Senha também (13 caracteres, como digitada) |
| Mensagem de credenciais incorretas | Não aparece |
| `aria-invalid` | Nenhum campo o recebe: nenhum campo está errado, só o envio falhou |
| Foco, envio por Enter | Continua na Senha |
| Foco, envio pelo clique no botão | O botão fica desabilitado durante o envio e o navegador o deixa sem foco (`body`). Corrigido: ao chegar a falha, o foco volta a quem o tinha antes do envio (o botão) |
| Endereço | Continua em `/entrar` |

As capturas, nos dois temas, estão em `capturas/entrar-falha-no-envio-light.png` e
`capturas/entrar-falha-no-envio-dark.png`.

**Fora do que a verificação prova:** o 5xx e o tempo esgotado caem no mesmo ramo do Server Action
(`actions.ts`: `ChatApiError` e `ChatApiUnavailableError`) e não foram provocados. A API parada
prova o ramo da falha de rede.

**Aceite:** o usuário aceitou esta verificação, feita pelo Playwright, no lugar do Claude in Chrome.
