---
name: lld
description: Cria, revisa e atualiza o LLD (design de baixo nível). Use quando pedirem um LLD ou especificação técnica, e em qualquer tarefa que mude o que ele registra (regras, valores, estados, rotas, tabelas, variáveis de ambiente, decisões) ou entregue um item planejado.
---

# LLD por entrevista

**Qual modo usar e o que ler.** Leia sempre este arquivo, com as regras que valem nos três modos. Depois, leia só os arquivos do modo:

| Modo | Quando | Leia |
| --- | --- | --- |
| Criar | Pedido de um LLD novo | `references/criar.md` |
| Revisão | Pedido para revisar ou conferir o LLD inteiro | `references/revisao.md`, `references/criar.md` (as seções "Fontes", "A entrevista" e "Gravar") |
| Atualizar | Uma mudança pontual no meio de outra tarefa (um prazo novo, uma rota implementada, uma regra que o código mudou), sem rodada de abertura nem entrevista | `references/atualizar.md` |

A revisão só começa a pedido do usuário.

O molde está em `assets/lld.md`: o comentário de cada seção diz o que escrever e com que detalhe, e guia os três modos.

O LLD diz **como cada parte funciona por dentro**, no nível que deixa programar sem adivinhar, com o motivo das escolhas. Que partes existem, como conversam e por quê é do HLD.

## Fronteiras

**Com o HLD.** São do HLD as partes (contêineres, integrações externas), como conversam e com que protocolo, onde rodam, os requisitos de qualidade e as decisões que mudam o desenho. São daqui, ou do artefato que o LLD aponta:

- schema do banco e contrato das rotas
- estrutura de pastas e bibliotecas (a versão só quando ela é uma decisão)
- variáveis de ambiente e valores de regra
- máquinas de estado e regras de negócio
- dependências entre peças internas
- comportamento do cliente e o modo como a API responde a cada caso

Na dúvida: se a informação muda quando o código é refatorado sem mudar o desenho, é daqui. Uma frase do HLD que não pode ser construída como está escrita vai para a lista "Para o HLD", e a solução de implementação entra aqui.

**Com outros documentos.** Comandos e instalação são do README ou do guia do projeto (`AGENTS.md`); cores, componentes e microtexto, do design system; escopo e público, dos documentos de produto.

Um fato de outro documento entra aqui como ponteiro para a seção dele, pelo título. Se o documento ainda não o tem, guarde o trecho na lista "Para o HLD" ou "Para outros documentos" (com o destino), mostrada no resumo final, e não edite esse documento; no modo atualizar, veja as convenções de `references/atualizar.md`. Uma parte do LLD que depende de um item de "Para o HLD" leva a marca "(depende de mudança no HLD)".

## Artefatos donos

O que um artefato conferido por máquina já expressa (o snapshot do contrato, o schema do banco, o schema das variáveis) tem dono, e o LLD não o repete: uma cópia sem conferência diverge sem aviso.

- **Forma do que existe** (colunas, campos, status, tipo e padrão de variável): um ponteiro por tema, sem lista.
- **Convenção de todos os itens** (nomes, ids, paginação, corpo do erro) e **comportamento que o artefato não descreve:** escritos aqui, uma vez.
- **Resumo para orientar** (diagrama ER, índice de rotas): só nomes e relações.
- **O que ainda não existe:** a forma fica aqui, `planejada`, até o artefato recebê-la; aí ela sai e fica o ponteiro.

Sem artefato para um tipo de fato, o LLD é o dono e diz isso no mapa "Onde mora cada fato". Não escreva frase de desempate ("se divergir, vale o snapshot"): tire a cópia. Um valor de regra que chega por variável com padrão no schema é decidido na tabela de valores, e o padrão tem de ser igual a ele.

## Quanto detalhar

O LLD guarda o que ninguém mais guarda: regras, mecanismos e decisões, com o porquê. Quem desenha a forma de um item planejado é o ticket que o implementa, direto no artefato. Por isso, proponha essa forma só com base no HLD, nos documentos de referência ou numa resposta do usuário; sem base, o item entra com o nome, a Situação `a detalhar` e o comportamento que se sabe. Um número sem base não se propõe: pergunte. Uma forma inventada e aprovada de passagem parece decidida sem ser e envelhece antes de existir.

## Situação

Módulo, tabela, rota, tela e tarefa levam a marca "Situação": `existe`, `planejada` ou `a detalhar`. O estado da implementação mora só nela: frases como "hoje o código tem" ou "ainda não existe" envelhecem sem aviso e viram regra do sistema, marca no item ou linha em "Questões em aberto". Uma regra legítima ("o upload ainda não foi concluído") fica.

## Um fato, um lugar

Cada valor de regra tem um dono só, a tabela de "Valores e configuração": o resto do documento o cita pelo nome, e o número só se repete no rótulo de uma transição de diagrama. Cada regra e cada mecanismo também moram numa seção só, e as outras apontam para ela. Ponteiros citam a seção pelo título, e não só pelo número, que muda quando o documento é reorganizado. Uma regra absoluta desmentida por uma pendência em "Questões em aberto" precisa ser qualificada.

Escreva cada regra de forma que um teste possa prová-la: a condição, o resultado e o caso de borda, com o porquê quando ele não for óbvio.

## "A definir"

As únicas seções opcionais são "Cliente" e "Ambiente de desenvolvimento", apagadas só quando o usuário responde "não se aplica". Quando uma resposta falta e o usuário não confirmou uma proposta sua, não invente nem deixe em branco: escreva "A definir" e acrescente a pendência em "Questões em aberto". As decisões com porquê ou consequências a definir entram lá numa linha só, com os números.

## Decisões e ADRs

Uma decisão vira ADR só quando passa nos três testes:

1. Difícil de reverter: mudar de ideia depois custa caro.
2. Alguém sem o contexto perguntaria por quê, ou proporia o contrário.
3. Houve uma escolha real: alternativas sérias, e um motivo para a escolhida.

A que não passa fica só no texto da seção em que se aplica, ou na tabela de bibliotecas da seção 1, com o porquê numa linha. O ADR fica em `docs/adr/NNNN-slug.md`, a partir do molde `assets/adr.md`. A numeração é uma só para o HLD e o LLD: o próximo número é o maior da pasta mais um. A seção Decisões do documento é o índice dos ADRs dele. Uma decisão trocada não se edita: o ADR antigo passa a `status: substituída por NNNN`, e o novo entra com número novo. Um porquê ou um custo que falta fica "a definir" no ADR, com a pendência em Questões em aberto.

## Diagramas

Mermaid: `stateDiagram-v2` em entidade com mais de dois estados, com o evento em cada transição; `erDiagram` só com entidades e relações; `flowchart` para as dependências permitidas entre peças; `sequenceDiagram` quando a ordem dos passos importa. Todo diagrama tem título em negrito acima e legenda curta abaixo, e toda seta tem rótulo, inclusive a que termina em `[*]`.

## Na conversa

Vale em todos os modos e também fora deles, quando o usuário pergunta sobre o documento. O terminal quebra tabelas largas e mostra o Mermaid como código, então a forma do arquivo fica no arquivo, e a conversa usa o que se lê no terminal:

- Alternativas nunca vão em tabela. Cada uma é um item de lista: a letra e o nome numa linha, "Prós:" e "Contras:" nas linhas de baixo.
- Uma tabela só aparece para o conteúdo que vai para o documento, e só se couber na largura do terminal (poucas colunas, células curtas). Se não couber, cada linha dela vira um item de lista ("1. API: monólito modular em NestJS · descartada: vários serviços").
- Diagramas não vão como código Mermaid: viram lista, uma seta, transição ou relação por linha, com o rótulo ("pendente → pago: pagamento confirmado"). O Mermaid é montado da lista confirmada e só vai para o arquivo. Numa mudança, mostre só as linhas que mudam, com o antes e o depois.

Fontes do molde: SWEBOK v4 (detailed design), IEEE 1016 (pontos de vista), arc42 (visão de blocos, visão de execução, conceitos transversais), C4 model, "Design Docs at Google" (Malte Ubl), OpenAPI Initiative ("Keep a Single Source of Truth") e ADRs de Michael Nygard.
