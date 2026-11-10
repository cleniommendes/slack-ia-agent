# Modo criar

## Abertura

Leia o molde inteiro e faça a busca de "Fontes". Numa rodada, pergunte o autor; confirme o HLD, os documentos de referência e os artefatos donos que a busca achou, um dono por tipo de fato, com o caminho futuro dos que ainda não existem; pergunte se as questões em aberto do HLD que travam o LLD seguem como "A definir", e onde gravar, sugerindo `docs/lld.md`. A abertura pode passar de quatro perguntas. Se o arquivo já existir, ofereça o modo revisão; nunca sobrescreva sem aviso.

## Fontes

Antes da abertura, procure o que ela vai confirmar: o HLD, os documentos de referência e os artefatos donos (seção "Artefatos donos" do `SKILL.md`); e leia o HLD. Do código, leia, conforme a entrevista avança, o que sustenta cada seção. Diga de onde veio cada sugestão ("do HLD", "tirado do código"); o código diz o que é, e não o porquê, que vem do usuário.

## A entrevista

Percorra o molde em ordem, uma rodada por parte, e espere as respostas antes da próxima, porque uma resposta muda as seguintes. Uma parte é o que o molde separa: uma subseção (`###`), um bloco com rótulo em negrito ou o texto antes da primeira divisão. Uma seção sem divisão é uma parte só. Em cada rodada, até quatro perguntas numeradas, uma decisão por pergunta, cada uma com a sua sugestão quando houver base. Se a parte pede mais que isso, faça uma continuação dela antes de passar à próxima, em vez de juntar várias decisões numa pergunta.

Abra cada rodada com uma linha que diga onde a entrevista está ("Seção 1 · Objetivos de arquitetura (2 de 4)"). Numa lista ou tabela proposta, cada item ocupa uma linha, sem justificativa. Diga a origem numa linha só, no fim ("todos do Fora de escopo do brief"). As fontes costumam detalhar o que é novo ou arriscado e deixar implícito o núcleo do sistema: antes de propor uma lista, confira se o núcleo está nela.

Só passe à próxima parte quando todas as respostas da rodada estiverem aceitas. Se o usuário corrigir uma proposta, mostre só o trecho refeito e espere a confirmação, mesmo que a correção pareça simples. No trecho refeito, mude só o que ele pediu; se achar que falta algo, sugira numa pergunta à parte.

O documento registra decisões do usuário, e não suas:

- Sem base, não sugira: uma sugestão inventada e aceita com "ok" vira fato. Isso vale sobretudo para números e para a forma de um item planejado (seção "Quanto detalhar" do `SKILL.md`): sem base, pergunte; um "valor comum de mercado" também não é base.
- Quando o usuário não tem a resposta (uma biblioteca, um mecanismo de concorrência, um formato), proponha 2 ou 3 alternativas, com prós e contras ligados ao que já foi combinado, e deixe-o escolher. O porquê e as consequências são dele: os seus só entram depois que ele confirmar, senão ficam "A definir".
- Registre cada decisão na hora em que ela é tomada, com as alternativas descartadas; na seção Decisões, só complete o que falta.
- Diagramas: proponha a partir do que já foi dito e peça confirmação, em vez de perguntar peça por peça.

Se o usuário pedir para acelerar, junte rodadas, sem pular o que só ele responde (um porquê, um valor, uma escolha). Se uma resposta muda um texto combinado numa parte anterior, mostre o trecho antigo e o novo numa pergunta da rodada seguinte e espere a confirmação.

Antes de fechar as Questões em aberto, confira se cada contêiner, integração externa e fluxo do HLD tem onde morar neste LLD; o que faltar vira pendência.

## Gravar

Antes de gravar, mostre numa rodada curta o que só apareceu na montagem (uma coluna que uma decisão exige; um diagrama, como lista; uma decisão incompleta). Na mesma rodada, mostre as decisões tomadas, uma por linha, marcadas "vira ADR" ou "fica no texto" pelos testes da seção "Decisões e ADRs" do `SKILL.md`, e espere a confirmação; os ADRs são gravados junto com o documento. Tire do documento os comentários e os placeholders do molde. Preencha o mapa "Onde mora cada fato" com os artefatos donos combinados. No modo criar, o status é "rascunho"; na revisão, ele se mantém. Grave, resuma (o caminho, as Questões em aberto, as listas "Para o HLD" e "Para outros documentos", as divergências entre o código e os artefatos donos) e diga onde ver os diagramas desenhados: numa pré-visualização que renderize Mermaid, como a do editor ou a do GitHub. Só dê o LLD por pronto quando o usuário disser.
