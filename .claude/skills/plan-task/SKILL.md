---
name: plan-task
description: "Planeja uma tarefa para aprovação antes de implementá-la: o contrato que ela cria e como cada critério de aceite será provado. Use ao começar uma tarefa, antes de escrever código de produção."
disable-model-invocation: true
---

Planeje uma tarefa, indicada pelo caminho do arquivo ou pelo par funcionalidade e tarefa (como `F01-T02`). O plano existe para uma pessoa aprovar, antes de existir código, o contrato que a tarefa cria e como cada critério será provado. Por isso você para no fim sem commitar.

Os moldes estão em `formatos/`: o plano e as regras dos critérios (`plano.md`) e o contrato de rotas, eventos e tabelas (`contrato.md`).

## Passos

1. **Contexto.** Ache a tarefa e a pasta da funcionalidade dela. Leia a tarefa, a `spec.md`, o `prd.md`, o `GLOSSARY.md`, as seções do HLD e do LLD e as ADRs que a tarefa toca, e o código que ela vai mudar. Pare, dizendo o motivo, quando:
   - uma tarefa de "Bloqueada por" ainda não está concluída;
   - a funcionalidade não tem `spec.md`, porque o plano executa decisões da spec e não as toma;
   - o plano desta tarefa já está em commit (`git log --oneline -- <plano>` mostra algum commit): ele está congelado, e só o usuário o descongela.

   Se o plano existe mas não está em commit, é uma rodada anterior que não foi aprovada: revise e corrija esse plano em vez de começar outro.

2. **Critérios.** Todo critério da tarefa tem um ID `CA<n>`: dê ID aos que não têm, continuando a numeração, e não renumere os que já têm. Não mude o texto de um critério por conta própria. Quando ele ficou desatualizado em relação aos documentos (descreve uma regra que um documento já mudou), proponha a correção como decisão em aberto e só altere a tarefa depois da aprovação. Para cada critério, escreva no plano a marca, o cenário e o teste previsto, como diz `formatos/plano.md`.

3. **Contrato.** Escreva no plano cada rota, evento e tabela que a tarefa cria, muda ou remove, no formato de `formatos/contrato.md`. Não edite à mão os donos do contrato que o LLD lista em "Onde mora cada fato": eles são gerados a partir do código, e a primeira geração apagaria a edição. Depois, escreva a seção "Verificação do contrato", dizendo que critério prova cada item.

4. **Documentos.** Quando a tarefa muda algo que o LLD ou o HLD registram, a atualização entra no commit de plano, para os documentos descreverem a regra nova antes de o código existir. Liste no plano, em "Documentos atualizados", o que mudou em cada documento.

5. **Parar.** Não faça commit.
   1. Mude o Status da tarefa para "em andamento".
   2. No chat, mostre só o caminho do plano e as decisões em aberto. O resto está no arquivo, e repetir no chat cria duas versões para revisar.
   3. Espere a aprovação. A revisão chega no chat, citando um `CA<n>` ou uma seção. Depois de cada mudança pedida, corrija o plano e mostre de novo o que ainda está em aberto.

6. **Commit de plano.** Só depois da aprovação, e sem nenhuma decisão em aberto no plano. Confira com `git status --short` que entram só o plano, a tarefa e os documentos atualizados, e faça o commit com a mensagem `docs: planeja <o que a tarefa entrega> (F<NN>-T<NN>)` e as linhas de atribuição do projeto. As decisões e os arquivos já estão no plano, e a mensagem não os repete.
