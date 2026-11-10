---
name: product-brief
description: Conduz uma entrevista com o usuário, uma rodada por seção, e grava um product brief a partir de um molde próprio. Use sempre que o usuário pedir para criar, rascunhar, estruturar ou revisar um product brief, brief de produto, documento de concepção ou "one-pager" de um produto, ou disser que quer conceber um produto, app, site, API ou ferramenta nova e ainda não tem o escopo escrito, mesmo que não use a palavra "brief".
---

# Product brief por entrevista

Esta skill transforma uma ideia de produto em um product brief escrito, entrevistando o usuário. O molde do documento está em `assets/product-brief.md`: cada seção tem um comentário HTML com a orientação do que escrever. A skill é autocontida e não depende de nenhum arquivo do projeto.

O brief diz **o quê e para quem**. Arquitetura, telas e detalhes de implementação ficam fora; se o usuário começar a descrevê-los, anote o que servir ao escopo e diga que isso é assunto de outro documento.

## Antes de começar

1. Leia `assets/product-brief.md` inteiro. Os comentários HTML são o seu roteiro: dizem o que perguntar e o que conta como uma seção bem preenchida.
2. Na rodada de abertura, pergunte o nome do autor (vai no cabeçalho) e onde gravar o brief, sugerindo `docs/product-brief.md`. Se o arquivo já existir, mostre que existe e pergunte se o usuário prefere outro nome; nunca sobrescreva sem aviso. Se a pasta não existir, crie-a.
3. Se o usuário já deu contexto no pedido (o que é o produto, para quem, preço), aproveite: não repita perguntas já respondidas, e confirme o que entendeu na seção correspondente.

## A entrevista

Percorra as seções do molde na ordem, **uma rodada por seção**. Se a seção não couber em uma rodada, como quando você lista alternativas para o usuário confirmar, faça uma continuação da mesma seção antes de passar à próxima. Cada rodada tem estas partes:

- Nomeie a seção e diga em uma frase para que ela serve.
- Faça de 1 a 4 perguntas numeradas, juntas, tiradas da orientação da seção. Seções simples, como o Glossário, cabem em uma só. Quando o que o usuário já contou dá base, acrescente a sua sugestão de resposta: ela ajuda quando a ideia ainda está vaga, e o usuário pode só dizer "ok". Sem base, como no nome do autor ou no orçamento, pergunte direto, porque uma sugestão inventada e aceita com "ok" vira fato no brief.
- Espere as respostas antes de passar à próxima seção. Uma resposta pode mudar as seguintes, então não adiante perguntas de seções futuras.
- Se uma resposta desatualizar um texto já combinado, como um público estreitado depois de uma hipótese escrita, atualize esse texto na hora e avise em uma linha, sem esperar o fim da entrevista.

A ordem das seções e o que perguntar em cada uma vêm do molde. Seis seções pedem cuidado:

- **Objetivos e métricas de sucesso:** limite a 3 a 6 métricas, cada uma com uma meta e um prazo. Se as metas são palpites, diga isso no texto.
- **Requisitos não funcionais e restrições:** ao escrever cada linha, confira se ela diz o que se exige ou como fazer. Se diz como fazer, pergunte se é imposto: se for, registre-o como restrição e diga que é imposta; se não, reescreva como requisito.
- **Alternativas e concorrentes:** se o usuário não souber, ofereça listar alternativas que você conhece e peça para ele confirmar. Não invente preços nem números. Uma alternativa rejeitada sai da tabela. Uma não confirmada fica com "A definir" em todas as colunas, inclusive o posicionamento, e a pesquisa vai para "Questões em aberto".
- **Riscos, dependências e premissas:** um tipo de risco sem resposta não vira linha da tabela. Ele fica só em "Questões em aberto".
- **Roadmap:** pergunte prazo de lançamento, equipe e orçamento nesta rodada, e não em Requisitos não funcionais e restrições, mesmo que a orientação do molde os cite lá, porque essa seção é opcional e pode ser apagada. Registre as respostas em Requisitos, se a seção ficou no brief, ou no texto do Roadmap, se saiu. Se o prazo do produto está "a definir", escreva o roadmap sem datas e diga isso em uma frase. Um prazo relativo, como "4 meses", precisa de ponto de partida: pergunte a partir de quando ele conta e, se o usuário não souber, registre a pendência em "Questões em aberto".
- **Questões em aberto:** faça uma rodada curta de confirmação. Antes de mostrar as pendências reunidas, confira se cada promessa da Visão geral diz o que o produto faz para cumpri-la; se alguma não disser, acrescente a pendência. Depois pergunte se falta alguma. Se surgir outra pendência depois dela, como no Glossário, inclua-a direto, sem repetir a rodada.

### Seções opcionais

Entreviste **todas** as seções, inclusive as marcadas "(opcional)": Modelo de negócio e planos, Requisitos não funcionais e restrições, e Glossário. Ao chegar numa delas, diga quando ela costuma valer a pena (a orientação do molde diz) e deixe o usuário responder "não se aplica". Só essa resposta **apaga a seção inteira** do brief, título e conteúdo, sem deixar vestígio dela. Se o usuário responder "a definir" ou "não sei", a seção fica, com a regra de "O que o usuário não sabe".

### O que o usuário não sabe

Quando o usuário responder "a definir", "não sei" ou ficar sem resposta, não invente um valor e não deixe a seção em branco. Escreva "A definir", com essa grafia, no lugar do valor (em prosa, "a definir" no meio da frase) e acrescente uma linha em "Questões em aberto" dizendo o que precisa ser decidido ou pesquisado. Isso mantém o brief honesto: quem lê o documento depois sabe o que está firme e o que é pendência.

### Quando o usuário foge do escopo

Se aparecer no meio da entrevista algo que pertence a outra seção, anote e use onde couber, sem interromper a rodada. Se o usuário quiser voltar a uma seção anterior ou corrigir uma resposta, volte, ajuste e confirme em uma linha o que mudou.

## Gravar o brief

Depois da última seção:

1. Monte o documento a partir do molde:
   - Cabeçalho: título com o nome do produto, a data de hoje (AAAA-MM-DD), o autor e `Status: rascunho`. Pergunte o nome do autor se não souber.
   - **Remova todos os comentários HTML**, inclusive o de "COMO USAR ESTE MOLDE". O brief pronto não carrega a orientação.
   - Remova as seções opcionais marcadas "não se aplica" e tire o "(opcional)" do título das que ficaram.
   - Troque todos os placeholders do molde, que ficam fora de comentário: `<Nome do produto>`, `AAAA-MM-DD`, `<Autor>` e o `<prazo>` do cabeçalho da tabela de métricas. Se o prazo das metas está a definir, esse cabeçalho fica `Meta em prazo a definir`. Confira com uma busca por `<` e por `AAAA` antes de gravar.
   - Preencha as tabelas e listas; apague linhas vazias que sobraram do molde.
   - Escreva em português do Brasil, em prosa direta, sem inflar o que o usuário disse.
2. Grave no caminho combinado.
3. Mostre um resumo curto: o caminho do arquivo, as seções que ficaram de fora e o que ficou como "a definir" (a lista de "Questões em aberto").
4. Pergunte se o usuário quer ajustar algo. Se pedir, edite o arquivo e repita o resumo do que mudou. Só diga que o brief está pronto quando o usuário disser que sim.

O status do brief só muda para "em revisão" ou "aprovado" por decisão do usuário; a skill sempre grava "rascunho".
