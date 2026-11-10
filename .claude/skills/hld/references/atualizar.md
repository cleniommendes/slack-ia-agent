# Modo atualizar

Uma tarefa mudou algo que o HLD registra. Deixe o fato certo na seção dona e leve a mudança a tudo o que ela atinge, sem arrumar o resto: o diff deve ser só o da mudança, porque vai no PR da tarefa.

**Alcance.** Ache a seção dona e todas as que a mudança afeta, inclusive as que não citam o fato antigo (uma integração nova pesa em segurança, implantação, riscos), e leia a orientação do molde delas. Um fato do nível de implementação vai para o LLD; o HLD só muda se a frase de alto nível mudar.

**Confirmação.** Decisão, requisito, restrição, integração e as consequências que você deduzir são conteúdo: mostre o antes e o depois numa confirmação só e grave depois do ok. Cópia do fato antigo, ponteiro e questão já resolvida são mecânicos: aplique e avise. Uma consequência que pede escolha nova, ou contraria o que está registrado, vira pergunta, e não texto, porque a decisão é do usuário; sem resposta, fica "A definir".

**Convenções.**

- Decisão nova ou trocada segue a seção "Decisões e ADRs" do `SKILL.md`: a trocada não se edita, o ADR antigo passa a "substituída por NNNN", e o novo entra no índice com número novo.
- O HLD registra o desenho decidido. Se o código ainda segue o antigo, a transição vai para o LLD, como alteração planejada.
- Se a mudança atinge o LLD, carregue a skill `lld` e use o modo atualizar dela, na mesma tarefa. Se atinge outro documento, avise o usuário; ele não muda por aqui.
- Não crie seção do molde nem reorganize. Se o documento está longe do molde, ou a mudança tocou muitas seções, faça só a mudança e recomende uma revisão.

**Ao gravar,** atualize a data, mantenha o status e resuma o que mudou, onde, o que foi para outro documento e o que você viu e não tocou.
