# Modo revisão

O HLD já existe e o usuário pediu para revisá-lo. Deixe-o na estrutura do molde, completo e dentro da fronteira, sem perder o que ele já decidiu.

1. **Abertura.** Leia o molde inteiro. Numa rodada, pergunte qual HLD revisar, os documentos de referência e o LLD, se houver; e o autor e o status, se o cabeçalho não os tiver. Depois, leia o HLD inteiro e as fontes, como diz "Fontes" (`references/criar.md`).
2. **Diagnóstico.** Classifique cada seção contra as regras do `SKILL.md` e a orientação do molde: completa, incompleta (o que falta), ausente, ou com conteúdo do LLD (ponteiro, se o LLD já o tem; lista "Para o LLD", se não). Procure também:
   - frase de estado e restrição misturada com requisito;
   - requisito sem critério e decisão sem porquê ou sem consequência;
   - decisão em tabela, e não em ADR;
   - fato repetido em mais de uma seção;
   - ponteiro só por número, diagrama sem título ou legenda e seta sem rótulo.

   Antes de qualquer pergunta, mostre o diagnóstico como um mapa curto: uma linha por seção com problema, só com o rótulo ("5. Arquitetura: muda com a revisão"), e as seções sem problema juntas numa linha ("Sem problema: 2, 3, 4"). Espere a confirmação. O detalhe de cada problema, inclusive os fatos repetidos e o que vai para o LLD, aparece na rodada da seção em que ele é resolvido.
3. **Lacunas.** Entreviste só as seções com lacuna, com as regras de "A entrevista" (`references/criar.md`). Na rodada de cada parte, proponha também as correções de redação dos problemas dela, numa pergunta à parte. As decisões que o documento já tem espalhadas entram em "Decisões" quando aparecem. Para migrar as decisões em tabela, passe cada uma pelos testes de "Decisões e ADRs" (`SKILL.md`) e mostre a lista, uma por linha, marcada "vira ADR" ou "fica no texto"; depois da confirmação, os ADRs são gravados junto com o documento, e cada citação por número ("decisão 19") passa a citar o ADR ("ADR 0007").
4. **Reorganize** na ordem e na numeração do molde, movendo o texto como está: as palavras só mudam onde o usuário aprovou. Um trecho sem lugar no molde vai para a seção mais próxima, como subseção. Um trecho de outro documento que ele ainda não tem fica aqui, marcado "(para o LLD)", até o outro recebê-lo: tirá-lo antes faria a informação sumir dos dois.
5. **Grave** por cima do arquivo, como diz "Gravar" (`references/criar.md`), mantendo o status ou usando o que o usuário deu na abertura.
6. **Referências cruzadas.** A renumeração quebra quem cita o HLD pelo número. Busque o nome do arquivo e "HLD" perto de "seção" ou "§", liste cada referência com o lugar novo (número e título) e separe os documentos históricos, que não se corrigem. Não edite esses arquivos; sugira que a correção cite o título.
