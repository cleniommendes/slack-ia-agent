---
name: implement
description: "Implementa uma tarefa a partir do commit de plano dela: tdd com os testes previstos no plano, commit, revisões, conferência do fim da tarefa, verificação completa e, quando o usuário pede, o pull request."
disable-model-invocation: true
---

Implemente uma tarefa, nesta sessão e nesta branch. A tarefa é o `tarefa.md` que o usuário indica no prompt, pelo caminho ou pelo par funcionalidade e tarefa (como `F01-T02`). Se a indicação for ambígua, pergunte.

## Passos

1. **Tarefa e plano.** Ache o `tarefa` e o `plano`, e diga o título da tarefa antes de começar. Pare, dizendo o motivo, quando:
   - o plano não está em commit (`git log --oneline -- <plano>` não mostra nenhum): peça `/plan-task` antes;
   - uma tarefa de "Bloqueada por" ainda não está concluída.

   O plano está congelado: nunca o edite.

2. **Construir.** Chame a skill `tdd`, passando os critérios do plano: a marca, o cenário e o teste previsto de cada `CA<n>`. Uma tarefa sem critério com marca de teste não passa pela `tdd`: entregue cada critério como o cenário dele descreve. Durante o trabalho, rode só os testes ligados aos arquivos que você mudou, com os comandos do `AGENTS.md` de cada projeto. O arquivo e o nome de um teste podem mudar em relação ao plano, que os dá como previsão.

3. **Escalar, sem decidir.** Pare e pergunte quando a implementação:
   - precisa de uma decisão que não está na tarefa nem no plano e que outra tarefa em andamento também tomaria, ou precisa mudar algo que outra tarefa em andamento usa. As decisões que a tarefa consome, e a tarefa dona de cada uma, estão em "Decisões consumidas de outras tarefas";
   - mostra que um critério, um item do contrato ou uma decisão do plano precisa mudar. Não mude o texto do critério nem o plano: a correção aprovada vai para a spec, o LLD ou uma tarefa nova (`AGENTS.md`, "Planejamento").

4. **Commit.** Com o trabalho pronto, faça o commit na branch atual, sem push.

5. **Revisar.** Chame a skill `simplify` e depois a `code-review`. Corrija o que você aceitar das duas e faça o commit das correções.

6. **Conferir.** Faça a conferência da tarefa conforme está descrito nas regras do projetos. O que diverge é corrigido no código ou levado ao usuário.

7. **Atualizar os registros.** Num commit:
   - quando a tarefa entregou um item que o LLD ou o HLD marcam como planejado, ou mudou algo que eles registram, carregue a skill `lld` ou `hld` no modo atualizar;
   - no `tarefa.md`, marque as caixas dos critérios e mude o Status para "concluída": o merge do PR é o que conclui a tarefa;
   - se esta é a última tarefa da funcionalidade ainda não concluída, passe a funcionalidade a "concluída" no `docs/roadmap.md`.

8. **Verificar.** Rode a verificação completa uma vez, em segundo plano, e nunca num subagente: o subagente fica com os testes do que mudou, e a verificação completa é de quem fecha a tarefa. Se ela levar a correções, faça o commit delas e rode de novo.

9. **Entregar, quando o usuário pedir.** Com a verificação completa aprovada, pare e diga que o trabalho está pronto, mostrando o corpo do PR. O corpo tem uma seção "Critérios", com um item por `CA<n>`: nas marcas de teste, o teste que prova o critério; na revisão humana e no documento, o que quem revisa olha e onde. Os registros da tarefa (roteiro manual, medição, capturas) ficam na pasta dela, e o corpo aponta para eles. Não faça push nem abra o PR antes de o usuário pedir (como "suba a PR"). Quando ele pedir, faça um `git push` simples e abra o PR com esse corpo. Não faça o merge: ele é decisão do usuário.
