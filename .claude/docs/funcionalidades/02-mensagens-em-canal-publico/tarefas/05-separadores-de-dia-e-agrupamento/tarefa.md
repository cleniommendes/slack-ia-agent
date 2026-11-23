# 05: Separadores de dia e agrupamento

**Status:** a fazer

**O que construir:** no histórico de um Canal, a Pessoa vê um separador a cada dia ("Hoje",
"Ontem" ou a data), no fuso do navegador dela, e as mensagens seguidas do mesmo autor aparecem
agrupadas, sem repetir o nome e o avatar. Referências:
- spec da F02, "BFF e telas" (Lista de mensagens);
- PRD, história 6.

**Decisões consumidas de outras tarefas:**
- Lista de mensagens no cliente e MessageItem acessível: 01.

**Bloqueada por:** 01 (Abrir um Canal pela barra lateral e ler as mensagens recentes)

- [ ] **CA1** · Um DayDivider marca cada dia do histórico, com "Hoje", "Ontem" ou a data, no fuso
  do navegador da Pessoa.
- [ ] **CA2** · Uma mensagem do mesmo autor da anterior, com até 5 minutos de diferença e no mesmo
  dia, aparece como MessageItem `compact`. Com mais de 5 minutos, de outro autor ou depois de um
  DayDivider, aparece como `full`.
- [ ] **CA3** · Uma mensagem `compact` continua com o nome acessível formado pelo autor e pelo
  horário, mesmo sem mostrar o nome na tela.
- [ ] **CA4** · O agrupamento e os separadores valem também para as mensagens que entram por
  envio e, quando a tarefa 04 estiver pronta, para as páginas anteriores.
- [ ] **CA5** · O Playwright prova os separadores "Hoje", "Ontem" e data, com mensagens
  envelhecidas no Arrange, e o agrupamento com até 5 minutos e a quebra com mais.
- [ ] **CA6** · A validação visual do histórico com separadores e mensagens agrupadas, em
  1440 × 900 nos dois temas, está registrada na pasta desta tarefa.
