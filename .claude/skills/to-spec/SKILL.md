---
name: to-spec
description: "Transforma a conversa atual numa spec e a publica no issue tracker do projeto: sem entrevista, só a síntese do que já foi discutido."
disable-model-invocation: true
---

Esta skill pega o contexto da conversa atual e o entendimento do código e produz uma spec. NÃO entreviste o usuário; só sintetize o que você já sabe.

O issue tracker e o vocabulário de rótulos de triagem vêm das instruções do projeto. Se elas não disserem, pergunte ao usuário.

## Processo

1. Explore o repositório para entender o estado atual do código, se ainda não explorou. Use o vocabulário do glossário de domínio do projeto em toda a spec e respeite as ADRs da área que você está tocando.

2. Esboce os pontos de teste (seams) em que você vai testar a funcionalidade. Prefira os pontos que já existem a criar novos. Use o ponto mais alto possível. Se forem necessários pontos novos, proponha-os no ponto mais alto que conseguir. Quanto menos pontos de teste no código, melhor: o número ideal é um.

Confirme com o usuário que esses pontos de teste correspondem ao que ele espera.

3. Escreva a spec usando o molde abaixo e publique-a no issue tracker do projeto. Aplique o rótulo de triagem `ready-for-agent`, sem precisar de outra triagem.

<spec-template>

## Problema

O problema que o usuário enfrenta, do ponto de vista dele.

## Solução

A solução para o problema, do ponto de vista do usuário.

## Histórias de usuário

Uma lista numerada e longa de histórias de usuário que cubra todos os aspectos da funcionalidade. Cada história segue o formato:

1. Como <ator>, quero <recurso>, para <benefício>

<user-story-example>
1. Como cliente de um banco pelo celular, quero ver o saldo das minhas contas, para tomar decisões mais bem informadas sobre os meus gastos
</user-story-example>

## Decisões de implementação

Uma lista das decisões de implementação tomadas. Pode incluir:

- Os módulos que serão construídos ou modificados
- As interfaces desses módulos que serão modificadas
- Esclarecimentos técnicos de quem desenvolve
- Decisões de arquitetura
- Mudanças de schema
- Contratos de API
- Interações específicas

NÃO inclua caminhos de arquivo nem trechos de código específicos. Eles podem ficar desatualizados muito rápido.

Exceção: se um protótipo produziu um trecho que registra uma decisão com mais precisão do que a prosa (máquina de estados, reducer, schema, forma de um tipo), coloque-o dentro da decisão a que se refere e diga, em poucas palavras, que ele veio de um protótipo. Corte até as partes que carregam decisões, e não uma demonstração que funciona: só o essencial.

## Decisões de teste

Uma lista das decisões de teste tomadas. Inclua:

- Uma descrição do que faz um bom teste (testar só o comportamento externo, e não detalhes de implementação)
- Quais módulos serão testados
- Exemplos anteriores para os testes (ou seja, testes parecidos que já existem no código)

## Fora de escopo

Uma descrição do que fica fora do escopo desta spec.

## Observações

Outras observações sobre a funcionalidade.

</spec-template>
