# 01: Base da API do chat

**Status:** a fazer

**O que construir:** a API do chat deixa de ser o esqueleto do Nest e passa a ter a base de que
toda funcionalidade precisa:
- a configuração validada na subida;
- o acesso ao Banco do chat com migrações;
- o formato único de erro;
- a base dos testes de ponta a ponta com banco real.

Nenhum comportamento de produto ainda: o que se verifica é a API subindo, recusando configuração
inválida e respondendo erro no formato do contrato. Referências:
- spec da F01, "Base que a F01 monta";
- LLD, "Conceitos transversais de implementação" ("Configuração" e "Erros"), "Dados" e "Ambiente
  de desenvolvimento".

**Bloqueada por:** Nenhuma (pode começar imediatamente)

- [ ] **CA1** · A configuração da API é lida e validada uma vez na subida, com zod. Sem uma
  variável obrigatória, como `DATABASE_URL`, o processo falha na subida com o nome da variável na
  mensagem. Nenhum outro ponto do código lê o ambiente direto.
- [ ] **CA2** · A API conecta no Banco do chat pelo TypeORM, com migrações versionadas no
  repositório e comandos para gerar, rodar e reverter migrações. A estratégia de nomes converte
  para `snake_case`, e os ids são UUID v7 gerados na aplicação.
- [ ] **CA3** · O erro de domínio base, o tipo dos códigos de erro e o filter global estão
  registrados no módulo raiz, como pede a rule de erros da API. A validação de entrada também
  está registrada no módulo raiz.
- [ ] **CA4** · Uma rota inexistente responde 404 em `application/problem+json`, com o `code`.
  Um erro inesperado responde 500 sem mensagem interna nem stack trace, e fica registrado em log.
- [ ] **CA5** · Os testes de ponta a ponta rodam contra o banco `chat_test`. Ele é criado pelo
  script de inicialização do Postgres e, num volume que já existe, pelo `globalSetup`, que também
  roda as migrações.
- [ ] **CA6** · A base de testes oferece `createTestApp()` e `uniqueEmail()`, e um teste de ponta
  a ponta prova o CA4 com essa base.
- [ ] **CA7** · O `AGENTS.md` da API traz os comandos de migração e a observação do banco de
  testes.
- [ ] **CA8** · `lint`, `tsc` e as três suítes de teste passam no contêiner.
