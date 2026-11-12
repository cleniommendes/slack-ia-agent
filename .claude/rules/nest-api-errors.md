---
paths:
  - "apps/chat-api/src/**/*.service.ts"
  - "apps/chat-api/src/**/*.repository.ts"
  - "apps/chat-api/src/**/*.guard.ts"
  - "apps/chat-api/src/**/*.error.ts"
  - "apps/chat-api/src/common/errors/**"
---

# Erros da API

Todo retorno de erro sai do exception filter global. Nenhum outro lugar monta resposta de erro.

- **No service e no guard:** uma regra violada lança um erro de domínio, uma classe própria que carrega o `code` estável do contrato (`not_a_member`, `rate_limit_exceeded`) e os dados do caso. O erro não sabe o status HTTP. O `AuthGuard`, que lança `UnauthenticatedError`, é o exemplo do guard.
- **No exception filter:** a resposta HTTP de erro é desenhada num único lugar, o filter global de `src/common/errors/`. Ele traduz o erro de domínio em status e corpo `application/problem+json`, e é ali que mora o mapa de `code` para status.
- **Erro de domínio:** estende `DomainError`, de `src/common/errors/`, e fica no módulo dono da regra. Um `code` novo entra na mesma tarefa no tipo `ErrorCode` e no mapa de status do filter. A mensagem do erro vai para o campo `detail` da resposta, então não traz detalhes internos.
- **Erro inesperado:** o filter registra em log e responde 500, sem expor mensagem interna nem stack trace. Isso vale também para o erro de uma biblioteca que traz um `statusCode` próprio: o filter só aceita o status de uma `HttpException` e dos erros do leitor do corpo do Express.
- **Erro de fornecedor/camada de infraestrutura:** erros gerados por bibliotecas externas ou pela camada de infraestrutura, como registro inexistente, 404, falha de conexão ou timeout. Esses erros não são tratados como de domínio e são capturados pelo filter como erros inesperados.

