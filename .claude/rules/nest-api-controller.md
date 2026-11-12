---
paths:
  - "apps/chat-api/src/**/*.controller.ts"
---

O controller adapta o HTTP: recebe a requisição, valida a entrada pelo DTO, chama o service e devolve o resultado. Ele não decide nada.

- **Uma chamada de service que realiza mudança no sistema por rota**: cada rota que altera o estado do sistema deve chamar um único método de service que execute a mudança. Services para consulta podem ser chamados para ajudar na preparação ou validação dos dados, mas a alteração principal deve ser feita por um único método de service.
- **Nunca o repository.** O controller não injeta repository, nem o do próprio módulo.
- **Não lança erro.** O controller não lança erro de nenhum tipo, nem `HttpException` (`NotFoundException`, `BadRequestException` etc.). Quem decide que algo deu errado é o service, com um erro de domínio. O erro sobe até o exception filter, que monta a resposta.
- **`try/catch` só para efeito colateral do próprio controller,** como registrar algo ou liberar um recurso aberto na rota. No fim, o `catch` relança o mesmo erro: não devolve valor, não troca o erro por outro e não monta resposta com `res.status(...).json(...)`.


