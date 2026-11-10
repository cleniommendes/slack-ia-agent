# LLD — <Nome do produto>

AAAA-MM-DD · <Autor> · Status: rascunho · HLD: [<hld>](<caminho do HLD>)

**Onde mora cada fato**

<!--
O mapa dos donos, para o leitor (e o agente de código) saber onde procurar antes
de ler o resto. Uma linha por tipo de fato que tem dono fora deste documento:
contrato da API, schema do banco, schema das variáveis, práticas e comandos de
cada projeto, linguagem visual, vocabulário (glossário), arquitetura e motivos
(HLD), decisões com porquê (`docs/adr/`, com o índice na seção "Decisões" deste
documento e do HLD), escopo (documento de produto). Um dono que não vai existir não entra; se o tema importa,
uma linha diz quem o cobre ("os termos são os do HLD"). Um dono que ainda não existe entra com o caminho onde vai
morar e "(planejado)"; até ele nascer, a forma do que ele vai guardar segue a regra
do item `planejada`.
-->

| Fato | Dono |
| --- | --- |
|  |  |

## 1. Estrutura do código

<!--
Como o código se organiza: repositório único ou vários, os projetos que têm
implantação própria, os pacotes compartilhados. Uma árvore de pastas curta, até o
nível que diz a responsabilidade de cada pasta, e não um espelho do disco. Pasta
ou pacote que ainda não existe leva a marca `planejada`.

Depois, a tabela das bibliotecas e frameworks que pesam no código, cada um pelo
papel que cumpre. A versão entra só quando é uma decisão (fixar uma versão por um
motivo); senão, ela é do arquivo de dependências. A coluna "Por quê" traz o motivo
numa linha; o ADR ("ADR 0012"), quando a escolha passou nos testes da seção
"Decisões e ADRs" do `SKILL.md`; ou a seção do HLD, quando a escolha é de lá (um
framework, por exemplo).
-->

| Papel | Escolha | Por quê |
| --- | --- | --- |
|  |  |  |

## 2. Componentes e dependências

<!--
Os tipos de peça do código (por exemplo: controller, service, repository,
integração externa, tarefa) e o que cada tipo pode chamar. As dependências
permitidas num `flowchart` com título, legenda e setas rotuladas: o que não tem
seta não é permitido. Diga as regras que impedem ciclos e o que uma peça nunca
importa (por exemplo, o service não conhece o HTTP).

Para cada interface de integração externa (armazenamento, e-mail, fila, gateway),
uma caixa-preta: a tabela das operações, com o que cada uma recebe, devolve e
garante, sem a assinatura do código. Os módulos de domínio entram pelo nome e pela
responsabilidade, com a Situação de cada um.
-->

## 3. Conceitos transversais de implementação

<!--
Os mecanismos que se repetem em várias partes do código, escritos uma vez aqui, e
as outras seções apontam para eles. Cada subseção em poucas linhas: a regra e o
mecanismo. A regra de alto nível (por que existe, o que protege) é do HLD; aqui
fica como ela é feita. Acrescente outra subseção só se ela pesar no código (cache,
internacionalização). A seção nunca é apagada: é onde o mecanismo de concorrência,
de erro ou de log deixa de ser reescrito em cada regra.

- Segurança: autenticação e autorização no código (onde a permissão é conferida,
  como), origem do IP, CORS, limite de tentativas, o que é segredo.
- Concorrência e idempotência: locks, tomada de um registro por atualização
  condicional, inserção que tolera conflito, repetição sem efeito duplicado.
- Transações: o que precisa ser atômico e onde a transação começa.
- Erros: o formato do erro, o catálogo de códigos e quem traduz exceção em
  resposta.
- Logs: o que vai para o log, com que nível e o que nunca vai (segredo, dado
  pessoal em claro).
- Configuração: como o código lê a configuração e o que acontece quando falta uma
  variável (a lista das variáveis fica em "Valores e configuração").
-->

### Segurança

### Concorrência e idempotência

### Transações

### Erros

### Logs

### Configuração

## 4. Dados

<!--
As convenções que valem para todas as tabelas (nomes, tipo de id, datas,
exclusão lógica ou física) e um `erDiagram` com as entidades e as relações, sem
colunas. Se o schema implementado tem dono (o schema do banco), aponte para ele e não
repita colunas, tipos nem índices; a forma completa entra só para a tabela
`planejada` com base para ela, até o schema recebê-la, numa tabela por tabela
(Coluna | Tipo | Observação). Sem base, a tabela entra pelo nome, com a Situação
`a detalhar`. Diga a Situação de cada tabela.

As regras de dados que o schema não mostra (o que é apagado e quando, o que conta
para uma cota, o que precisa de unicidade sob concorrência) ficam em "Estados e
regras" ou em "Conceitos transversais"; aqui, só o ponteiro.
-->

## 5. Interfaces

<!--
O contrato que o sistema oferece (API HTTP, eventos, fila). Comece pelas
convenções que valem para todas as rotas: prefixo e versão, autenticação,
paginação, formato do erro (ou ponteiro para "Conceitos transversais", seção
"Erros"), nomes dos campos.

Depois, o índice das rotas por domínio, uma subseção por domínio. Rota com
Situação `existe` tem a forma no snapshot do contrato: aqui ela fica com o método e
o caminho, a Situação e o comportamento que o snapshot não diz, apontando para a
regra. Rota `planejada` com base para a forma a traz completa até o snapshot
recebê-la, com as colunas Entrada, Saída e status e Erros acrescentadas à tabela;
sem base, ela fica `a detalhar`, só com o comportamento. Uma rota que existe e tem
uma mudança planejada (um campo novo, um parâmetro) fica `existe`, com uma linha
"Alteração `planejada`" que traz só a forma da mudança.
-->

| Método e caminho | Situação | Comportamento |
| --- | --- | --- |
|  |  |  |

## 6. Estados e regras

<!--
Uma subseção por entidade com estado ou com regra que cruza várias rotas (por
exemplo: item, assinatura, cota, token, upload). Em cada uma:
- um `stateDiagram-v2` quando a entidade tem mais de dois estados, com o evento
  em cada transição;
- as regras, uma por item de lista, com a condição, o resultado e o caso de borda,
  e o porquê quando não for óbvio;
- o algoritmo, quando não for óbvio, em prosa ou pseudocódigo curto (o texto
  exato do SQL ou do código é do código).
Status HTTP e códigos de erro citam o catálogo; valores citam a tabela de "Valores
e configuração" pelo nome.
-->

### 6.1

## 7. Processos de segundo plano

<!--
As tarefas que rodam fora de uma requisição (fila, rotina agendada, worker): uma
linha por tarefa, com o que a dispara, o que faz, como é idempotente e o que
acontece quando falha (novas tentativas, alerta). Situação de cada uma.
-->

| Tarefa | Disparo | O que faz | Na falha | Situação |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 8. Cliente (opcional)

<!--
Vale quando há uma interface (web, app). O comportamento, e não a aparência: o
mapa de rotas e telas (rota, acesso, o que lê, o que faz, Situação), a sessão no
cliente (onde fica, como renova, o que protege cada rota), os fluxos do cliente
que têm regra própria (envio de arquivo, retomada, espera entre tentativas) e a
reação a cada erro da API. Cores, componentes e textos são do design system:
aponte para ele.
-->

| Rota | Acesso | Lê | Ações | Situação |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 9. Valores e configuração

<!--
A tabela dona dos valores de regra: limites, prazos, tamanhos, intervalos. Cada um
com nome, valor, onde vale e se é constante no código ou vem de uma variável de
ambiente (diga qual). As outras seções citam o valor pelo nome. Quando o valor vem
de uma variável com padrão no schema das variáveis, o valor de produção é decidido
aqui, e o padrão do schema tem de ser igual a ele.

Um valor de regra é um número que o sistema escolhe e poderia mudar sem redesenho.
Não são valores de regra, e ficam na regra que os usa, com a fonte: um limite
imposto por um fornecedor (o múltiplo de bloco de um storage), um prazo que a lei
fixa e o número de um exemplo de convenção. Um número que o sistema escolhe para
cumprir uma lei ou um pedido é valor de regra.

Depois, as variáveis de ambiente: nome, projeto que a lê, significado e origem em
produção (segredo, plataforma, gerenciador de segredos). Tipo, obrigatoriedade e
valor padrão são do schema das variáveis: aponte para ele, sem lista. Enquanto o
schema é planejado, eles nascem com a funcionalidade que cria a variável; um
padrão que é regra de negócio já está na tabela de valores. Uma variável que nenhum
schema confere (a de um projeto sem validação na subida) tem o LLD como dono: o
padrão e a obrigatoriedade dela entram no "Significado", e a falta do schema vira
uma linha em "Questões em aberto".
-->

**Valores de regra**

| Nome | Valor | Onde vale | Constante ou variável |
| --- | --- | --- | --- |
|  |  |  |  |

**Variáveis de ambiente**

| Variável | Projeto | Significado | Origem em produção |
| --- | --- | --- | --- |
|  |  |  |  |

## 10. Ambiente de desenvolvimento (opcional)

<!--
Vale quando o ambiente local muda o código ou os testes: um serviço emulado que se
comporta diferente da produção, um endereço que muda dentro e fora do contêiner,
um banco de testes separado. Diga o que muda no código e como os testes cobrem a
diferença. A lista do que substitui cada serviço de produção é do HLD (seção de
implantação e ambientes): aponte para ela e escreva aqui só o detalhe que afeta o
código. Comandos e passo a passo são do README ou do guia do projeto.
-->

## 11. Decisões

<!--
Índice dos ADRs de implementação deste documento, um por linha, com o número
linkado, o título e o status (seção "Decisões e ADRs" do `SKILL.md`). Viram ADR as
escolhas que passam nos testes (uma biblioteca difícil de trocar, um mecanismo de
concorrência, um formato, um modo de testar); um detalhe sem alternativa séria,
como o algoritmo de hash recomendado para senhas, fica só na seção dele. Um ADR
responde a uma pergunta só.

Uma decisão que muda o desenho (estilo, contêiner, banco, integração externa) é do
HLD: aqui, só o ponteiro.
-->

| ADR | Decisão | Status |
| --- | --- | --- |
|  |  |  |

## 12. Questões em aberto

<!--
Tudo que ficou como "a definir" nas seções acima, uma linha por pendência, com o
que precisa ser decidido ou pesquisado; as decisões com porquê ou consequência a
definir entram numa linha só, com os números. Só questões de implementação; as de
arquitetura vão para o HLD, e as de escopo, para o documento de produto. Numa revisão, uma
questão de outro documento que ele ainda não tem fica aqui, marcada "(para o
<destino>)", até ele a receber.
-->

- [ ]
