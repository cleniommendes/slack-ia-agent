---
name: hld
description: Cria, revisa e atualiza o HLD (arquitetura de alto nível). Use quando pedirem um HLD ou documento de arquitetura, e em qualquer tarefa que mude o que ele registra: contêineres, integrações, protocolos, ambientes, requisitos, decisões de arquitetura.
---

# HLD por entrevista

**Qual modo usar e o que ler.** Leia sempre este arquivo, com as regras que valem nos três modos. Depois, leia só os arquivos do modo:

| Modo | Quando | Leia |
| --- | --- | --- |
| Criar | Pedido de um HLD novo | `references/criar.md` |
| Revisão | Pedido para revisar ou conferir o HLD inteiro | `references/revisao.md`, `references/criar.md` (as seções "Fontes", "A entrevista" e "Gravar") |
| Atualizar | Uma mudança pontual no meio de outra tarefa (uma integração trocada, um requisito novo, um ambiente que muda), sem rodada de abertura nem entrevista | `references/atualizar.md` |

A revisão só começa a pedido do usuário.

O molde está em `assets/hld.md`: cada seção tem um comentário HTML com a orientação do que escrever e do nível de detalhe. Essas orientações servem para guiar a criação, revisão e atualização do HLD, garantindo consistência e clareza no documento.

O HLD diz **como o sistema é organizado e por quê**: as partes, como conversam, os fluxos que pesam no desenho e as decisões com as alternativas descartadas. O detalhe de implementação é do LLD.

## Fronteira com o LLD

O HLD fica no nível de "que partes existem, como conversam e por quê". São do nível de implementação, no LLD ou no artefato que ele aponta:

- contrato da API
- schema do banco
- estrutura de pastas
- bibliotecas (e a versão quando ela é uma decisão)
- variáveis de ambiente
- máquinas de estado
- regras de dependência entre peças internas
- comportamento do cliente (rotas e telas, sessão no navegador, reação a erros)
- detalhe de cada regra de negócio


Também são do LLD os valores de regra (limites, prazos, tamanhos de página), que só entram no HLD quando são critério de qualidade ou motivo de uma decisão, e o modo como a API responde a cada caso (o que devolve para o item de outro dono, para onde vai o item restaurado, a ordem dos passos internos). Comandos e passo a passo de instalação não são de nenhum dos dois: são do README ou do guia do projeto (`AGENTS.md`). Na dúvida, pergunte-se se a informação muda quando o código é refatorado sem mudar o desenho: se muda, é do LLD.

Quando o usuário trouxer um detalhe do nível de implementação:

- Se o LLD informado já o tem, escreva no HLD um ponteiro para a seção dele, e não a lista.
- Se não tem, ou não há LLD, guarde o detalhe numa lista "Para o LLD", mostrada no resumo final, e escreva no HLD só a frase de nível alto que ele sustenta. Não edite o LLD: ele é de outro processo. No modo atualizar é diferente: veja as convenções de `references/atualizar.md`.

## Um fato, um lugar

Cada fato fica numa seção só, e as outras citam a decisão ou a seção: um mecanismo de segurança não é descrito ao mesmo tempo no fluxo, no conceito transversal e na decisão. Um fato que é de outro documento recebe um ponteiro pelo título da seção ("detalhes no LLD, seção \"XXX\""), e não pelo número, que muda quando o documento é reorganizado; um ponteiro por tema basta.

Uma afirmação absoluta ("todos os dados ficam no Brasil") desmentida por uma pendência em "Questões em aberto" (logs que podem sair do país) é uma contradição: qualifique a afirmação.

Escreva o que o sistema é, e não o estado da implementação num dia: frases como "hoje o código tem seis serviços" ou "ainda não" envelhecem sem aviso. Reescreva-as como o que o sistema é, ou leve a pendência para "Questões em aberto" ou "Riscos e dívida técnica".

## Seções e "A definir"

A única parte opcional é a tabela de stakeholders, apagada só quando o usuário responde "não se aplica".

Quando uma resposta falta (o usuário disse "a definir" ou "não sei", ou ela nunca foi dada) e ele não confirmou uma proposta sua, não invente um valor nem deixe a seção em branco: escreva "A definir", com essa grafia (em prosa, "a definir" no meio da frase), e acrescente uma linha em "Questões em aberto" dizendo o que precisa ser decidido ou pesquisado. Vale também para o porquê e as consequências de uma decisão.

## Decisões e ADRs

Uma decisão vira ADR só quando passa nos três testes:

1. Difícil de reverter: mudar de ideia depois custa caro.
2. Alguém sem o contexto perguntaria por quê, ou proporia o contrário.
3. Houve uma escolha real: alternativas sérias, e um motivo para a escolhida.

A que não passa fica só no texto da seção em que se aplica. O ADR fica em `docs/adr/NNNN-slug.md`, a partir do molde `assets/adr.md`. A numeração é uma só para o HLD e o LLD: o próximo número é o maior da pasta mais um. A seção Decisões do documento é o índice dos ADRs dele. Uma decisão trocada não se edita: o ADR antigo passa a `status: substituída por NNNN`, e o novo entra com número novo. Um porquê ou um custo que falta fica "a definir" no ADR, com a pendência em Questões em aberto.

## Diagramas

Use Mermaid. Para contexto e contêineres, `flowchart` no estilo C4: pessoas e sistemas externos fora, o sistema numa caixa (no contexto) ou num `subgraph` com os contêineres (na arquitetura), cada contêiner com o nome e a tecnologia. Para fluxos complexos, `sequenceDiagram`. A sintaxe `C4Context` do Mermaid é experimental e renderiza mal; não a use.

Todo diagrama leva um título em negrito na linha de cima e uma legenda curta na linha de baixo (o que é cada forma ou cor). Toda seta leva rótulo com o que trafega e, entre contêineres, o protocolo ("REST + JWT", "SQL", "URL assinada"). Uma seta sem rótulo obriga o leitor a adivinhar, e é o defeito mais comum desses diagramas.

## Na conversa

Vale em todos os modos e também fora deles, quando o usuário pergunta sobre o documento. O terminal quebra tabelas largas e mostra o Mermaid como código, então a forma do arquivo fica no arquivo, e a conversa usa o que se lê no terminal:

- Alternativas nunca vão em tabela. Cada uma é um item de lista: a letra e o nome numa linha, "Prós:" e "Contras:" nas linhas de baixo.
- Uma tabela só aparece para o conteúdo que vai para o documento, e só se couber na largura do terminal (poucas colunas, células curtas). Se não couber, cada linha dela vira um item de lista ("1. API: monólito modular em NestJS · descartada: vários serviços").
- Diagramas não vão como código Mermaid: as caixas e as setas viram lista, uma seta por linha, com o rótulo ("Membro → Clenio Chat: mensagens, pedidos aos agentes"). O Mermaid é montado da lista confirmada e só vai para o arquivo. Numa mudança, mostre só as linhas que mudam, com o antes e o depois.

Fontes do molde: arc42 (template 9), C4 model (c4model.com), "Design Docs at Google" (Malte Ubl), ADRs de Michael Nygard e ISO/IEC/IEEE 42010.
