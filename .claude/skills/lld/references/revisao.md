# Modo revisão

O LLD já existe e o usuário pediu para revisá-lo. Deixe-o na estrutura do molde, completo e dentro das fronteiras, sem perder o que ele já decidiu.

1. **Abertura.** Leia o molde inteiro e faça a busca de "Fontes" (`references/criar.md`). Numa rodada, pergunte qual LLD revisar, o HLD, os documentos de referência e os artefatos donos (sugerindo o que a busca achou), se as questões do HLD que travam o LLD seguem "A definir", e o autor e o status, se o cabeçalho não os tiver. Depois, leia o LLD inteiro e as fontes, como diz "Fontes" (`references/criar.md`).
2. **Diagnóstico.** Classifique cada seção contra as regras do `SKILL.md` e a orientação do molde: completa, incompleta (o que falta), ausente, com forma que um artefato já tem, ou com conteúdo de outro documento (ponteiro, se ele já o tem; lista "Para o HLD" ou "Para outros documentos", se não). Procure também, conferindo contra o próprio artefato, e não de memória:
   - item sem Situação e frase de estado;
   - valor repetido fora da tabela, ou diferente do padrão que o schema das variáveis lhe dá;
   - regra repetida em mais de uma seção;
   - lista que diverge do artefato, forma de item `existe` que ficou no LLD e frase de desempate;
   - decisão sem porquê ou sem consequência;
   - decisão em tabela, e não em ADR;
   - ponteiro só por número, diagrama sem título ou legenda e seta sem rótulo.

   Antes de qualquer pergunta, mostre o diagnóstico como um mapa curto: uma linha por seção com problema, só com o rótulo ("5. Arquitetura: muda com a revisão"), e as seções sem problema juntas numa linha ("Sem problema: 2, 3, 4"). Espere a confirmação. O detalhe de cada problema, inclusive as divergências com os artefatos, as regras repetidas e o que vai para outros documentos, aparece na rodada da seção em que ele é resolvido.
3. **Lacunas.** Entreviste só as seções com lacuna, com as regras de "A entrevista" (`references/criar.md`). Na rodada de cada parte, proponha também as correções de redação dos problemas dela, numa pergunta à parte. As decisões que o documento já tem espalhadas entram em "Decisões" quando aparecem. Para migrar as decisões em tabela, passe cada uma pelos testes de "Decisões e ADRs" (`SKILL.md`) e mostre a lista, uma por linha, marcada "vira ADR" ou "fica no texto"; depois da confirmação, os ADRs são gravados junto com o documento, e cada citação por número ("decisão 19") passa a citar o ADR ("ADR 0007").
4. **Reorganize** na ordem e na numeração do molde, movendo o texto como está: as palavras só mudam onde o usuário aprovou. Um trecho sem lugar no molde vai para a seção mais próxima, como subseção. Um trecho de outro documento que ele ainda não tem fica aqui, marcado "(para o HLD)" ou "(para <destino>)", até o outro recebê-lo: tirá-lo antes faria a informação sumir dos dois.
5. **Grave** por cima do arquivo, como diz "Gravar" (`references/criar.md`), mantendo o status ou usando o que o usuário deu na abertura.
6. **Referências cruzadas.** A renumeração quebra quem cita o LLD pelo número, inclusive código e artefatos. Busque o nome do arquivo e "LLD" perto de "seção" ou "§", liste cada referência com o lugar novo (número e título) e separe os documentos históricos, que não se corrigem. Não edite esses arquivos; sugira que a correção cite o título.
