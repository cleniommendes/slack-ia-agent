# Product Brief — <Nome do produto>

AAAA-MM-DD · <Autor> · Status: rascunho

<!--
COMO USAR ESTE MOLDE
1. Copie este arquivo para o lugar do brief do produto e renomeie.
2. Preencha o cabeçalho. Status: rascunho, em revisão ou aprovado.
3. Preencha as seções na ordem. As marcadas com "(opcional)" podem ser apagadas
   inteiras quando não se aplicam; a orientação de cada uma diz quando vale incluir.
4. Onde ainda não há resposta, escreva "A definir" e registre a pendência em
   "Questões em aberto". Não deixe a seção em branco nem invente um número.
5. Apague os comentários de orientação quando terminar. Eles não aparecem no
   Markdown renderizado, mas apagá-los mantém o arquivo limpo.
O brief diz o quê e para quem. Arquitetura, telas e detalhes de implementação
ficam em outros documentos.
-->

## Visão geral

<!--
Em um parágrafo: o que é o produto, para quem e por que ele existe. Se o produto
tem promessas ou diferenciais, liste-os em seguida, um por linha, cada um com uma
frase que diga o que o produto faz para cumprir a promessa, do ponto de vista
de quem usa, sem o mecanismo técnico. Detalhes ainda indefinidos recebem
"a definir".
Exemplo: "Gerenciador de arquivos na nuvem para usuários finais, com 15 GB
gratuitos. Ele se diferencia por três promessas: privacidade, simplicidade e preço."
-->

## Problema e contexto

<!--
Qual dor o produto resolve e por que agora. Descreva a situação de quem sofre o
problema e o que essa pessoa faz hoje para contorná-lo. Termine com as hipóteses
em que a aposta se apoia, uma por linha, e diga que ainda não foram validadas, se
for o caso. Elas são as premissas do brief e voltam em "Riscos, dependências e
premissas".
Exemplo de hipótese: "Esgotar o espaço gratuito é um gatilho claro para trocar de
serviço."
-->

## Público-alvo

<!--
Quem é o primeiro usuário do produto. Informe o perfil principal, o gatilho que o
leva a procurar uma solução e o que fica fora do foco inicial. Prefira um recorte
estreito: quem tenta atender todo mundo no começo não atende ninguém.
-->

- **Perfil principal:**
- **Gatilho de uso ou de compra:**
- **Fora do foco inicial:**

## Modelo de negócio e planos (opcional)

<!--
Inclua quando o produto cobra ou tem planos. Apague quando é gratuito ou interno.
Se o modelo ainda não está definido, mantenha a seção com "A definir" e registre a
dúvida em "Questões em aberto". Diga como o produto ganha dinheiro, quais são os planos, a periodicidade
da cobrança, as formas de pagamento e a referência de preço. Valores que ainda
dependem de pesquisa ficam como "a definir".
-->

## Objetivos e métricas de sucesso

<!--
Como saber que o produto deu certo. Escolha poucas métricas (de 3 a 6), cada uma
com o que mede e uma meta num prazo fixo após o lançamento. Metas sem dados reais
são hipóteses: diga isso. Misture aquisição, ativação, retenção e receita ou custo,
conforme o produto.
-->

| Métrica | O que mede | Meta em <prazo> |
| --- | --- | --- |
|  |  |  |

## Escopo do MVP

<!--
A menor versão que testa a aposta do produto. Diga primeiro a plataforma (web,
app, API) e depois liste as funcionalidades, numeradas, uma por linha. Cada linha
descreve o que o usuário consegue fazer, não como é construído. Se uma
funcionalidade não é necessária para testar a aposta, ela vai para "Fora de
escopo".
-->

1.

## Fora de escopo

<!--
O que não entra no MVP, em lista. Prefira itens que alguém poderia esperar ver no
MVP; o que ninguém espera não precisa constar. Aponte as lacunas conhecidas, com a
razão, e marque o que é candidato às fases seguintes do roadmap.
-->

-

## Requisitos não funcionais e restrições (opcional)

<!--
Inclua quando há exigências que moldam a solução: privacidade, localização dos
dados, desempenho, disponibilidade, plataforma, tecnologias impostas, prazo, equipe
e orçamento. Apague quando o produto não tem nenhuma além do óbvio. Diga o
requisito, não a implementação; se uma escolha de tecnologia já é fixa, registre-a
aqui como restrição. Prazo, equipe e orçamento sem resposta ficam como "a definir".
-->

| Área | Requisito |
| --- | --- |
|  |  |

## Alternativas e concorrentes

<!--
O que o público usa hoje para resolver o problema: produtos concorrentes,
soluções improvisadas e não fazer nada. Para cada alternativa, diga o que ela faz
bem, onde falha para o público-alvo e como o produto se posiciona diante dela. É
daqui que sai a justificativa dos diferenciais da "Visão geral".
-->

| Alternativa | Pontos fortes | Pontos fracos para o público-alvo | Nosso posicionamento |
| --- | --- | --- | --- |
|  |  |  |  |

## Riscos, dependências e premissas

<!--
Comece pelo maior risco, em uma frase. Depois liste cada risco com a mitigação
(tabela): o que o produto exige para reduzir o risco, e não o mecanismo técnico,
que é assunto da arquitetura. Cubra risco de negócio, de produto, técnico e de pessoas. Em seguida,
liste as dependências (serviços, fornecedores, decisões de terceiros) e as
premissas, que são as hipóteses de "Problema e contexto" ainda não validadas.
-->

| Risco | Mitigação |
| --- | --- |
|  |  |

**Dependências:**

**Premissas:**

## Roadmap

<!--
As fases do produto, da mais próxima à mais distante. Para cada fase, diga o
objetivo e o que entra. Se uma fase só começa quando o anterior atinge metas,
descreva o gate com as metas de "Objetivos e métricas de sucesso". Sem datas
quando o prazo ainda está a definir. Um diagrama Mermaid é opcional.
-->

## Questões em aberto

<!--
Tudo que ficou como "a definir" nas seções acima, uma linha por pendência, com o
que precisa ser decidido ou pesquisado. O brief só vira "aprovado" quando as
questões que travam o planejamento estiverem resolvidas.
-->

- [ ]

## Glossário (opcional)

<!--
Inclua quando o produto usa termos próprios ou ambíguos que aparecem nos outros
documentos. Um termo por linha, com uma definição curta e o que ele não significa.
Se o projeto já tem um glossário, aponte para ele em vez de repeti-lo.
-->

| Termo | Definição |
| --- | --- |
|  |  |
