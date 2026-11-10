# HLD — <Nome do produto>

AAAA-MM-DD · <Autor> · Status: rascunho · LLD: [<lld>](<caminho do LLD>)

## 1. Contexto e objetivos

<!--
Um parágrafo curto e factual: que sistema é este, para quem e em que fase (MVP,
fase 2).

Depois, as funcionalidades que mais pesam no desenho, em uma ou duas frases (as que
têm estado, arquivos grandes, pagamento, integração externa ou concorrência).

Objetivos de arquitetura: poucos, numa lista curta, metas de desenho: o que a
estrutura precisa permitir ou impedir, sem número e sem mecanismo ("o núcleo
continua funcionando quando um serviço externo cai", "um módulo novo entra sem
mexer no núcleo"). Cada um passa em dois testes: alguém razoável poderia escolher
o contrário, e alguma decisão deste documento existe por causa dele. "Decidir a
permissão no servidor" não passa: é mecanismo, e ninguém escolheria o contrário.
Um requisito copiado também não é objetivo: a prioridade e o critério de cada
atributo de qualidade ficam na seção 3. O que veio imposto (equipe, prazo,
orçamento, uma solução imposta pelas fontes) é restrição, na seção 2.

Para propor, procure nas fontes, qualquer que seja o formato delas, as forças do
desenho: os maiores riscos, os compromissos com quem usa, o núcleo do produto, o
que vem nas fases seguintes e as restrições que apertam. Monte uma lista de
candidatos, uma linha cada, com alguns a mais do que o documento vai levar, para o
usuário escolher. Se as fontes não trazem uma dessas forças, pergunte.

Não objetivos: coisas que alguém poderia razoavelmente esperar e que foram
deixadas de fora de propósito (multirregião, microsserviços). "O sistema não deve
cair" não é um não objetivo.

Stakeholders (opcional): vale quando mais de um papel lê ou decide a arquitetura
(dono do produto, desenvolvimento e agentes de código, operação, jurídico). Diga o
que cada papel precisa da arquitetura e onde encontra, sem repetir os requisitos
deles.
-->

**Objetivos de arquitetura**

-

**Não objetivos**

-

### Stakeholders (opcional)

| Papel | O que precisa da arquitetura | Onde encontra |
| --- | --- | --- |
|  |  |  |

## 2. Restrições

<!--
O que limita a liberdade do desenho e não foi decidido neste documento: nuvem ou
região impostas, lei (LGPD, por exemplo), tecnologias já fixadas ou pela
empresa, tamanho da equipe, prazo, orçamento, convenções obrigatórias. Uma
restrição não é um requisito de qualidade ("dados no Brasil" é restrição; "99,5% de
disponibilidade" é requisito). Diga a origem de cada uma, para quem lê saber se
pode ser renegociada.
-->

| Tipo | Restrição | Origem |
| --- | --- | --- |
|  |  |  |

## 3. Requisitos de qualidade

<!--
Os atributos de qualidade que moldam a arquitetura, em ordem de prioridade (a
primeira linha ganha num conflito). As 3 a 5 primeiras são as metas de qualidade
que guiam as decisões. Cada um com um critério que dê para conferir:
um número, um prazo ou um cenário ("upload de 5 GB retomado após queda de rede sem
reenviar o que já chegou"). Um mecanismo ("TLS em trânsito") não é critério: ele vai
para "Conceitos transversais". "O que o fornecedor garante" também não é: cite o
número ou escreva "A definir".

Inclua as hipóteses de dimensionamento (contas, volume, tráfego) e diga que são
hipóteses quando não há dado real, e o que faria o desenho ser revisto.
-->

| Prioridade | Atributo | Critério |
| --- | --- | --- |
| 1 |  |  |

## 4. Contexto do sistema

<!--
O sistema como uma caixa só, cercado das pessoas que o usam e dos sistemas externos
com que conversa (gateway de pagamento, e-mail, provedor de identidade). Sem
tecnologias internas aqui: elas são da seção 5. Um diagrama `flowchart` com título,
legenda e setas rotuladas, seguido da tabela de integrações.
-->

| Sistema externo | Para que | Como | Quem inicia |
| --- | --- | --- | --- |
|  |  |  |  |

## 5. Arquitetura

<!--
Comece pela estratégia em uma ou duas frases: o estilo (monólito modular,
serviços), onde roda e a ideia central do desenho.

Depois, o diagrama de contêineres: as unidades que rodam ou guardam dados (frontend,
API, worker, banco, armazenamento de objetos, fila), cada uma com a tecnologia, e
setas rotuladas com o que trafega e o protocolo. Título e legenda.

Em seguida, uma tabela com a responsabilidade de cada contêiner. Se a API tem
consumidores atuais e futuros, diga o estilo dela em um parágrafo (REST, versão no
caminho, autenticação) e quem a consome; o contrato rota a rota é do LLD.

Os módulos internos entram só pelo nome e pela responsabilidade, se ajudarem a
entender os fluxos; pastas e bibliotecas são do LLD.
-->

| Contêiner | Responsabilidade | Tecnologia |
| --- | --- | --- |
|  |  |  |

## 6. Fluxos principais

<!--
De 3 a 7 fluxos que pesam no desenho: os que atravessam vários contêineres, mudam
estado de forma delicada ou dependem de integração externa (autenticação, upload,
pagamento). Um fluxo por subseção. Cada um em poucas frases: quem começa, por quais
contêineres passa, o que muda de estado, o que ele dispara de forma assíncrona
(tarefas, rotinas) e o que acontece na falha principal.

Um `sequenceDiagram` só quando o fluxo não cabe em 3 ou 4 frases. Status HTTP,
nomes de campo e mensagens de erro são do LLD.
-->

### 6.1

## 7. Dados

<!--
O modelo em forma resumida: as entidades principais, como se relacionam e onde
cada tipo de dado mora (banco relacional, armazenamento de objetos, cache). Diga
as regras que pesam no desenho: o que é apagado e quando, o que conta para cota ou
cobrança, o que precisa de consistência transacional. Sem colunas, tipos nem
índices: o schema é do LLD.
-->

## 8. Conceitos transversais

<!--
Práticas que atravessam vários contêineres e fluxos. Cada subseção em poucas
linhas: a regra e o mecanismo, apontando para o LLD onde houver detalhe. As quatro
abaixo são o padrão; acrescente outra só se ela pesar no desenho (internacionalização,
acessibilidade, cache). A seção nunca é apagada: é onde segurança, observabilidade e
tratamento de erros deixam de ficar espalhados pelo documento.

- Segurança e privacidade: autenticação, autorização, dados em trânsito e em
  repouso, acesso a arquivos, limites de tentativa, exigências legais.
- Observabilidade: logs, métricas, rastreamento, alertas e quem é avisado.
- Erros, novas tentativas e idempotência: o que acontece quando uma parte falha, o
  que é repetido e como a repetição não duplica efeito.
- Configuração e segredos: de onde vêm a configuração e os segredos em cada
  ambiente (o mecanismo, e não a lista de variáveis).
-->

### Segurança e privacidade

### Observabilidade

### Erros, novas tentativas e idempotência

### Configuração e segredos

## 9. Implantação e ambientes

<!--
Os ambientes (local, staging, produção) e o que cada um serve. Para produção, onde
cada contêiner roda, quantas instâncias, a rede e o que garante a disponibilidade.
Para staging (ou outro ambiente intermediário), em que ele difere da produção
(tamanho, credenciais de terceiros, dados) e o que impede os ambientes de divergirem.
Para o ambiente local, o que substitui cada serviço de produção e, em uma linha por
tema, o que o substituto não reproduz e onde isso é coberto. A entrega (como o
código e as migrações chegam a cada ambiente) em poucas frases.

Sem comandos, arquivos de configuração, variáveis, versões ou passo a passo de
instalação: isso é do LLD ou do README.
-->

| Ambiente | Para que serve | Onde roda |
| --- | --- | --- |
|  |  |  |

## 10. Decisões

<!--
Índice dos ADRs deste documento, um por linha, com o número linkado, o título e o
status (seção "Decisões e ADRs" do `SKILL.md`). Um ADR responde a uma pergunta só:
se as alternativas descartadas respondem a perguntas diferentes (onde a aplicação
roda e se o desenvolvimento usa a nuvem), são duas decisões.
-->

| ADR | Decisão | Status |
| --- | --- | --- |
|  |  |  |

## 11. Riscos e dívida técnica

<!--
Os riscos técnicos e as dívidas conhecidas, em ordem de prioridade, cada um com o
impacto e a mitigação ou o plano. Dívida é o que se sabe que está aquém do desenho
(um caminho de migração que ainda não existe, uma observabilidade não desenhada).
Riscos de negócio e de produto não entram aqui, mas o custo de infraestrutura que o
desenho causa é risco daqui. Uma questão em aberto que gera custo ou exposição
enquanto não é resolvida também entra como risco, apontando para a questão.
-->

| Risco ou dívida | Impacto | Mitigação ou plano |
| --- | --- | --- |
|  |  |  |

## 12. Questões em aberto

<!--
Tudo que ficou como "a definir" nas seções acima, uma linha por pendência, com o que
precisa ser decidido ou pesquisado. Só questões de arquitetura; dúvidas de
implementação (formato de uma variável, nome de uma biblioteca) vão para o LLD. O
HLD só vira "aprovado" quando as questões que travam o LLD estiverem resolvidas.
-->

- [ ]
