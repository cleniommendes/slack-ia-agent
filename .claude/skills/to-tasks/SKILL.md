---
name: to-tasks
description: Quebra um plano, uma spec ou a conversa atual em tarefas tracer bullet, cada uma declarando as tarefas que a bloqueiam, publicadas no tracker configurado (bloqueios como texto, num arquivo por tarefa, em arquivos locais, ou como vínculos nativos num tracker de verdade).
disable-model-invocation: true
---

# To Tasks

Quebre um plano, uma spec ou uma conversa em **tarefas**: fatias verticais tracer bullet, cada uma declarando as tarefas que a **bloqueiam**.

O issue tracker e o vocabulário de rótulos de triagem vêm das instruções do projeto. Se elas não disserem, pergunte ao usuário. Se o projeto indicar um tracker que o agente não tem ferramenta para acessar, diga isso e pergunte se pode publicar em arquivos locais.


## Processo

### 1. Reunir o contexto

Trabalhe com o que já está no contexto da conversa. Se o usuário passar uma referência como argumento (o caminho de uma spec, o número ou a URL de uma issue), busque-a e leia o corpo inteiro e os comentários.

### 2. Explorar o código (opcional)

Se você ainda não explorou o código, explore para entender o estado atual dele. Os títulos e as descrições das tarefas devem usar o vocabulário do glossário de domínio do projeto e respeitar as ADRs da área que você está tocando.

Procure oportunidades de refatorar antes (prefactoring) para facilitar a implementação. "Torne a mudança fácil e depois faça a mudança fácil."

### 3. Rascunhar as fatias verticais

Quebre o trabalho em tarefas **tracer bullet**.

<vertical-slice-rules>

- Cada fatia corta um caminho estreito, mas COMPLETO, por todas as camadas (schema, API, interface, testes): vertical, e NÃO uma fatia horizontal de uma camada só
- Uma fatia concluída pode ser demonstrada ou verificada sozinha
- Cada fatia tem o tamanho de uma única janela de contexto nova
- Toda refatoração prévia vem primeiro

</vertical-slice-rules>

Dê a cada tarefa os seus **bloqueios**: as outras tarefas que precisam estar concluídas antes de ela começar. Uma tarefa sem bloqueios pode começar imediatamente.

**Procure decisões compartilhadas.** Os bloqueios dizem o que pode começar; não dizem o que pode rodar ao mesmo tempo. Duas tarefas sem bloqueio entre elas podem ter de tomar a mesma **decisão**: o mesmo campo, a mesma regra, o mesmo formato de contrato. Cada uma a toma do seu jeito, as duas passam nos próprios testes, e a integração quebra. Então, entre as tarefas sem bloqueio entre si, procure as decisões que mais de uma delas teria de tomar e dê a cada uma um destino:

- mover a decisão para uma **tarefa anterior** que bloqueia as que a usam (a tarefa anterior decide uma vez, e as outras consomem a decisão), ou
- **encadear** as tarefas, quando tirar a decisão não vale uma tarefa própria.

O critério de paralelismo é a decisão, e não a área. Duas tarefas que mexem no mesmo arquivo ou módulo, sem decisão em comum, ainda podem rodar em paralelo: o conflito de texto se resolve na integração. Não dê a uma tarefa caminhos de arquivo exclusivos ou proibidos.

**Refatorações amplas são a exceção ao fatiamento vertical.** Uma **refatoração ampla** é uma mudança mecânica (renomear uma coluna, mudar o tipo de um símbolo compartilhado) cujo **raio de impacto** se espalha pelo código inteiro, de modo que uma única edição quebra milhares de pontos de chamada de uma vez e nenhuma fatia vertical consegue entrar com tudo verde. Não force isso numa tracer bullet; organize em **expandir–contrair**. Primeiro expanda: acrescente a forma nova ao lado da antiga, para nada quebrar. Depois migre os pontos de chamada em lotes do tamanho do raio de impacto (por pacote, por pasta), cada lote uma tarefa bloqueada pela expansão, mantendo a CI verde de lote em lote, porque a forma antiga ainda existe. Por fim contraia: apague a forma antiga quando não restar quem a chame, numa tarefa bloqueada por todos os lotes de migração. Quando nem os lotes conseguem ficar verdes sozinhos, mantenha a sequência, mas deixe-os compartilhar uma branch de integração, todos bloqueando uma tarefa final de integrar e verificar; o verde só é prometido ali.

### 4. Questionar o usuário

Apresente a quebra proposta como uma lista numerada. Para cada tarefa, mostre:

- **Título**: um nome curto e descritivo
- **Bloqueada por**: que outras tarefas (se houver) precisam estar concluídas antes
- **O que entrega**: o comportamento de ponta a ponta que esta tarefa faz funcionar

Depois, mostre o que os bloqueios permitem:

- as **ondas**, calculadas a partir dos bloqueios: as tarefas que podem começar juntas, onda a onda;
- a **tabela de decisões compartilhadas**: uma linha por decisão, com as tarefas que a tomariam e o destino dela (uma tarefa anterior que bloqueia as outras, ou o encadeamento das tarefas).

Pergunte ao usuário:

- A granularidade parece certa? (grossa demais / fina demais)
- Os bloqueios estão corretos: cada tarefa depende só das tarefas que de fato a impedem de começar?
- O destino de cada decisão compartilhada está certo?
- Alguma tarefa deveria ser juntada a outra ou dividida mais?

Repita até o usuário aprovar a quebra.

Uma mudança numa tarefa repercute nas outras. Quando uma tarefa é juntada, dividida, removida ou reordenada, confira de novo antes de mostrar a quebra: os bloqueios que apontam para ela ou saem dela, as decisões compartilhadas que ela possui ou consome, e as ondas. Uma junção herda os bloqueios e as decisões das duas tarefas e descarta o bloqueio entre elas; uma divisão atribui cada bloqueio e cada decisão a uma das metades, e, quando as duas metades precisam da mesma decisão, uma a possui e bloqueia a outra.

### 5. Publicar as tarefas no tracker configurado

Publique as tarefas aprovadas. **Como** depende do tracker que o projeto usa; as tarefas são as mesmas nos dois casos, e só a forma dos bloqueios muda:

- **Arquivos locais** → escreva um arquivo por tarefa em `.scratch/<slug-da-funcionalidade>/issues/<NN>-<slug>.md`, numerados a partir de `01` na ordem de dependência (as que bloqueiam primeiro). O "Bloqueada por" de cada arquivo lista os números/títulos de que ela depende. Use o molde de arquivo por tarefa abaixo: uma tarefa por arquivo, nunca um arquivo único com todas.
- **O issue tracker do projeto** → publique uma issue por tarefa na ordem de dependência (as que bloqueiam primeiro), para os bloqueios de cada tarefa poderem citar identificadores reais. Use o vínculo de bloqueio nativo da plataforma, quando ela tiver; senão, preencha o "Bloqueada por" de cada tarefa com as issues que a bloqueiam. Se a origem foi uma issue existente, torne cada tarefa uma sub-issue dela (operação do documento do tracker). Aplique o rótulo de triagem `ready-for-agent`, salvo instrução em contrário; as tarefas são, por construção, prontas para um agente pegar.

NÃO feche nem modifique nenhuma issue pai.

<local-task-template>

# <NN>: <Título da tarefa>

**O que construir:** o comportamento de ponta a ponta que esta tarefa faz funcionar, do ponto de vista do usuário, e não uma lista de implementação camada por camada.

**Decisões consumidas de outras tarefas:** opcional. Cada decisão que esta tarefa consome sem tomar, numa linha, com o número/título da tarefa que a possui. Omita o campo quando a tarefa não consome decisão de outra.

**Bloqueada por:** os números/títulos das tarefas que impedem esta de começar, ou "Nenhuma (pode começar imediatamente)".

**Status:** ready-for-agent

- [ ] **CA1** · Critério de aceite 1
- [ ] **CA2** · Critério de aceite 2

</local-task-template>

<issue-template>

## Pai

Uma referência à issue pai no tracker (se a origem foi uma issue existente; senão, omita esta seção).

## O que construir

O comportamento de ponta a ponta que esta tarefa faz funcionar, do ponto de vista do usuário, e não a implementação camada por camada.

## Decisões consumidas de outras tarefas

Opcional. As decisões que esta tarefa consome sem tomar e a tarefa que possui cada uma. Omita a seção quando a tarefa não consome decisão de outra.

- A decisão, numa linha, e uma referência à tarefa que a possui.

## Critérios de aceite

- [ ] **CA1** · Critério 1
- [ ] **CA2** · Critério 2

## Bloqueada por

- Uma referência a cada tarefa que a bloqueia, ou "Nenhuma (pode começar imediatamente)". Omita esta seção quando os bloqueios foram registrados como vínculos nativos.

</issue-template>

Num critério, `CA<n>` é um ID estável: não muda quando a tarefa é editada, e o ID de um critério removido não é reaproveitado.

Nas duas formas, evite caminhos de arquivo e trechos de código específicos: eles envelhecem rápido. Exceção: se um protótipo produziu um trecho que registra uma decisão com mais precisão do que a prosa (máquina de estados, reducer, schema, forma de um tipo), coloque-o no texto e diga, em poucas palavras, que ele veio de um protótipo. Corte até as partes que carregam decisões, e não uma demonstração que funciona: só o essencial.
