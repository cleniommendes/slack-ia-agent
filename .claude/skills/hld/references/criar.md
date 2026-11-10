# Modo criar

## Abertura

Leia o molde inteiro. Numa rodada, pergunte o autor; os documentos de referência que devem pesar no desenho (especificações, normas, guias) e o LLD, se já existir; e onde gravar, sugerindo `docs/hld.md`. Se o arquivo já existir, ofereça o modo revisão; nunca sobrescreva sem aviso.

## Fontes

Depois da abertura, leia os documentos que ela indicou, antes da primeira seção; do LLD, só as seções que tocam o tema da rodada. Diga de onde veio cada sugestão.

As fontes podem ser de qualquer tipo (brief, PRD, especificação, anotações, README de um sistema que já existe) e costumam misturar requisito com solução. Se trazem soluções (um mecanismo, uma tecnologia, uma peça do sistema), mostre-as numa rodada antes da primeira seção, uma por linha, com a origem, e pergunte se cada uma é imposta ou sugestão. A imposta vai para Restrições, com a origem; a sugestão vira uma decisão a discutir, com alternativas, em Decisões. Sem soluções nas fontes, essa rodada não existe.

## A entrevista

Percorra o molde em ordem, uma rodada por parte, e espere as respostas antes da próxima, porque uma resposta muda as seguintes. Uma parte é o que o molde separa: uma subseção (`###`), um bloco com rótulo em negrito ou o texto antes da primeira divisão. Uma seção sem divisão é uma parte só. Em cada rodada, até quatro perguntas numeradas, uma decisão por pergunta, cada uma com a sua sugestão quando houver base. Se a parte pede mais que isso, faça uma continuação dela antes de passar à próxima, em vez de juntar várias decisões numa pergunta.

Abra cada rodada com uma linha que diga onde a entrevista está ("Seção 1 · Objetivos de arquitetura (2 de 4)"). Numa lista ou tabela proposta, cada item ocupa uma linha, sem justificativa. Diga a origem numa linha só, no fim ("todos do Fora de escopo do brief"). As fontes costumam detalhar o que é novo ou arriscado e deixar implícito o núcleo do sistema: antes de propor uma lista, confira se o núcleo está nela.

Só passe à próxima parte quando todas as respostas da rodada estiverem aceitas. Se o usuário corrigir uma proposta, mostre só o trecho refeito e espere a confirmação, mesmo que a correção pareça simples. No trecho refeito, mude só o que ele pediu; se achar que falta algo, sugira numa pergunta à parte.

O documento registra decisões do usuário, e não suas:

- Sem base, não sugira: uma sugestão inventada e aceita com "ok" vira fato. Isso vale sobretudo para números (uma meta, um prazo, um limite): sem base, pergunte; um "valor comum de mercado" também não é base.
- Quando o usuário não tem a resposta (o estilo, onde roda, como as partes conversam), proponha 2 ou 3 alternativas, com prós e contras ligados ao que já foi combinado, e deixe-o escolher. O porquê e as consequências são dele: os seus só entram depois que ele confirmar, senão ficam "A definir".
- Registre cada decisão na hora em que ela é tomada, com as alternativas descartadas; na seção Decisões, só complete o que falta.
- Diagramas: proponha a partir do que já foi dito e peça confirmação, em vez de perguntar peça por peça.

Se o usuário pedir para acelerar, junte rodadas, sem pular o que só ele responde (um porquê, um valor, uma escolha). Se uma resposta muda um texto combinado numa parte anterior, mostre o trecho antigo e o novo numa pergunta da rodada seguinte e espere a confirmação.

Antes de fechar as Questões em aberto, confira se cada objetivo de arquitetura e os requisitos de maior prioridade são atendidos por alguma decisão, contêiner, fluxo ou conceito transversal; o que faltar vira pendência.

## Gravar

Antes de gravar, mostre numa rodada curta o que só apareceu na montagem (um diagrama, como lista; uma consequência; uma decisão incompleta). Na mesma rodada, mostre as decisões tomadas, uma por linha, marcadas "vira ADR" ou "fica no texto" pelos testes da seção "Decisões e ADRs" do `SKILL.md`, e espere a confirmação; os ADRs são gravados junto com o documento. Tire do documento os comentários e os placeholders do molde. No modo criar, o status é "rascunho"; na revisão, ele se mantém. Grave, resuma (o caminho, as Questões em aberto, a lista "Para o LLD") e diga onde ver os diagramas desenhados: numa pré-visualização que renderize Mermaid, como a do editor ou a do GitHub. Só dê o HLD por pronto quando o usuário disser.
