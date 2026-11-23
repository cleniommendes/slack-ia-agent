# 07: Criar um Canal público por comando

**Status:** a fazer

**O que construir:** quem opera a instalação cria um Canal público pelo comando de contas, com um
nome, e o Canal aparece para todas as Pessoas na seção "Canais". Nome inválido ou já existente é
recusado com mensagem. Esta tarefa decide a regra do nome do Canal, que a F04 reaproveita.
Referências:
- spec da F02, "Conversas" (regra do nome) e "Comando de contas";
- spec da F01, "Comando de contas".

**Decisões consumidas de outras tarefas:**
- Tabela `conversations` e unicidade do nome: 01.
- Comando de contas e o jeito de testá-lo: F01-T03.

**Bloqueada por:** 01 (Abrir um Canal pela barra lateral e ler as mensagens recentes)

- [ ] **CA1** · O comando de contas tem a operação `create-channel`, que recebe o nome e cria o
  Canal público pelo mesmo service das rotas.
- [ ] **CA2** · O nome tem de 1 a 80 caracteres, só letras minúsculas sem acento, dígitos e hífen,
  e começa por letra ou dígito. Fora disso, o comando recusa com mensagem e não cria nada.
- [ ] **CA3** · Um nome que já existe, inclusive `geral`, é recusado com mensagem.
- [ ] **CA4** · O teste de integração do comando prova o nome válido, o inválido e o repetido.
- [ ] **CA5** · O Canal criado pelo comando aparece na seção "Canais", na ordem alfabética,
  verificado pelo agente com o `playwright-cli` e registrado na pasta desta tarefa.
- [ ] **CA6** · O `AGENTS.md` da API lista a operação `create-channel` na seção "Comandos".
